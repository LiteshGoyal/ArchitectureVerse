import { Node, Edge } from "@xyflow/react";

export const generateDocumentation = (nodes: Node[], edges: Edge[]) => {
  const frontend: string[] = [];
  const backend: string[] = [];
  const database: string[] = [];
  const infrastructure: string[] = [];
  const nodeMap = new Map();

  nodes.forEach((node) => {
    const label=String(node.data.label)
    nodeMap.set(node.id, node.data.label);
    const lower=label.toLowerCase()

    if (
      lower.includes("react") ||
      lower.includes("next") ||
      lower.includes("vue") ||
      lower.includes("angular")
    ) {
      frontend.push(label);
    } else if (
      lower.includes("django") ||
      lower.includes("fastapi") ||
      lower.includes("node") ||
      lower.includes("spring")
    ) {
      backend.push(label);
    } else if (
      lower.includes("postgres") ||
      lower.includes("mysql") ||
      lower.includes("mongo") ||
      lower.includes("redis")
    ) {
      database.push(label);
    } else {
      infrastructure.push(label);
    }
  });

  let docs = "#Architecture Overview \n\n";

  docs+="## Frontend\n"

  frontend.forEach((item)=>{
    docs += `- ${item}\n`
  })
  
  docs += "\n## Backend\n"
  
  backend.forEach((item)=>{
    docs += `- ${item}\n`
  })

  docs += "\n## Database\n"

  database.forEach((item)=>{
    docs+= ` - ${item}\n`
  })

  if (infrastructure.length>0){
    docs+= "\n## Infrastructure\n"

    infrastructure.forEach((item)=>{
        docs+= ` - ${item}\n`
    })

  }




  docs += "\n## Architecture Flow\n\n";

//   nodes.forEach((node) => {
//     docs += ` - ${node.data.label}\n`;
//   });

//   docs += "\n## Connections \n\n";

  edges.forEach((edge) => {
    docs += ` - ${nodeMap.get(edge.source)} -> ${nodeMap.get(edge.target)}\n`;
  });

  docs += "\n\n## Summary\n\n"

  docs += `This architecture contains ${nodes.length} components and ${edges.length} connections`

  return docs;
};
