"use client";

import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import "@xyflow/react/dist/style.css";

import { getSharedDiagram } from "@/services/share";
import ArchitectureNode from "@/app/components/editor/ArchitectureNode";

export default function SharedArchitecturePage() {
  const nodeTypes = useMemo(
    () => ({
      architectureNode: ArchitectureNode,
    }),
    [],
  );
  const params = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const loadDiagram = async () => {
    try {
      const data = await getSharedDiagram(params.shareId as string);

      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDiagram();
  }, []);

  return (
    <div className="h-screen">
      <div className="border-b p-4 bg-white">
        <h1 className="text-2xl font-bold">Shared Architecture</h1>

        <p className="text-gray-500">View-only architecture diagram</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
