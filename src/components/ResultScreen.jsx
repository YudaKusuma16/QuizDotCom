import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import Card from "./Card";
import Confetti, { patterns } from "./Confetti";
import RadialProgress from "./RadialProgress";
import DynamicBackground from "./DynamicBackground";

export default function ResultScreen({ onPlayAgain }) {
  const { questions, answers, resetQuiz, user } = useQuiz();
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  const { correct, wrong, total, percentage } = useMemo(() => {
    let correct = 0;
    const total = questions.length;
    answers.forEach((answer, i) => {
      if (questions[i]?.correct_answer === answer) correct++;
    });
    const wrong = total - correct;
    const percentage = Math.round((correct / total) * 100);
    return { correct, wrong, total, percentage };
  }, [questions, answers]);

  const { badge, message } = useMemo(() => {
    const userName = user?.name || "Player";
    if (percentage === 100) {
      return {
        badge: "Trivia Titan",
        message: `Absolute Perfection, ${userName}! You've mastered the trivia universe. Your brain is officially a supercomputer!`
      };
    } else if (percentage >= 80) {
      return {
        badge: "Brainiac",
        message: `Impressive work, ${userName}! You're just a few steps away from total mastery. You clearly know your stuff!`
      };
    } else if (percentage >= 60) {
      return {
        badge: "Smart Cookie",
        message: `Solid performance, ${userName}! You've got a great foundation. A little more practice and you'll be unstoppable.`
      };
    } else if (percentage >= 40) {
      return {
        badge: "Rising Star",
        message: `Nice effort, ${userName}! You've got potential. Why not give it another shot and beat your own record?`
      };
    } else {
      return {
        badge: "Knowledge Seeker",
        message: `Don't sweat it, ${userName}! Every master was once a beginner. Take a deep breath and try again, you've got this!`
      };
    }
  }, [percentage, user]);

  // Trigger confetti on mount based on performance
  useEffect(() => {
    if (!confettiTriggered) {
      setConfettiTriggered(true);
      if (percentage === 100) {
        patterns.perfect();
      } else if (percentage >= 80) {
        patterns.fireworks();
      } else if (percentage >= 60) {
        patterns.burst();
      } else {
        patterns.rain();
      }
    }
  }, [percentage, confettiTriggered]);

  const handlePlayAgain = () => {
    onPlayAgain ? onPlayAgain() : resetQuiz();
  };

  return (
    <DynamicBackground intensity={percentage >= 80 ? "energetic" : "calm"}>
      <Confetti trigger={confettiTriggered} pattern={percentage === 100 ? patterns.perfect : patterns.burst} />
      <div className="min-h-screen transition-colors duration-300">
        <header className="flex justify-end items-center gap-3 sm:gap-4 p-4 sm:p-5 absolute top-0 right-0">
          <SoundToggle />
          <ThemeToggle />
        </header>

        <main className="flex flex-col items-center justify-center min-h-screen px-4 py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Badge & Message */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block"
              >
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-3 ${
                  percentage === 100
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                    : percentage >= 80
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                    : percentage >= 60
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : percentage >= 40
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-gradient-to-r from-zinc-500 to-zinc-600 text-white'
                }`}>
                  {badge}
                </span>
              </motion.div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                {message}
              </p>
            </motion.div>

            {/* Score Card */}
            <Card className="p-6 sm:p-8 mb-6">
              {/* Radial Progress */}
              <div className="flex justify-center mb-8 p-4">
                <RadialProgress
                  value={percentage}
                  size={120}
                  strokeWidth={10}
                  label="Accuracy"
                />
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-green-50 dark:bg-green-950/40 p-4 text-center transition-colors duration-300"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                    {correct}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-500 mt-1 transition-colors duration-300">
                    Correct
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-center transition-colors duration-300"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 transition-colors duration-300">
                    {wrong}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-500 mt-1 transition-colors duration-300">
                    Wrong
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-4 text-center transition-colors duration-300"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
                    {total}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1 transition-colors duration-300">
                    Total
                  </p>
                </motion.div>
              </div>
            </Card>

            {/* Play Again Button */}
            <motion.button
              type="button"
              onClick={handlePlayAgain}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 sm:py-4 px-4 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white transition-all duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              Play Again
            </motion.button>
          </motion.div>
        </main>
      </div>
    </DynamicBackground>
  );
}
