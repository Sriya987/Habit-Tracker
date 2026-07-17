import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeeklyData } from "../types/dashboard";

interface WeeklyChartProps {
  data: WeeklyData[];
}

function WeeklyChart({
  data,
}: WeeklyChartProps) {
  const formatDay = (
    dateString: string
  ) => {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickFormatter={formatDay}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <YAxis
            domain={[0, 100]}
            ticks={[
              0,
              25,
              50,
              75,
              100,
            ]}
            tickFormatter={(
              value
            ) => `${value}%`}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <Tooltip
            labelFormatter={(
              date
            ) => {
              const parsedDate =
                new Date(
                  `${date}T00:00:00`
                );

              return parsedDate.toLocaleDateString(
                "en-US",
                {
                  weekday:
                    "long",
                  month:
                    "short",
                  day: "numeric",
                }
              );
            }}
            formatter={(
              value
            ) => [
              `${value}%`,
              "Completion",
            ]}
          />

          <Line
            type="monotone"
            dataKey="completionPercentage"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#2563eb",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyChart;