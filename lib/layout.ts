import dagre from "dagre"

import { Node, Edge } from "@xyflow/react"

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(()=>({}))

export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[]
)=>{
    dagreGraph.setGraph({
        rankdir:"TB",
    })


    nodes.forEach((node)=>{
        dagreGraph.setNode(node.id,{
            width:180,
            height:60,
        })
    })


    edges.forEach((edge)=>{
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    const layoutedNodes = nodes.map(
        (node)=>{
            const nodeWithPosition = dagreGraph.node(node.id)

            return{
                ...node,
                position:{
                    x:nodeWithPosition.x-90,
                    y:nodeWithPosition.y-30,
                }
            }
        }
    )
    return{
        nodes:layoutedNodes,
        edges
    }
}