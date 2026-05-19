"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createTiaProfile } from "@/lib/api";
import {
  Input,
  Select,
  TextArea,
  Checkbox,
  Button,
  Alert,
  useToast,
} from "@/components";
import Link from "next/link";

export default function NewProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addToast } = useToast();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [tone, setTone] = useState("formal");
  const [expertiseArea, setExpertiseArea] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Profile name is required";
    if (!systemPrompt.trim())
      newErrors.systemPrompt = "System prompt is required";
    if (systemPrompt.length < 20)
      newErrors.systemPrompt =
        "System prompt should be at least 20 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    if (!validateForm()) {
      addToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);

    const response = await createTiaProfile(user.user_id, {
      name,
      description,
      system_prompt: systemPrompt,
      tone,
      expertise_area: expertiseArea,
      is_default: isDefault,
    });

    if (response.error) {
      setError(response.error);
      addToast(response.error, "error");
      setLoading(false);
      return;
    }

    addToast("Profile created successfully!", "success");
    router.push("/profiles");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/profiles"
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 transition"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Profiles
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create TIA Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Define a personality and behavior for your AI assistant
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <Input
              id="profile-name"
              label="Profile Name"
              type="text"
              placeholder="e.g., Research Assistant, Mentor, Critic"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              error={errors.name}
              helperText="Give your AI assistant a distinctive name"
              required
            />

            {/* Description */}
            <Input
              id="profile-description"
              label="Description"
              type="text"
              placeholder="Brief description of this profile"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="A short summary of what this profile does"
            />

            {/* Tone & Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                id="profile-tone"
                label="Tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                options={[
                  { value: "formal", label: "Formal" },
                  { value: "casual", label: "Casual" },
                  { value: "encouraging", label: "Encouraging" },
                  { value: "critical", label: "Critical" },
                  { value: "humorous", label: "Humorous" },
                ]}
                helperText="How should this profile communicate?"
                required
              />

              <Input
                id="profile-expertise"
                label="Expertise Area"
                type="text"
                placeholder="e.g., Climate Science, Literature"
                value={expertiseArea}
                onChange={(e) => setExpertiseArea(e.target.value)}
                helperText="Area of specialization"
              />
            </div>

            {/* System Prompt */}
            <TextArea
              id="profile-systemprompt"
              label="System Prompt"
              placeholder="Define how this AI assistant should behave, what expertise it has, and how it should communicate..."
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value);
                if (errors.systemPrompt)
                  setErrors({ ...errors, systemPrompt: "" });
              }}
              error={errors.systemPrompt}
              rows={8}
              helperText="Example: 'You are a supportive research mentor with expertise in environmental science. Help students by asking clarifying questions and suggesting next steps. Be encouraging but critical of weak arguments.'"
              required
            />

            {/* Default Profile Checkbox */}
            <div className="border-t border-gray-200 pt-6">
              <Checkbox
                id="profile-default"
                label="Set as default profile"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <p className="text-xs text-gray-500 mt-2">
                This profile will be selected by default in new conversations
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                className="flex-1"
              >
                {loading ? "Creating..." : "Create Profile"}
              </Button>
              <Link href="/profiles" className="flex-1">
                <Button type="button" variant="secondary" fullWidth>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
