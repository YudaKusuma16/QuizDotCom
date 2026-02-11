import { motion } from "framer-motion";

const logoVariants = {
  floating: {
    y: [0, -8, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Logo({ size = "large", animated = true }) {
  const sizeClasses = {
    large: "w-20 h-20 sm:w-24 sm:h-24",
    medium: "w-12 h-12",
    small: "w-8 h-8",
  };

  const textSizes = {
    large: "text-3xl sm:text-4xl",
    medium: "text-xl",
    small: "text-base",
  };

  const MotionWrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        variants: logoVariants,
        animate: "floating",
      }
    : {};

  return (
    <div className="flex items-center gap-3">
      <MotionWrapper
        {...wrapperProps}
        className={`${sizeClasses[size]} flex-shrink-0`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle - gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main circle background */}
          <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />

          {/* Quiz bubble shape */}
          <path
            d="M 25 30 Q 25 22 33 22 L 67 22 Q 75 22 75 30 L 75 55 Q 75 63 67 63 L 40 63 L 30 73 L 32 63 L 33 63 Q 25 63 25 55 Z"
            fill="white"
            opacity="0.95"
          />

          {/* Question mark */}
          <g transform="translate(100, 0) scale(-1, 1)">
            <path
              d="M 50 32 C 46 32 43 35 43 39 C 43 42 45 43 47 44 L 49 45 C 50 46 50 47 50 48 L 50 51"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="50" cy="56" r="2.5" fill="#6366f1" />
          </g>

          {/* Play button accent */}
          <circle
            cx="72"
            cy="72"
            r="12"
            fill="#29AB00"
            filter="url(#glow)"
          />
          <path
            d="M 69 68 L 77 72 L 69 76 Z"
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </MotionWrapper>

      {/* Text logo */}
      {size === "large" && (
        <h1
          className={`${textSizes[size]} font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300`}
        >
          Quiz
          <span style={{ color: "#29AB00" }}>Dot</span>Com
        </h1>
      )}
    </div>
  );
}
