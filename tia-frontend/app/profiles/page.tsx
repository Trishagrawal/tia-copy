"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getTiaProfiles, updateTiaProfile, deleteTiaProfile } from "@/lib/api";
import { Alert, Button, Input, Select, TextArea, LoadingSpinner, useToast } from "@/components";

interface TiaProfile {
  tia_profile_id: number;
  name: string;
  description: string | null;
  system_prompt: string;
  tone: string;
  expertise_area: string | null;
  is_default: boolean;
  user_id: number;
}

type EditData = {
  name: string;
  description: string;
  system_prompt: string;
  tone: string;
  expertise_area: string;
  is_default: boolean;
};

const TONE_OPTIONS = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "encouraging", label: "Encouraging" },
  { value: "critical", label: "Critical" },
  { value: "humorous", label: "Humorous" },
];

export default function ProfilesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addToast } = useToast();

  const [profiles, setProfiles] = useState<TiaProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditData>({
    name: "",
    description: "",
    system_prompt: "",
    tone: "formal",
    expertise_area: "",
    is_default: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      setLoading(true);
      setError("");

      const response = await getTiaProfiles(user.user_id);
      if (response.data) {
        setProfiles(response.data);
      } else if (response.error) {
        setError(response.error);
        addToast(response.error, "error");
      }

      setLoading(false);
    };

    fetchProfiles();
  }, [user, addToast]);

  const handleEdit = (profile: TiaProfile) => {
    setEditingId(profile.tia_profile_id);
    setEditData({
      name: profile.name,
      description: profile.description ?? "",
      system_prompt: profile.system_prompt,
      tone: profile.tone,
      expertise_area: profile.expertise_area ?? "",
      is_default: profile.is_default,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({
      name: "",
      description: "",
      system_prompt: "",
      tone: "formal",
      expertise_area: "",
      is_default: false,
    });
    setError("");
  };

  const handleSave = async (profileId: number) => {
    if (!user) return;

    if (!editData.name.trim()) {
      setError("Profile name is required");
      return;
    }

    if (!editData.system_prompt.trim()) {
      setError("System prompt is required");
      return;
    }

    setError("");

    const response = await updateTiaProfile(user.user_id, profileId, {
      name: editData.name.trim(),
      description: editData.description.trim() || undefined,
      system_prompt: editData.system_prompt.trim(),
      tone: editData.tone,
      expertise_area: editData.expertise_area.trim() || undefined,
      is_default: editData.is_default,
    });

    if (response.error) {
      setError(response.error);
      addToast(response.error, "error");
      return;
    }

    setProfiles((current) =>
      current.map((profile) =>
        profile.tia_profile_id === profileId
          ? {
              ...profile,
              name: editData.name.trim(),
              description: editData.description.trim() || null,
              system_prompt: editData.system_prompt.trim(),
              tone: editData.tone,
              expertise_area: editData.expertise_area.trim() || null,
              is_default: editData.is_default,
            }
          : profile
      )
    );
    setEditingId(null);
    addToast("Profile updated", "success");
  };

  const handleDelete = async (profileId: number) => {
    if (!user) return;

    const confirmed = window.confirm("Are you sure you want to delete this profile?");
    if (!confirmed) return;

    const response = await deleteTiaProfile(user.user_id, profileId);

    if (response.error) {
      setError(response.error);
      addToast(response.error, "error");
      return;
    }

    setProfiles((current) => current.filter((profile) => profile.tia_profile_id !== profileId));
    addToast("Profile deleted", "success");
  };

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
            <Link href="/profiles/new">
              <Button type="button" variant="primary">
                + New Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TIA Profiles</h1>
          <p className="mt-1 text-gray-600">Manage assistant personalities and prompts.</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} className="mb-6" />
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="font-medium text-gray-700">No profiles yet</p>
            <p className="mt-2 text-sm text-gray-500">Create your first profile to customize TIA.</p>
            <Link href="/profiles/new" className="inline-block mt-6">
              <Button type="button" variant="primary">
                Create your first profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {profiles.map((profile) => (
              <div key={profile.tia_profile_id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {editingId === profile.tia_profile_id ? (
                  <div className="space-y-4">
                    <Input
                      id={`profile-name-${profile.tia_profile_id}`}
                      label="Name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      required
                    />

                    <Select
                      id={`profile-tone-${profile.tia_profile_id}`}
                      label="Tone"
                      value={editData.tone}
                      onChange={(e) => setEditData({ ...editData, tone: e.target.value })}
                      options={TONE_OPTIONS}
                      required
                    />

                    <Input
                      id={`profile-expertise-${profile.tia_profile_id}`}
                      label="Expertise Area"
                      value={editData.expertise_area}
                      onChange={(e) => setEditData({ ...editData, expertise_area: e.target.value })}
                      placeholder="e.g., Climate Science"
                    />

                    <TextArea
                      id={`profile-system-${profile.tia_profile_id}`}
                      label="System Prompt"
                      value={editData.system_prompt}
                      onChange={(e) => setEditData({ ...editData, system_prompt: e.target.value })}
                      rows={5}
                      required
                    />

                    <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
                      <input
                        type="checkbox"
                        checked={editData.is_default}
                        onChange={(e) => setEditData({ ...editData, is_default: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Set as default profile
                    </label>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        onClick={() => handleSave(profile.tia_profile_id)}
                        variant="primary"
                        fullWidth
                      >
                        Save
                      </Button>
                      <Button type="button" onClick={handleCancelEdit} variant="secondary">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-900">{profile.name}</h2>
                        <p className="mt-1 text-sm text-gray-600 capitalize">Tone: {profile.tone}</p>
                      </div>
                      {profile.is_default && (
                        <span className="whitespace-nowrap rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Default
                        </span>
                      )}
                    </div>

                    {profile.description && (
                      <p className="mb-3 text-sm text-gray-600">{profile.description}</p>
                    )}

                    {profile.expertise_area && (
                      <p className="mb-3 text-sm text-gray-600">
                        <span className="font-medium">Expertise:</span> {profile.expertise_area}
                      </p>
                    )}

                    <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3">
                      <p className="mb-1 text-xs font-medium text-gray-600">System Prompt:</p>
                      <p className="line-clamp-3 text-xs text-gray-700">{profile.system_prompt}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => handleEdit(profile)}
                        variant="secondary"
                        fullWidth
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleDelete(profile.tia_profile_id)}
                        variant="danger"
                        fullWidth
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
