import { motion, AnimatePresence } from "framer-motion";

export default function StreakCounter({ streak = 0 }) {
  const showFlame = streak >= 3;

  const flameVariants = {
    initial: { scale: 0, rotate: -90 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    grow: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Get flame color based on streak level
  const getFlameColor = () => {
    if (streak >= 10) return "#ef4444"; // red for 10+
    if (streak >= 7) return "#f97316"; // orange for 7+
    if (streak >= 5) return "#eab308"; // yellow for 5+
    return "#29AB00"; // green for 3-4
  };

  const flameColor = getFlameColor();

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {showFlame && (
          <motion.div
            key={`flame-${streak}`}
            variants={flameVariants}
            initial="initial"
            animate={["animate", "pulse"]}
            exit="initial"
            className="relative"
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 blur-sm opacity-50 rounded-full"
              style={{ backgroundColor: flameColor }}
            />

            {/* Flame icon */}
            <motion.svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative"
            >
              {/* Outer flame */}
              <path
                d="M12 2C12 2 8 6 8 10C8 14 10.5 16 12 16C13.5 16 16 14 16 10C16 6 12 2 12 2Z"
                fill={flameColor}
                opacity="0.8"
              />
              {/* Inner flame */}
              <path
                d="M12 5C12 5 10 8 10 10C10 12 11 13 12 13C13 13 14 12 14 10C14 8 12 5 12 5Z"
                fill="#fff"
                opacity="0.6"
              />
              {/* Sparkle effects */}
              {streak >= 5 && (
                <>
                  <circle cx="6" cy="8" r="1" fill={flameColor} opacity="0.6" />
                  <circle cx="18" cy="6" r="1.5" fill={flameColor} opacity="0.6" />
                </>
              )}
              {streak >= 7 && (
                <circle cx="20" cy="12" r="1" fill={flameColor} opacity="0.6" />
              )}
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {streak > 0 && (
          <motion.div
            key={`streak-${streak}`}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-1"
          >
            <span
              className={`text-lg sm:text-xl font-bold ${
                streak >= 5
                  ? "text-orange-500 dark:text-orange-400"
                  : streak >= 3
                  ? "text-green-600 dark:text-green-400"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {streak}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              streak
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
