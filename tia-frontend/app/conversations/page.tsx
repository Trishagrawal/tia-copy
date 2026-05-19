"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getConversations,
  getTiaProfiles,
  getProjects,
  createConversation,
} from "@/lib/api";
import { Alert, Button, LoadingSpinner, Select, Input, useToast } from "@/components";

interface Conversation {
  conversation_id: number;
  title: string;
  project_id: number;
  tia_profile_id: number;
  is_archived: boolean;
  created_at: string;
}

interface Project {
  project_id: number;
  title: string;
}

interface TiaProfile {
  tia_profile_id: number;
  name: string;
}

export default function ConversationsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tiaProfiles, setTiaProfiles] = useState<TiaProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newConvTitle, setNewConvTitle] = useState("");
  const [newConvProjectId, setNewConvProjectId] = useState<string>("");
  const [newConvProfileId, setNewConvProfileId] = useState<string>("");
  const [newConvError, setNewConvError] = useState("");
  const [creatingConv, setCreatingConv] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project_id");

    if (projectId) {
      window.setTimeout(() => {
        setShowNewForm(true);
        setNewConvProjectId(projectId);
      }, 0);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      const [convResponse, projResponse, profileResponse] = await Promise.all([
        getConversations(),
        getProjects(),
        getTiaProfiles(user.user_id),
      ]);

      if (convResponse.data) setConversations(convResponse.data);
      if (projResponse.data) setProjects(projResponse.data);
      if (profileResponse.data) setTiaProfiles(profileResponse.data);

      const firstError = convResponse.error || projResponse.error || profileResponse.error;
      if (firstError) {
        addToast(firstError, "error");
      }

      setLoading(false);
    };

    fetchData();
  }, [user, addToast]);

  const activeConversations = useMemo(
    () => conversations.filter((conversation) => !conversation.is_archived),
    [conversations]
  );

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewConvError("");

    if (!newConvTitle.trim()) {
      setNewConvError("Conversation title is required");
      return;
    }

    if (!newConvProjectId) {
      setNewConvError("Please select a project");
      return;
    }

    if (!newConvProfileId) {
      setNewConvError("Please select a TIA profile");
      return;
    }

    setCreatingConv(true);
    const response = await createConversation({
      title: newConvTitle.trim(),
      project_id: Number(newConvProjectId),
      tia_profile_id: Number(newConvProfileId),
    });

    if (response.error) {
      setNewConvError(response.error);
      addToast(response.error, "error");
      setCreatingConv(false);
      return;
    }

    if (response.data?.conversation_id) {
      addToast("Conversation created", "success");
      router.push(`/conversations/${response.data.conversation_id}`);
      return;
    }

    setNewConvError("Conversation created but no conversation id was returned.");
    setCreatingConv(false);
  };

  const getProjectName = (pid: number) =>
    projects.find((project) => project.project_id === pid)?.title || `Project ${pid}`;

  const getProfileName = (pid: number) =>
    tiaProfiles.find((profile) => profile.tia_profile_id === pid)?.name || `Profile ${pid}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
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
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
                <p className="text-gray-600 mt-1">
                  Continue existing chats or start a new discussion with TIA.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setShowNewForm((value) => !value)}
                variant="primary"
              >
                {showNewForm ? "Hide Form" : "+ New Conversation"}
              </Button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-10 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {activeConversations.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-700 font-medium">No active conversations yet</p>
                    <p className="text-gray-500 text-sm mt-2">Create one to start working with TIA.</p>
                    <Button
                      type="button"
                      onClick={() => setShowNewForm(true)}
                      variant="primary"
                      className="mt-6"
                    >
                      Start a conversation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeConversations.map((conversation) => (
                      <Link
                        key={conversation.conversation_id}
                        href={`/conversations/${conversation.conversation_id}`}
                        className="block"
                      >
                        <article className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 hover:shadow-md transition">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h2 className="font-semibold text-gray-900 truncate">
                                {conversation.title}
                              </h2>
                              <p className="text-xs text-gray-500 mt-1">
                                {getProjectName(conversation.project_id)} • {getProfileName(conversation.tia_profile_id)}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(conversation.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="lg:col-span-1">
            {showNewForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Start New Conversation</h2>

                {newConvError && (
                  <Alert
                    type="error"
                    message={newConvError}
                    onClose={() => setNewConvError("")}
                    className="mb-4"
                  />
                )}

                <form onSubmit={handleCreateConversation} className="space-y-4">
                  <Input
                    id="conversation-title"
                    label="Title"
                    type="text"
                    placeholder="e.g. Research methodology"
                    value={newConvTitle}
                    onChange={(e) => setNewConvTitle(e.target.value)}
                    required
                  />

                  <Select
                    id="conversation-project"
                    label="Project"
                    value={newConvProjectId}
                    onChange={(e) => setNewConvProjectId(e.target.value)}
                    required
                    options={projects.map((project) => ({
                      value: String(project.project_id),
                      label: project.title,
                    }))}
                  />

                  <Select
                    id="conversation-profile"
                    label="TIA Profile"
                    value={newConvProfileId}
                    onChange={(e) => setNewConvProfileId(e.target.value)}
                    required
                    options={tiaProfiles.map((profile) => ({
                      value: String(profile.tia_profile_id),
                      label: profile.name,
                    }))}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      loading={creatingConv}
                      disabled={creatingConv}
                      variant="primary"
                      fullWidth
                    >
                      {creatingConv ? "Starting..." : "Start Conversation"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowNewForm(false)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {!showNewForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-sm text-gray-600 mb-4">Create a new conversation from a project page or expand this panel.</p>
                <Button type="button" onClick={() => setShowNewForm(true)} variant="primary" fullWidth>
                  Open New Conversation Form
                </Button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
