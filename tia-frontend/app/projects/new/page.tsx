"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createProject } from "@/lib/api";
import {
  Input,
  Select,
  TextArea,
  Button,
  Alert,
  useToast,
} from "@/components";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addToast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [status, setStatus] = useState("planning");
  const [mainDeadline, setMainDeadline] = useState("");
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
    if (!title.trim()) newErrors.title = "Project title is required";
    if (!status) newErrors.status = "Status is required";
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

    const response = await createProject({
      title,
      description,
      course_code: courseCode,
      status,
      main_deadline: mainDeadline || undefined,
    });

    if (response.error) {
      setError(response.error);
      addToast(response.error, "error");
      setLoading(false);
      return;
    }

    addToast("Project created successfully!", "success");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
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
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Project
            </h1>
            <p className="text-gray-600 mt-2">
              Set up a new research project and start collaborating
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
            {/* Title */}
            <Input
              id="project-title"
              label="Project Title"
              type="text"
              placeholder="e.g., Climate Change Mitigation Research"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              error={errors.title}
              required
            />

            {/* Description */}
            <TextArea
              id="project-description"
              label="Description"
              placeholder="Describe your research project, objectives, and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              helperText="Provide context about what this project entails"
            />

            {/* Course Code & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="project-coursecode"
                label="Course Code"
                type="text"
                placeholder="e.g., CS 401"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                helperText="Optional: Associate with a course"
              />

              <Select
                id="project-status"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                error={errors.status}
                options={[
                  { value: "planning", label: "Planning" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "submitted", label: "Submitted" },
                  { value: "completed", label: "Completed" },
                  { value: "archived", label: "Archived" },
                ]}
                required
              />
            </div>

            {/* Main Deadline */}
            <Input
              id="project-deadline"
              label="Main Deadline"
              type="date"
              value={mainDeadline}
              onChange={(e) => setMainDeadline(e.target.value)}
              helperText="Optional: Set a target completion date"
            />

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                className="flex-1"
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
              <Link
                href="/dashboard"
                className="flex-1"
              >
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
