"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProject, getTasks, createTask } from "@/lib/api";
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

interface Task {
  task_id: number;
  title: string;
  description: string | null;
  type: string;
  due_date: string | null;
  status: string;
  priority: string;
  estimated_minutes: number | null;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const { user, isLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("reading");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskError, setTaskError] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user || Number.isNaN(projectId)) return;

    const fetchData = async () => {
      const projectResponse = await getProject(projectId);
      if (projectResponse.data) {
        setProject(projectResponse.data);
      }
      setProjectLoading(false);

      const tasksResponse = await getTasks(projectId);
      if (tasksResponse.data) {
        setTasks(tasksResponse.data);
      }
      setTasksLoading(false);
    };

    fetchData();
  }, [projectId, user]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError("");
    setTaskLoading(true);

    if (!taskTitle.trim()) {
      setTaskError("Task title is required");
      setTaskLoading(false);
      return;
    }

    const response = await createTask<Task>(projectId, {
      title: taskTitle,
      description: taskDescription,
      type: taskType,
      due_date: taskDueDate || undefined,
      priority: taskPriority,
    });

    if (response.error) {
      setTaskError(response.error);
      setTaskLoading(false);
      return;
    }

    if (response.data) {
      setTasks([...tasks, response.data]);
      setTaskTitle("");
      setTaskDescription("");
      setTaskType("reading");
      setTaskPriority("medium");
      setTaskDueDate("");
      setShowTaskForm(false);
    }
    setTaskLoading(false);
  };

  if (projectLoading) {
    return <div className="text-center py-8">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center py-8 text-red-600">Project not found</div>;
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      not_started: "bg-gray-100 text-gray-700",
      in_progress: "bg-blue-100 text-blue-700",
      done: "bg-green-100 text-green-700",
      overdue: "bg-red-100 text-red-700",
      completed: "bg-green-100 text-green-700",
      planning: "bg-purple-100 text-purple-700",
      submitted: "bg-indigo-100 text-indigo-700",
      archived: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(project.status)}`}>
                  {project.status.replace(/_/g, " ")}
                </span>
              </div>

              {project.description && (
                <p className="text-gray-600 mb-4">{project.description}</p>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                {project.course_code && (
                  <p>
                    <span className="font-medium">Course Code:</span> {project.course_code}
                  </p>
                )}
                {project.main_deadline && (
                  <p>
                    <span className="font-medium">Main Deadline:</span>{" "}
                    {new Date(project.main_deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  + Add Task
                </button>
              </div>

              {showTaskForm && (
                <form onSubmit={handleAddTask} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  {taskError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                      {taskError}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Enter task title"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Description
                    </label>
                    <textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Task description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Type
                      </label>
                      <select
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="reading">Reading</option>
                        <option value="analysis">Analysis</option>
                        <option value="writing">Writing</option>
                        <option value="meeting">Meeting</option>
                        <option value="admin">Admin</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Priority
                      </label>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={taskLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition text-sm"
                    >
                      {taskLoading ? "Adding..." : "Add Task"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {tasksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No tasks yet. Create one to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.task_id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                          {task.type}
                        </span>
                        {task.due_date && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Start Conversation
              </h3>
              <Link
                href={`/conversations?project_id=${projectId}`}
                className="w-full block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Chat with TIA
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
