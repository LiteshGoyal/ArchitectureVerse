import api from "@/lib/api";

export const createShareLink = async(projectId:string)=>{
    const response = await api.post(`/projects/${projectId}/share/`)
    return response.data
}


export const getSharedDiagram = async(shareId: string)=>{
    const response = await api.get(`/share/${shareId}/`)
    return response.data
}

