import {
  FiTrendingUp,
  FiAward,
  FiTarget,
} from "react-icons/fi";

import type { StreakData } from "../types/dashboard";

interface StreakCardProps {
  streak: StreakData;
}

const StreakCard = ({ streak }: StreakCardProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Streak Tracker
          </h2>

          <p className="text-sm text-gray-500">
            Stay consistent every day 🔥
          </p>
        </div>

        <div className="rounded-full bg-orange-100 p-3">
          <FiTrendingUp
            className="text-orange-500"
            size={28}
          />
        </div>
      </div>

      {/* Current Streak */}
      <div className="mb-8 text-center">
        <p className="text-5xl font-bold text-orange-500">
          {streak.currentStreak}
        </p>

        <p className="mt-2 font-medium text-gray-600">
          Current Streak
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <FiAward
            className="mx-auto mb-2 text-blue-600"
            size={24}
          />

          <p className="text-2xl font-bold text-blue-700">
            {streak.longestStreak}
          </p>

          <p className="text-sm text-gray-600">
            Best
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4 text-center">
          <FiTarget
            className="mx-auto mb-2 text-green-600"
            size={24}
          />

          <p className="text-2xl font-bold text-green-700">
            {streak.threshold}%
          </p>

          <p className="text-sm text-gray-600">
            Goal
          </p>
        </div>

        {/* <div className="rounded-xl bg-purple-50 p-4 text-center">
          <FiTrendingUp
            className="mx-auto mb-2 text-purple-600"
            size={24}
          />

          <p className="text-2xl font-bold text-purple-700">
            {streak.graceDays}
          </p>

          <p className="text-sm text-gray-600">
            Grace
          </p>
        </div> */}

      </div>
    </section>
  );
};

export default StreakCard;