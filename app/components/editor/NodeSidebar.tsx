'use client'

import { nodeTemplates } from "@/data/nodeTemplates"
interface Props{
    onAddNode:(label:string)=> void;
}


export default function NodeSidebar({onAddNode,}:Props){
    return(
        <div className="w-64 border-r p-4 hidden md:flex md:flex-col">
            <h2 className="font-bold mb-4">
                Components
            </h2>
            <div className="space-y-2">
                {nodeTemplates.map((item)=>(
                    <button key={item} onClick={()=>onAddNode(item)} className="w-full border p-2 text-left">{item}</button>
                ))}
            </div>
        </div>
    )
}
