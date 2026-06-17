import api from "@/lib/api";

export const reviewArchitecture = async (projectId:string,documentation: string) => {
  const response = await api.post("/ai/review/", {
    project_id: projectId,
    documentation,
  });

  return response.data;
};

export const generateArchitecture = async (prompt: string) => {
  const response = await api.post("/ai/generate/", {
    prompt,
  });

  return response.data;
};

export const explainArchitecture = async (documentation: string) => {
  const response = await api.post("/ai/explain/", {
    documentation,
  });

  return response.data;
};

export const chatWithArchitecture = async (projectId:string, documentation: string, question:string) => {
  const response = await api.post("/ai/chat/", {
    project_id:projectId,documentation,question,
  });

  return response.data;
};


export const getChatHistory = async(projectId:string)=>{
  const response  = await api.get(`/ai/history/${projectId}/`)

  return response.data
}

export const improveArchitecture = async(documentation:string)=>{
  const response  = await api.post(`/ai/improve/`,{documentation})
  
  return response.data
}
  
export const getReviewHistory = async(projectId:string)=>{
  const response  = await api.get(`/ai/reviews/${projectId}/`)
  
  return response.data
}