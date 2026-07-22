import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiTarget,
  FiZap,
} from "react-icons/fi";

import {
  carryForwardTasks,
  checkCarryForward,
  completeTask,
  createTask,
  deleteTask,
  updateTask,
} from "../api/taskApi";

import {
  getTodayDashboard,
  getWeeklyDashboard,
  getMonthlyDashboard,
} from "../api/dashboardApi";
import { getStreakDashboard } from "../api/dashboardApi";
import type { StreakData } from "../types/dashboard";
import StreakCard from "../components/StreakCard";
import CarryForwardBanner from "../components/CarryForwardBanner";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskCard from "../components/TaskCard";
import SummaryCard from "../components/SummaryCard";
import ProgressRing from "../components/ProgressRing";
import WeeklyChart from "../components/WeeklyChart";
import MonthlyChart from "../components/MonthlyChart";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";

import type {
  CarryForwardTask,
  CreateTaskData,
  UpdateTaskData,
} from "../types/task";

import type {
  DashboardSummary,
  DashboardTask,
  WeeklyData,
  MonthlyData,
} from "../types/dashboard";

function Dashboard() {
  const { user } = useAuth();

  const [
    carryForwardTasksAvailable,
    setCarryForwardTasksAvailable,
  ] = useState<CarryForwardTask[]>([]);

  const [weeklyData, setWeeklyData] =
    useState<WeeklyData[]>([]);

  const [monthlyData, setMonthlyData] =
    useState<MonthlyData[]>([]);
    const [streak, setStreak] = useState<StreakData | null>(null);
    const [streakLoading, setStreakLoading] = useState(true);
    const [weeklyLoading, setWeeklyLoading] =
    useState(true);

  const [monthlyLoading, setMonthlyLoading] =
    useState(true);

  const [carryingForward, setCarryingForward] =
    useState(false);

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [todayTasks, setTodayTasks] =
    useState<DashboardTask[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [taskToEdit, setTaskToEdit] =
    useState<DashboardTask | null>(null);

  const [submittingTask, setSubmittingTask] =
    useState(false);

  const [
    completingTaskId,
    setCompletingTaskId,
  ] = useState<string | null>(null);

  const [
    deletingTaskId,
    setDeletingTaskId,
  ] = useState<string | null>(null);

  // ---------------------------------------
  // Dashboard
  // ---------------------------------------

  const fetchDashboard = async () => {
    try {
      setError("");

      const data = await getTodayDashboard();

      setSummary(data.summary);
      setTodayTasks(data.todayTasks);
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );

      setError(
        "Unable to load today's dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyDashboard = async () => {
    try {
      setWeeklyLoading(true);

      const data =
        await getWeeklyDashboard();

      setWeeklyData(data.weekly);
    } catch (error) {
      console.error(
        "Failed to load weekly dashboard:",
        error
      );
    } finally {
      setWeeklyLoading(false);
    }
  };
  const fetchStreak = async () => {
  try {
    setStreakLoading(true);

    const response = await getStreakDashboard();

    setStreak(response.streak);
  } catch (error) {
    console.error("Failed to load streak:", error);
  } finally {
    setStreakLoading(false);
  }
};
  const fetchMonthlyData = async () => {
    try {
      setMonthlyLoading(true);

      const data =
        await getMonthlyDashboard();

      setMonthlyData(data.monthly);
    } catch (error) {
      console.error(
        "Failed to load monthly dashboard:",
        error
      );
    } finally {
      setMonthlyLoading(false);
    }
  };

  const fetchCarryForwardTasks =
    async () => {
      try {
        const data =
          await checkCarryForward();

        if (data.available) {
          setCarryForwardTasksAvailable(
            data.tasks
          );
        } else {
          setCarryForwardTasksAvailable([]);
        }
      } catch (error) {
        console.error(
          "Failed to check carry-forward tasks:",
          error
        );

        setCarryForwardTasksAvailable([]);
      }
    };

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([
        fetchDashboard(),
        fetchWeeklyDashboard(),
        fetchMonthlyData(),
        fetchCarryForwardTasks(),
        fetchStreak(),
      ]);
    };

    loadDashboard();
  }, []);

  // ---------------------------------------
  // Modal
  // ---------------------------------------

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (
    task: DashboardTask
  ) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    if (submittingTask) return;

    setTaskToEdit(null);
    setIsTaskModalOpen(false);
  };

  // ---------------------------------------
  // Create Task
  // ---------------------------------------

  const handleCreateTask = async (
    data: CreateTaskData
  ) => {
    try {
      setSubmittingTask(true);
      setError("");

      await createTask(data);

      setTaskToEdit(null);
      setIsTaskModalOpen(false);

      await Promise.all([
        fetchDashboard(),
        fetchWeeklyDashboard(),
        fetchMonthlyData(),
        fetchStreak(),
      ]);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error
      );

      throw error;
    } finally {
      setSubmittingTask(false);
    }
  };

  // ---------------------------------------
  // Update Task
  // ---------------------------------------

  const handleUpdateTask = async (
    id: string,
    data: UpdateTaskData
  ) => {
    try {
      setSubmittingTask(true);

      await updateTask(id, data);

      setTaskToEdit(null);
      setIsTaskModalOpen(false);

      await Promise.all([
        fetchDashboard(),
        fetchWeeklyDashboard(),
        fetchMonthlyData(),
        fetchStreak(),
      ]);
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      throw error;
    } finally {
      setSubmittingTask(false);
    }
  };
    // ---------------------------------------
  // Complete Task
  // ---------------------------------------

  const handleCompleteTask = async (
    id: string
  ) => {
    try {
      setError("");
      setCompletingTaskId(id);

      await completeTask(id);

      await Promise.all([
        fetchDashboard(),
        fetchWeeklyDashboard(),
        fetchMonthlyData(),
        fetchStreak(),
      ]);
    } catch (error) {
      console.error(
        "Failed to complete task:",
        error
      );

      setError(
        "Unable to complete the task."
      );
    } finally {
      setCompletingTaskId(null);
    }
  };

  // ---------------------------------------
  // Delete Task
  // ---------------------------------------

  const handleDeleteTask = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingTaskId(id);

      await deleteTask(id);

      await Promise.all([
        fetchDashboard(),
        fetchWeeklyDashboard(),
        fetchMonthlyData(),
        fetchStreak(),
      ]);
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      setError(
        "Unable to delete the task."
      );
    } finally {
      setDeletingTaskId(null);
    }
  };

  // ---------------------------------------
  // Carry Forward
  // ---------------------------------------

  const handleCarryForward = async () => {
    try {
      setCarryingForward(true);
      setError("");

      await carryForwardTasks();

      await Promise.all([
        fetchDashboard(),
        fetchWeeklyDashboard(),
        fetchMonthlyData(),
        fetchStreak(),
      ]);

      await fetchCarryForwardTasks();
    } catch (error) {
      console.error(
        "Failed to carry forward tasks:",
        error
      );

      setError(
        "Unable to carry forward yesterday's tasks."
      );
    } finally {
      setCarryingForward(false);
    }
  };

  // ---------------------------------------
  // Loading State
  // ---------------------------------------

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------------------------------
  // Error State
  // ---------------------------------------

  if (!summary) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error ||
            "Dashboard data is unavailable."}
        </div>
      </DashboardLayout>
    );
  }

  // ---------------------------------------
  // Dashboard UI
  // ---------------------------------------

  return (
    <DashboardLayout>
      {/* Welcome */}

      <section>
        <p className="text-sm font-semibold text-blue-600">
          Today's Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {user?.name}
        </h1>

        <p className="mt-2 text-slate-500">
          Here's how your day is progressing.
        </p>
      </section>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Carry Forward */}

      {carryForwardTasksAvailable.length >
        0 && (
        <CarryForwardBanner
          tasks={
            carryForwardTasksAvailable
          }
          onCarryForward={
            handleCarryForward
          }
          carrying={carryingForward}
        />
      )}

      {/* Progress */}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Today's Progress
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {summary.earnedPoints} of{" "}
                {summary.plannedPoints} points
                earned
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Complete your planned tasks
                to increase today's
                performance score.
              </p>
            </div>

            <ProgressRing
              percentage={
                summary.completionRate
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Task Progress
          </p>

          <p className="mt-3 text-4xl font-bold text-slate-900">
            {summary.completedTasks}

            <span className="text-xl font-medium text-slate-400">
              {" "}
              / {summary.plannedTasks}
            </span>
          </p>

          <p className="mt-2 text-sm text-slate-500">
            tasks completed today
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{
                width: `${
                  summary.plannedTasks === 0
                    ? 0
                    : (summary.completedTasks /
                        summary.plannedTasks) *
                      100
                }%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Summary Cards */}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Planned Tasks"
          value={summary.plannedTasks}
          subtitle="Tasks scheduled today"
          icon={<FiTarget size={21} />}
        />

        <SummaryCard
          title="Completed"
          value={summary.completedTasks}
          subtitle="Tasks finished today"
          icon={
            <FiCheckCircle size={21} />
          }
        />

        <SummaryCard
          title="Earned Points"
          value={summary.earnedPoints}
          subtitle={`of ${summary.plannedPoints} planned`}
          icon={<FiZap size={21} />}
        />

        <SummaryCard
          title="Remaining Points"
          value={summary.remainingPoints}
          subtitle={`${summary.remainingTasks} tasks remaining`}
          icon={<FiClock size={21} />}
        />
      </section>
            {/* Weekly Performance */}
      <section className="mt-8">
        {streakLoading ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
            Loading streak...
          </div>
        ) : (
          streak && <StreakCard streak={streak} />
        )}
      </section>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Weekly Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your daily completion percentage based on earned points.
          </p>
        </div>

        <div className="mt-6">
          {weeklyLoading ? (
            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-slate-500">
                Loading weekly performance...
              </p>
            </div>
          ) : (
            <WeeklyChart data={weeklyData} />
          )}
        </div>
      </section>

      {/* Monthly Performance */}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Last 30 Days Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your daily completion percentage over the last 30 days based on
            earned points.
          </p>
        </div>

        <div className="mt-6">
          {monthlyLoading ? (
            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-slate-500">
                Loading monthly performance...
              </p>
            </div>
          ) : (
            <MonthlyChart data={monthlyData} />
          )}
        </div>
      </section>

      {/* Today's Tasks */}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Today's Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {todayTasks.length}{" "}
              {todayTasks.length === 1 ? "task" : "tasks"} planned today
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus size={18} />
            Add Task
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-medium text-slate-700">
              No tasks planned yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first task for today.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onEdit={handleOpenEditModal}
                completing={completingTaskId === task.id}
                deleting={deletingTaskId === task.id}
              />
            ))}
          </div>
        )}
      </section>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        taskToEdit={taskToEdit}
        onClose={handleCloseTaskModal}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        submitting={submittingTask}
      />
    </DashboardLayout>
  );
}

export default Dashboard;