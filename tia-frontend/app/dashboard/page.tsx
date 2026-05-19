"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProjects, getTiaProfiles } from "@/lib/api";
import { Button, LoadingSpinner, Alert, useToast } from "@/components";
import Link from "next/link";

interface Project {
  project_id: number;
  title: string;
  description: string | null;
  status: string;
  main_deadline: string | null;
  owner_user_id: number;
  course_code: string | null;
}

interface TiaProfile {
  tia_profile_id: number;
  name: string;
  tone: string;
  is_default: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { addToast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tiaProfiles, setTiaProfiles] = useState<TiaProfile[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [profilesError, setProfilesError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        setProjectsError("");
        const response = await getProjects();
        if (response.error) {
          setProjectsError(response.error);
          addToast(response.error, "error");
        } else if (response.data) {
          setProjects(response.data);
        }
        setProjectsLoading(false);
      };

      const fetchProfiles = async () => {
        setProfilesError("");
        const response = await getTiaProfiles(user.user_id);
        if (response.error) {
          setProfilesError(response.error);
          addToast(response.error, "error");
        } else if (response.data) {
          setTiaProfiles(response.data);
        }
        setProfilesLoading(false);
      };

      fetchProjects();
      fetchProfiles();
    }
  }, [user, addToast]);

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "success");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return "bg-green-100 text-green-700 border border-green-200";
      case "planning":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "submitted":
        return "bg-indigo-100 text-indigo-700 border border-indigo-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "archived":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const formatStatus = (status: string) =>
    status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TIA</h1>
                  <p className="text-xs text-gray-600">
                    The Innovative Assistant
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="danger"
                size="sm"
                className="px-4 py-2"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Column */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
              <Link href="/projects/new">
                <Button variant="primary" size="sm">
                  + New Project
                </Button>
              </Link>
            </div>

            {projectsError && (
              <Alert
                type="error"
                message={projectsError}
                onClose={() => setProjectsError("")}
                className="mb-6"
              />
            )}

            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600 font-medium mb-4">No projects yet</p>
                <p className="text-gray-500 text-sm mb-6">
                  Create your first project to get started
                </p>
                <Link href="/projects/new">
                  <Button variant="primary">Create Your First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link
                    key={project.project_id}
                    href={`/projects/${project.project_id}`}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getStatusBadgeColor(
                            project.status
                          )}`}
                        >
                          {formatStatus(project.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                        {project.course_code && (
                          <span className="text-gray-500">{project.course_code}</span>
                        )}
                        {project.main_deadline && (
                          <span>
                            Due:{" "}
                            {new Date(project.main_deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* TIA Profiles Column */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">TIA Profiles</h2>
              <Link href="/profiles/new">
                <Button variant="primary" size="sm">
                  +
                </Button>
              </Link>
            </div>

            {profilesError && (
              <Alert
                type="error"
                message={profilesError}
                onClose={() => setProfilesError("")}
                className="mb-6"
              />
            )}

            {profilesLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
            ) : tiaProfiles.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <svg
                  className="w-8 h-8 text-gray-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  No TIA profiles yet
                </p>
                <Link href="/profiles/new">
                  <Button variant="primary" size="sm" fullWidth>
                    Create Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tiaProfiles.map((profile) => (
                  <Link
                    key={profile.tia_profile_id}
                    href={`/profiles/${profile.tia_profile_id}`}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-indigo-200 transition cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                            {profile.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {profile.tone}
                          </p>
                        </div>
                        {profile.is_default && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium whitespace-nowrap ml-2">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Quick Links */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link href="/conversations">
                  <div className="px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition text-sm font-medium text-gray-700 hover:text-indigo-600 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Conversations
                  </div>
                </Link>
                <Link href="/profiles">
                  <div className="px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition text-sm font-medium text-gray-700 hover:text-indigo-600 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    All Profiles
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
