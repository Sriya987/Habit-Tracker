interface ProgressRingProps {
  percentage: number;
}

function ProgressRing({
  percentage,
}: ProgressRingProps) {
  const safePercentage = Math.min(
    Math.max(percentage, 0),
    100
  );

  const radius = 54;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (safePercentage / 100) *
      circumference;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg
        className="-rotate-90"
        width="144"
        height="144"
        viewBox="0 0 144 144"
      >
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-slate-100"
        />

        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={offset}
          className="text-blue-600 transition-all duration-700"
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-3xl font-bold text-slate-900">
          {safePercentage}%
        </p>

        <p className="text-xs text-slate-500">
          completed
        </p>
      </div>
    </div>
  );
}

export default ProgressRing;