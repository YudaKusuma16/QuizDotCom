export default function RestorePromptModal({ onRestore, onDismiss }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restore-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl transition-colors duration-300 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="restore-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2"
        >
          Pending Quiz
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
          You have a pending quiz. Would you like to continue or start over?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRestore}
            className="flex-1 py-2.5 px-4 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-2.5 px-4 rounded-xl font-medium bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
