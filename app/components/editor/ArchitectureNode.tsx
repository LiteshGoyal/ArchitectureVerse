"use client";

import { Handle, Position } from "@xyflow/react";

interface Props {
  data: {
    label: string;
  };
}

export default function ArchitectureNode({ data }: Props) {
  const label = data.label.toLowerCase();
  let bgColor = "bg-gray-100";
  if (label.includes("frontend")) {
    bgColor = "bg-blue-200";
  }
  if (label.includes("backend")) {
    bgColor = "bg-green-200";
  }
  if (label.includes("database")) {
    bgColor = "bg-purple-200";
  }
  if (label.includes("redis")) {
    bgColor = "bg-red-200";
  }
  if (label.includes("queue")) {
    bgColor = "bg-orange-200";
  }
  if (label.includes("react") || label.includes("next")) {
    bgColor = "bg-blue-200";
  }

  if (
    label.includes("django") ||
    label.includes("fastapi") ||
    label.includes("node")
  ) {
    bgColor = "bg-green-200";
  }

  if (
    label.includes("postgres") ||
    label.includes("mysql") ||
    label.includes("mongo")
  ) {
    bgColor = "bg-purple-200";
  }

  return (
    <div
      className={`px-4 py-4 rounded-lg border shadow min-w-[120px] text-center ${bgColor}`}
    >
      <Handle type="target" position={Position.Top} /> {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
