import {
  FiCheck,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import type { DashboardTask } from "../types/dashboard";

interface TaskCardProps {
  task: DashboardTask;
  onComplete: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onEdit?: (task: DashboardTask) => void;

  completing?: boolean;
  deleting?: boolean;
}

function TaskCard({
  task,
  onComplete,
  onDelete,
  onEdit,
  completing = false,
  deleting = false,
}: TaskCardProps) {
  const priorityStyles: Record<
    DashboardTask["priority"],
    string
  > = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium:
      "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        task.completed
          ? "border-slate-200 bg-slate-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            disabled={completing}
            aria-label={
              task.completed
                ? "Task completed"
                : `Complete ${task.title}`
            }
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
              task.completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-slate-300 text-transparent hover:border-blue-500 hover:text-blue-500"
            } disabled:cursor-default`}
          >
            <FiCheck size={14} />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-semibold ${
                  task.completed
                    ? "text-slate-500 line-through"
                    : "text-slate-900"
                }`}
              >
                {task.title}
              </h3>

              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  priorityStyles[task.priority]
                }`}
              >
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.completed
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {task.description}
              </p>
            )}

            <p className="mt-2 text-sm font-semibold text-blue-600">
              {task.points} points
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!task.completed && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <FiEdit2 size={17} />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={deleting}
            aria-label={`Delete ${task.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiTrash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;