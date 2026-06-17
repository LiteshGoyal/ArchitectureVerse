import api from "@/lib/api";
import { Project } from "@/types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects/");
  return response.data;
};

export const createProject = async (data: {
  name: string;
  description?: string;
}): Promise<Project> => {
  const response = await api.post("/projects/", data);
  return response.data;
};

export const deleteProject = async (projectId: number) => {
  await api.delete(`/projects/${projectId}/`);
};

export const getProject = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/`);

  return response.data;
};


export const updateProject = async (projectId: string,data:{
  name?:string;
  description?:string;
}) => {
  const response = await api.put(`/projects/${projectId}/`,data);

  return response.data;
};


