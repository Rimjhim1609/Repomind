import { api } from '~/trpc/react';
import { useLocalStorage } from 'usehooks-ts';

const useProject = () => {
  const { data: projects, isLoading, refetch } = api.project.getProjects.useQuery();
  const [projectId, setProjectId] = useLocalStorage('repomind-project-id', '');

  // Select matching project, or default to first project if available
  const project = projects?.find((p) => p.id === projectId) ?? projects?.[0];

  return {
    project,
    projects: projects || [],
    projectId: project?.id ?? projectId,
    setProjectId,
    isLoading,
    refetch,
  };
};

export default useProject;