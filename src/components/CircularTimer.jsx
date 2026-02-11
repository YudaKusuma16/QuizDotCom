import { motion } from "framer-motion";

export default function CircularTimer({
  timeRemaining,
  totalTime = 60,
  size = 64,
  strokeWidth = 4,
}) {
  // Calculate the percentage of time remaining
  const percentage = timeRemaining / totalTime;

  // Calculate the circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate the stroke dashoffset based on percentage
  const strokeDashoffset = circumference - percentage * circumference;

  // Determine color based on time remaining
  const getTimeColor = () => {
    if (percentage <= 0.15) return "#ef4444"; // red
    if (percentage <= 0.3) return "#f59e0b"; // amber
    return "#6366f1"; // indigo
  };

  const timeColor = getTimeColor();

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const containerVariants = {
    pulse: percentage <= 0.15
      ? {
          scale: [1, 1.05, 1],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }
      : {},
  };

  return (
    <motion.div
      variants={containerVariants}
      animate="pulse"
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg
        className="absolute inset-0 transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-200 dark:text-zinc-800"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={timeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="drop-shadow-lg"
        />
      </svg>

      {/* Time text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-sm sm:text-base font-mono font-bold transition-colors duration-300 ${
            percentage <= 0.15
              ? "text-red-600 dark:text-red-400"
              : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>
    </motion.div>
  );
}
