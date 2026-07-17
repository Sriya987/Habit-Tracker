import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { FiX } from "react-icons/fi";

import type {
  DashboardTask,
} from "../types/dashboard";

import type {
  CreateTaskData,
  Priority,
  UpdateTaskData,
} from "../types/task";

interface CreateTaskModalProps {
  isOpen: boolean;
  taskToEdit: DashboardTask | null;
  onClose: () => void;

  onCreate: (
    data: CreateTaskData
  ) => Promise<void>;

  onUpdate: (
    id: string,
    data: UpdateTaskData
  ) => Promise<void>;

  submitting: boolean;
}

function CreateTaskModal({
  isOpen,
  taskToEdit,
  onClose,
  onCreate,
  onUpdate,
  submitting,
}: CreateTaskModalProps) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<Priority>("Medium");

  const [error, setError] =
    useState("");

  const isEditing =
    taskToEdit !== null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (taskToEdit) {
      setTitle(taskToEdit.title);

      setDescription(
        taskToEdit.description || ""
      );

      setPriority(
        taskToEdit.priority
      );
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
    }

    setError("");
  }, [
    isOpen,
    taskToEdit,
  ]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    const trimmedDescription =
      description.trim();

    if (!trimmedTitle) {
      setError(
        "Task title is required."
      );

      return;
    }

    setError("");

    try {
      if (taskToEdit) {
        await onUpdate(
          taskToEdit.id,
          {
            title: trimmedTitle,
            description:
              trimmedDescription,
            priority,
          }
        );
      } else {
        await onCreate({
          title: trimmedTitle,
          description:
            trimmedDescription,
          priority,
        });
      }
    } catch {
      setError(
        isEditing
          ? "Unable to update the task."
          : "Unable to create the task."
      );
    }
  };

  const priorityPoints = {
    High: 30,
    Medium: 20,
    Low: 10,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing
                ? "Edit Task"
                : "Create Task"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update your task details."
                : "Add a task to today's plan."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">

            {/* Title */}

            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Task title
              </label>

              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Example: Complete DSA sheet"
                autoFocus
                disabled={submitting}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
                <span className="ml-1 font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Add more details about the task..."
                rows={4}
                disabled={submitting}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Priority */}

            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as Priority
                  )
                }
                disabled={submitting}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="High">
                  High — 30 points
                </option>

                <option value="Medium">
                  Medium — 20 points
                </option>

                <option value="Low">
                  Low — 10 points
                </option>
              </select>

              <p className="mt-2 text-sm text-slate-500">
                This task is worth{" "}
                <span className="font-semibold text-blue-600">
                  {
                    priorityPoints[
                      priority
                    ]
                  }{" "}
                  points
                </span>
                .
              </p>
            </div>

          </div>

          {/* Actions */}

          <div className="mt-7 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Task"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTaskModal;