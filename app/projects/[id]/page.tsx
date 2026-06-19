"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ArchitectureEditor from "@/app/components/editor/ArchitectureEditor";

import { getProject, updateProject } from "@/services/projects";
import { Project } from "@/types/project";

export default function ProjectPage() {
  const params = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProject = async () => {
    try {
      const data = await getProject(params.id as string);

      setProject(data);
      setName(data.name);
      setDescription(data.description || "");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProject();
  }, []);

  const handleUpdateProject = async () => {
    try {
      const updated = await updateProject(params.id as string, {
        name,
        description,
      });
      setProject(updated);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!project) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">

        {/* {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full text-2xl font-bold"
          />
        ) : (
          <h1 className="text-2xl font-bold">{project.name}</h1>
        )}

        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full mt-2"
          />
        ) : (
          <p className="text-gray-600 mt-1">{project.description}</p>
        )} */}



        {/* <div className="mt-4 flex gap-2">
          {isEditing ? (
            <button onClick={handleUpdateProject} className="border px-4 py-2">
              Save Project
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="border px-4 py-2"
            >
              Edit Project
            </button>
          )}
        </div> */}

      <div className="flex-1">
        <ArchitectureEditor projectId={params.id as string} projectName={project.name}/>
      </div>
    </div>
  );
}
