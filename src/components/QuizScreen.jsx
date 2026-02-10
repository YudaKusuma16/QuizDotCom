import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import ThemeToggle from "./ThemeToggle";
import Card from "./Card";
import { shuffle } from "../utils/shuffle";

const FEEDBACK_DELAY_MS = 500;

export default function QuizScreen({ totalTime = 60, onQuizEnd }) {
  const {
    questions,
    currentIndex,
    answers,
    submitAnswer,
    setTimeRemaining,
    timeRemaining,
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Shuffle answer
  const options = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffle([
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers,
    ]);
  }, [currentQuestion?.question]);

  // Initialize & countdown timer
  useEffect(() => {
    if (timeRemaining === 0 && currentIndex === 0 && answers.length === 0) {
      setTimeRemaining(totalTime);
    }
  }, [currentIndex, answers.length, setTimeRemaining, totalTime, timeRemaining]);

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0;
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onQuizEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [setTimeRemaining, onQuizEnd]);

  const handleSelectAnswer = (answer) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.correct_answer;

    setTimeout(() => {
      submitAnswer(answer);
      setSelectedAnswer(null);
      setIsLocked(false);

      const isLastQuestion = currentIndex >= totalQuestions - 1;
      if (isLastQuestion) {
        onQuizEnd?.();
      }
    }, FEEDBACK_DELAY_MS);
  };

  const getOptionStyle = (option) => {
    if (!selectedAnswer) {
      return "border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500";
    }
    const isSelected = selectedAnswer === option;
    const isCorrect = option === currentQuestion.correct_answer;
    if (isSelected) {
      return isCorrect
        ? "border-green-500 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200"
        : "border-red-500 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200";
    }
    if (isCorrect && selectedAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200";
    }
    return "border-zinc-200 dark:border-zinc-700 opacity-60";
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 ease-out">
      <header className="flex justify-end items-center gap-3 sm:gap-4 p-4 sm:p-5 absolute top-0 right-0">
        <span
          className={`text-sm font-mono font-medium ${
            timeRemaining <= 10
              ? "text-red-600 dark:text-red-400 animate-pulse"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {formatTime(timeRemaining)}
        </span>
        <ThemeToggle />
      </header>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800">
        <motion.div
          className="h-full bg-indigo-600 dark:bg-indigo-500"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          Question {currentIndex + 1} of {totalQuestions}
        </p>

        <Card className="w-full max-w-2xl p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              <h2 className="text-lg sm:text-xl font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed transition-colors duration-300">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectAnswer(option)}
                    disabled={isLocked}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl border-2
                      transition-all duration-200
                      disabled:cursor-not-allowed
                      ${getOptionStyle(option)}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </main>
    </div>
  );
}
