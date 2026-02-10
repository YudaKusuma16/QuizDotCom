import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import Card from "./Card";

export default function ResultScreen({ onPlayAgain }) {
  const { user, questions, answers, resetQuiz } = useQuiz();

  const stats = useMemo(() => {
    let correct = 0;
    const total = questions.length;
    answers.forEach((answer, i) => {
      if (questions[i]?.correct_answer === answer) correct++;
    });
    const wrong = total - correct;
    return { correct, wrong, total };
  }, [questions, answers]);

  const handlePlayAgain = () => {
    onPlayAgain ? onPlayAgain() : resetQuiz();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      <header className="flex justify-end items-center gap-3 sm:gap-4 p-4 sm:p-5 absolute top-0 right-0">
        <SoundToggle />
        <ThemeToggle />
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-2 transition-colors duration-300">
            Quiz Result
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center mb-8 transition-colors duration-300">
            {user?.name}, here is the summary of your performance
          </p>

          <Card className="p-6 sm:p-8 mb-6 transition-colors duration-300">
            {/* Final Score */}
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1 transition-colors duration-300">
                Final Score
              </p>
              <p
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-indigo-600 dark:text-indigo-500 transition-colors duration-300"
                aria-label={`${stats.correct}`}
              >
                {stats.correct}
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl bg-green-50 dark:bg-green-950/40 p-4 text-center transition-colors duration-300">
                <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                  {stats.correct}
                </p>
                <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-500 mt-1 transition-colors duration-300">
                  Correct
                </p>
              </div>
              <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-center transition-colors duration-300">
                <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300">
                  {stats.wrong}
                </p>
                <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-500 mt-1 transition-colors duration-300">
                  Wrong
                </p>
              </div>
              <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-4 text-center transition-colors duration-300">
                <p className="text-2xl sm:text-3xl font-bold text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
                  {stats.total}
                </p>
                <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1 transition-colors duration-300">
                  Total
                </p>
              </div>
            </div>
          </Card>

          <button
            type="button"
            onClick={handlePlayAgain}
            className="w-full py-3.5 sm:py-4 px-4 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-colors duration-200"
          >
            Play Again
          </button>
        </motion.div>
      </main>
    </div>
  );
}
