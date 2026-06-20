"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

import { getProjects, createProject, deleteProject } from "@/services/projects";
import { Project } from "@/types/project";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { Trash, MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import DashboardSkeleton from "../components/DashboardSkelton";



export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.toReversed());
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
      toast.success(`Project ${name} created`)
    } catch (error) {
      console.error(error);
      toast.error(`Failed to create project ${name}`)
    }
  };
  const handleDeleteProject = async (projectId: number) => {
    try {
      await deleteProject(projectId);
      fetchProjects();
      toast.success("Deleted project")
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete")
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <ProtectedRoute>
      <div className="relative mx-auto p-8 pt-48 font-display">
        <h1 className="text-5xl font-bold mb-2">
          Welcome back, {user?.username}
        </h1>

        <p className="mb-8 text-xl text-gray-500">
          Here&apos;s what&apos;s happening with you architectures
        </p>
        <hr />
        <br />
        <div className="flex flex-col md:flex-row space-x-8">
          <div className="md:sticky top-0 self-start">
            <h1 className="text-3xl font-semibold">Start new Project</h1>
            <p className="mb-8 text-md text-gray-500">
              Name it and describe your system — generate the rest with AI
            </p>
            <div className="space-y-4 mb-8">
              <input
                className="border p-2 w-full border-gray-300"
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="border p-2 w-full border-gray-300"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={handleCreateProject}
                className="border px-4 py-2 cursor-pointer hover:bg-[#4f46e5] hover:text-white rounded-md"
              >
                Create Project
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col overflow-hidden md:w-[500px] transition-all duration-300 bg-white border border-gray-200 hover:border-l-4 hover:border-l-[#4f46e5] rounded-md hover:shadow-xl"
              >
                <div className="flex p-4 space-x-4 justify-between">
                  <div>
                    <p className="text-3xl bg-[#4F46E5] text-white p-4 rounded-full">
                      {project.name[0].toUpperCase()}
                    </p>
                  </div>
                  <div className="">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {project.name}
                      </h1>
                    </div>
                    <h3 className="text-sm sm:text-base  text-gray-600 mt-2.5 flex-1 hover:text-[#4F46E5] transition-all duratin-200">
                      <p title="">
                        {project.description}
                      </p>
                    </h3>
                  </div>
                  <div className="flex items-end  justify-right">
                    <div className="sm:flex sm:items-center lg:flex-col xl:flex-row lg:items-start xl:items-center">
                      
                      <button
                        className="flex  m-3 cursor-pointer duration-200 transition-all hover:scale-105 hover:text-gray-500"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
                <div className="flex justify-between">
                <div className="text-gray-700 p-2">Created at: <span className="text-gray-500">{project.created_at.split("T")[0]}</span></div>
                <Link href={`projects/${project.id}`} className="text-gray-500 p-2 flex space-x-2 hover:text-gray-700">Open <MoveRight /> </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
