export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl bg-white dark:bg-zinc-900 
        shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_8px_16px_-8px_rgba(0,0,0,0.04)]
        dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),0_8px_16px_-8px_rgba(0,0,0,0.2)]
        ring-1 ring-zinc-200/80 dark:ring-zinc-800
        transition-all duration-300 ease-out
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
