import api from "@/lib/api";

export interface User{
    id: number;
    username: string;
    email: string;
}

export const login = async(username: string, password: string)=>{
    const response = await api.post("/auth/login/",{
        username,password
    })

    return response.data
}

