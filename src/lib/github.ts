import { Octokit } from "octokit";
import { db } from "~/server/db";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";
import { sanitizeGithubToken } from "./github-loader";

export function getOctokit(token?: string) {
  const validToken = sanitizeGithubToken(token);
  return new Octokit(validToken ? { auth: validToken } : {});
}

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (githubUrl: string, token?: string): Promise<Response[]> => {
  const cleanUrl = githubUrl.replace(/\.git$/, "").replace(/\/$/, "");
  const parts = cleanUrl.split("/").filter(Boolean);
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1];

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL format");
  }

  const octokitInstance = getOctokit(token);

  try {
    const { data } = await octokitInstance.rest.repos.listCommits({
      owner,
      repo,
      per_page: 15,
    });

    const sortedCommits = data.sort(
      (a: any, b: any) =>
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    );

    return sortedCommits.slice(0, 10).map((commit: any) => ({
      commitHash: commit.sha as string,
      commitMessage: commit.commit?.message ?? "Update",
      commitAuthorName: commit.commit?.author?.name ?? commit.author?.login ?? "Developer",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit?.author?.date ?? new Date().toISOString(),
    }));
  } catch (error: any) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error?.message || error);
    return [];
  }
};

export const pollCommits = async (projectId: string) => {
  try {
    const { githubUrl, gitHubToken } = await fetchProjectGithubInfo(projectId);
    const commitHashes = await getCommitHashes(githubUrl, gitHubToken);

    if (commitHashes.length === 0) {
      console.log(`No commits found to poll for project ${projectId}`);
      return { count: 0 };
    }

    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);

    if (unprocessedCommits.length === 0) {
      console.log(`All ${commitHashes.length} commits already indexed for project ${projectId}`);
      return { count: 0 };
    }

    console.log(`Processing ${unprocessedCommits.length} new commits for project ${projectId}...`);

    const summaryResponse = await Promise.allSettled(
      unprocessedCommits.map(async (commit) => {
        return summariseCommit(githubUrl, commit.commitHash, gitHubToken);
      })
    );

    const summaries = summaryResponse.map((response) => {
      if (response.status === "fulfilled") {
        return response.value as string;
      }
      return "Commit changes recorded";
    });

    const commits = await db.commit.createMany({
      data: unprocessedCommits.map((commit, index) => ({
        projectId,
        commitHash: commit.commitHash,
        commitMessage: commit.commitMessage,
        commitAuthorName: commit.commitAuthorName,
        commitAuthorAvatar: commit.commitAuthorAvatar,
        commitDate: new Date(commit.commitDate),
        summary: summaries[index] || "Commit changes recorded",
      })),
      skipDuplicates: true,
    });

    console.log(`Commits successfully created: ${commits.count}`);
    return commits;
  } catch (error) {
    console.error(`Error in pollCommits for project ${projectId}:`, error);
    return { count: 0 };
  }
};

async function summariseCommit(githubUrl: string, commitHash: string, token?: string) {
  try {
    const validToken = sanitizeGithubToken(token);
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "RepoMind-App",
    };
    if (validToken) {
      headers["Authorization"] = `token ${validToken}`;
    }

    const cleanUrl = githubUrl.replace(/\.git$/, "");
    const { data } = await axios.get(`${cleanUrl}/commit/${commitHash}.diff`, {
      headers,
      timeout: 10000,
    });

    const summary = await aiSummariseCommit(data);
    return summary ? summary : "Code changes summarized";
  } catch (error: any) {
    console.warn(`Could not fetch diff for commit ${commitHash}:`, error?.message || error);
    return "Commit details indexed";
  }
}

async function fetchProjectGithubInfo(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      repoUrl: true,
      gitHubToken: true,
    },
  });

  if (!project?.repoUrl) {
    throw new Error("Project has no repository URL");
  }

  return {
    githubUrl: project.repoUrl,
    gitHubToken: project.gitHubToken ?? undefined,
  };
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
  const processedCommits = await db.commit.findMany({
    where: {
      projectId,
    },
    select: {
      commitHash: true,
    },
  });

  const processedSet = new Set(processedCommits.map((c) => c.commitHash));
  return commitHashes.filter((commit) => !processedSet.has(commit.commitHash));
}
