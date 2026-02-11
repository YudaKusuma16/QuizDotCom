import { motion } from "framer-motion";

export default function Card({ children, className = "", animate = false }) {
  const cardClass = `
    relative rounded-2xl
    backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90
    shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_8px_16px_-8px_rgba(0,0,0,0.04)]
    dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),0_8px_16px_-8px_rgba(0,0,0,0.2)]
    ring-1 ring-zinc-200/60 dark:ring-zinc-700/60
    transition-all duration-300 ease-out
    hover:shadow-[0_8px_32px_-4px_rgba(99,102,241,0.15),0_12px_24px_-8px_rgba(99,102,241,0.1)]
    dark:hover:shadow-[0_8px_32px_-4px_rgba(99,102,241,0.25),0_12px_24px_-8px_rgba(99,102,241,0.15)]
    hover:-translate-y-1
    hover:ring-indigo-200/80 dark:hover:ring-indigo-500/30
    ${className}
  `.trim();

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cardClass}
      >
        {/* Subtle gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClass}>
      {/* Subtle gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
      {children}
    </div>
  );
}
