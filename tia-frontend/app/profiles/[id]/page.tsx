"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTiaProfiles, updateTiaProfile } from "@/lib/api";
import Link from "next/link";

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

export default function ProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = parseInt(params.id as string);
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<TiaProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<TiaProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user || Number.isNaN(profileId)) return;

    const fetchProfile = async () => {
      const response = await getTiaProfiles(user.user_id);
      if (response.data) {
        const found = response.data.find(
          (p: TiaProfile) => p.tia_profile_id === profileId
        );
        if (found) {
          setProfile(found);
          setFormData(found);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, profileId]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    setError("");

    if (!formData.name?.trim()) {
      setError("Profile name is required");
      setSaving(false);
      return;
    }

    if (!formData.system_prompt?.trim()) {
      setError("System prompt is required");
      setSaving(false);
      return;
    }

    const response = await updateTiaProfile(user.user_id, profileId, {
      name: formData.name?.trim(),
      description: formData.description?.trim() || undefined,
      system_prompt: formData.system_prompt?.trim(),
      tone: formData.tone,
      expertise_area: formData.expertise_area?.trim() || undefined,
      is_default: formData.is_default,
    });

    if (response.error) {
      setError(response.error);
      setSaving(false);
      return;
    }

    setProfile({ ...profile, ...formData } as TiaProfile);
    setIsEditing(false);
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8 text-red-600">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/profiles" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Profiles
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {isEditing ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Edit Profile
              </h1>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Profile Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tone *
                    </label>
                    <select
                      value={formData.tone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, tone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="formal">Formal</option>
                      <option value="casual">Casual</option>
                      <option value="encouraging">Encouraging</option>
                      <option value="critical">Critical</option>
                      <option value="humorous">Humorous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Expertise Area
                    </label>
                    <input
                      type="text"
                      value={formData.expertise_area || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expertise_area: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    System Prompt *
                  </label>
                  <textarea
                    value={formData.system_prompt || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        system_prompt: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    rows={8}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.is_default || false}
                    onChange={(e) =>
                      setFormData({ ...formData, is_default: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isDefault" className="ml-3 text-sm font-medium text-gray-900">
                    Set as default profile
                  </label>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Tone: <span className="font-medium capitalize">{profile.tone}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {profile.is_default && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Default
                    </span>
                  )}
                </div>
              </div>

              {profile.description && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-700">{profile.description}</p>
                </div>
              )}

              {profile.expertise_area && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-900">
                    Expertise Area:
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {profile.expertise_area}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  System Prompt:
                </p>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {profile.system_prompt}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
                <Link
                  href="/profiles"
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 text-center"
                >
                  Back
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
