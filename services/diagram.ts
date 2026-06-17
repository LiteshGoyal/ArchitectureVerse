import api from "@/lib/api";

export const getDiagram = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/diagram/`);

  return response.data;
};

export const saveDiagram = async (projectId: string, data: any) => {
  const response = await api.put(`/projects/${projectId}/diagram/`, data);

  return response.data;
};
