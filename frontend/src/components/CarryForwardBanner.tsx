import {
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";

import type {
  CarryForwardTask,
} from "../types/task";

interface CarryForwardBannerProps {
  tasks: CarryForwardTask[];
  onCarryForward: () => void | Promise<void>;
  carrying: boolean;
}

function CarryForwardBanner({
  tasks,
  onCarryForward,
  carrying,
}: CarryForwardBannerProps) {
  if (tasks.length === 0) {
    return null;
  }

  const totalPoints = tasks.reduce(
    (sum, task) => sum + task.points,
    0
  );

  return (
    <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <FiRefreshCw size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              You have unfinished tasks from yesterday
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {tasks.length}{" "}
              {tasks.length === 1
                ? "task was"
                : "tasks were"}{" "}
              left incomplete. Carry{" "}
              {tasks.length === 1
                ? "it"
                : "them"}{" "}
              forward to today's plan?
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {tasks.map((task) => (
                <span
                  key={task.id}
                  className="rounded-lg border border-amber-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {task.title} · {task.points} pts
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Total: {totalPoints} points
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCarryForward}
          disabled={carrying}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carrying ? (
            <>
              <FiRefreshCw
                size={17}
                className="animate-spin"
              />
              Carrying...
            </>
          ) : (
            <>
              Carry Forward
              <FiArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export default CarryForwardBanner;