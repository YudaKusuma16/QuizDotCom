import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RadialProgress({
  value, // 0-100
  size = 120,
  strokeWidth = 10,
  label = "Accuracy",
  color = "indigo",
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animate the progress value on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  // Original radius calculation (for correct progress calculation)
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  // Add padding for round stroke cap to prevent clipping
  const padding = strokeWidth / 2;
  const svgSize = size + padding * 2;
  const center = svgSize / 2;

  // Color classes based on accuracy
  const getColorClasses = () => {
    if (value >= 80) return "stroke-green-500";
    if (value >= 60) return "stroke-indigo-500";
    if (value >= 40) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  const getTextColor = () => {
    if (value >= 80) return "text-green-600 dark:text-green-400";
    if (value >= 60) return "text-indigo-600 dark:text-indigo-400";
    if (value >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0.2, 0.4, 0.2],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center"
    >
      <div className="relative flex items-center justify-center" style={{ width: svgSize, height: svgSize }}>
        {/* Glow effect */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className={`absolute inset-0 rounded-full blur-xl ${
            value >= 80 ? "bg-green-500" : value >= 60 ? "bg-indigo-500" : "bg-zinc-500"
          }`}
        />

        {/* SVG Progress Circle */}
        <svg
          className="relative transform -rotate-90 overflow-visible"
          width={svgSize}
          height={svgSize}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-200 dark:text-zinc-800"
          />

          {/* Progress circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={getColorClasses()}
            style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-2xl sm:text-3xl font-bold ${getTextColor()} transition-colors duration-300`}
          >
            {Math.round(animatedValue)}%
          </span>
        </div>
      </div>

      {/* Label */}
      <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-3 font-medium">
        {label}
      </span>
    </motion.div>
  );
}
