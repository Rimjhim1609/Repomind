import { storeGithubRepoFiles } from "../src/lib/github-loader";
import { db } from "../src/server/db";

const [projectId, repoUrl] = process.argv.slice(2);

if (!projectId || !repoUrl) {
  console.error("Usage: npx tsx --env-file=.env scripts/test-ingest.ts <projectId> <githubUrl>");
  process.exit(1);
}

const result = await storeGithubRepoFiles(projectId, repoUrl);
console.log("Result:", result);

await db.$disconnect();