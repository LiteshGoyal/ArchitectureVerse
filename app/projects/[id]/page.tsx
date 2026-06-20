"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ArchitectureEditor from "@/app/components/editor/ArchitectureEditor";

import { getProject, updateProject } from "@/services/projects";
import { Project } from "@/types/project";
import DashboardSkeleton from "@/app/components/DashboardSkelton";
import {
  inviteCollaborator,
  getCollaborators,
  removeCollaborator,
} from "@/services/projects";

import { Collaborator } from "@/types/collaborator";

import toast from "react-hot-toast";

export default function ProjectPage() {
  const params = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

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
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      const data = await getCollaborators(params.id as string);

      setCollaborators(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvite = async () => {
    try {
      if (!email) {
        toast.error("Please enter email");
        return;
      }

      await inviteCollaborator(params.id as string, email);

      toast.success("Collaborator added");

      setEmail("");

      fetchCollaborators();
    } catch (error) {
      console.error(error);

      toast.error("Failed to invite");
    }
  };

  const handleRemove = async (userId: number) => {
    try {
      await removeCollaborator(params.id as string, userId);

      toast.success("Collaborator removed");

      fetchCollaborators();
    } catch (error) {
      console.error(error);

      toast.error("Failed to remove");
    }
  };

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
    return <DashboardSkeleton />;
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

      <div className="border-b p-4 bg-white">
        <h2 className="font-semibold text-lg">Collaborators</h2>

        <div className="flex gap-2 mt-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border px-3 py-2"
          />

          <button onClick={handleInvite} className="border px-4 py-2">
            Invite
          </button>
        </div>

        <div className="mt-3">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex justify-between border-b py-2"
            >
              <div>
                <div>{collaborator.username}</div>

                <div className="text-sm text-gray-500">
                  {collaborator.email}
                </div>
              </div>

              <button
                onClick={() => handleRemove(collaborator.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <ArchitectureEditor
          projectId={params.id as string}
          projectName={project.name}
        />
      </div>
    </div>
  );
}
