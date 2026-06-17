"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

import { getProjects, createProject, deleteProject } from "@/services/projects";
import { Project } from "@/types/project";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      await createProject({ name, description });
      setName("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteProject = async (projectId: number) => {
    try {
      await deleteProject(projectId);
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome {user?.username}</h1>

      <p className="mb-8">Manage your architectures</p>

      <div className="space-y-4 mb-8">
        <input
          className="border p-2 w-full"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleCreateProject} className="border px-4 py-2">
          Create Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border p-4 rounded">
            <Link href={`/projects/${project.id}`}>
              <h2 className="font-semibold">{project.name}</h2>
            </Link>

            <p>{project.description}</p>

            <button onClick={() => handleDeleteProject(project.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
