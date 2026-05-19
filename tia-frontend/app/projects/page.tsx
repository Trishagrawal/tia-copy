"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProjects } from "@/lib/api";
import { Alert, Button, LoadingSpinner, useToast } from "@/components";

interface Project {
  project_id: number;
  title: string;
  description: string | null;
  status: string;
  main_deadline: string | null;
  course_code: string | null;
}

const STATUS_CLASSES: Record<string, string> = {
  planning: "bg-purple-100 text-purple-700 border border-purple-200",
  in_progress: "bg-green-100 text-green-700 border border-green-200",
  submitted: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  completed: "bg-blue-100 text-blue-700 border border-blue-200",
  archived: "bg-gray-100 text-gray-700 border border-gray-200",
};

const formatStatus = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addToast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      const response = await getProjects();
      if (response.data) {
        setProjects(response.data);
      } else if (response.error) {
        setError(response.error);
        addToast(response.error, "error");
      }

      setLoading(false);
    };

    fetchProjects();
  }, [user, addToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">
              ← Back to Dashboard
            </Link>
            <Link href="/projects/new">
              <Button type="button" variant="primary">
                + New Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-gray-600">Track research work and jump into the project workspace.</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} className="mb-6" />
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="font-medium text-gray-700">No projects yet</p>
            <p className="mt-2 text-sm text-gray-500">Create your first project to get started.</p>
            <Link href="/projects/new" className="inline-block mt-6">
              <Button type="button" variant="primary">
                Create your first project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {projects.map((project) => (
              <Link key={project.project_id} href={`/projects/${project.project_id}`} className="block">
                <article className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-gray-900">{project.title}</h2>
                      {project.course_code && (
                        <p className="mt-1 text-sm text-gray-500">{project.course_code}</p>
                      )}
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASSES[project.status] || "bg-gray-100 text-gray-700 border border-gray-200"}`}
                    >
                      {formatStatus(project.status)}
                    </span>
                  </div>

                  {project.description && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">{project.description}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Open project workspace</span>
                    {project.main_deadline ? (
                      <span>Due {new Date(project.main_deadline).toLocaleDateString()}</span>
                    ) : (
                      <span>No deadline set</span>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
