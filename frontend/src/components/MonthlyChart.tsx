import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyData {
  date: string;
  plannedPoints: number;
  earnedPoints: number;
  completionPercentage: number | null;
}

interface MonthlyChartProps {
  data: MonthlyData[];
}

const MonthlyChart = ({ data }: MonthlyChartProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-5">
        Last 30 Days Performance
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No data available.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 15,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              interval={4}
              tickFormatter={(date) =>
                new Date(`${date}T00:00:00`).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
              }
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
                formatter={(value) => [`${value ?? 0}%`, "Completion"]}
                labelFormatter={(label) =>
                new Date(`${label}T00:00:00`).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  }
                )
              }
            />

            <Line
              type="monotone"
              dataKey="completionPercentage"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyChart;