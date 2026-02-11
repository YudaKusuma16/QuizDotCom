import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { useToast } from "../context/ToastContext";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import Card from "./Card";
import CircularTimer from "./CircularTimer";
import StreakCounter from "./StreakCounter";
import DynamicBackground from "./DynamicBackground";
import { shuffle } from "../utils/shuffle";
import { soundManager } from "../utils/soundEffects";

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
  const { showToast } = useToast();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastStreakMilestone, setLastStreakMilestone] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const containerVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, y: -24, transition: { duration: 0.25, ease: "easeIn" } },
  };

  const optionsContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const optionVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -8, 8, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

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

    soundManager.playPop();

    const isCorrect = answer === currentQuestion.correct_answer;

    if (isCorrect) {
      soundManager.playDing();
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Show toast for streak milestones (3, 5, 7, 10...)
      if (newStreak >= 3 && newStreak > lastStreakMilestone && (newStreak % 2 === 1 || newStreak % 5 === 0)) {
        setLastStreakMilestone(newStreak);
        showToast(`${newStreak} correct in a row! 🔥`, 'success');
      }
    } else {
      soundManager.playBuzz();
      setStreak(0);
      setLastStreakMilestone(0);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

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
    <DynamicBackground intensity={streak >= 3 ? "medium" : "calm"}>
      <div className="min-h-screen transition-colors duration-300 ease-out">
        <header className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 absolute top-0 left-0 right-0">
          {/* Left side: Streak counter */}
          <div className="flex items-center gap-3 flex-1">
            <StreakCounter streak={streak} />
          </div>

          {/* Center: Timer (absolute positioned to stay truly centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center mt-5">
            <CircularTimer
              timeRemaining={timeRemaining}
              totalTime={totalTime}
              size={streak >= 3 ? 72 : 64}
            />
          </div>

          {/* Right side: Toggles */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
            <SoundToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-200/60 dark:bg-zinc-800/60 backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-20">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-zinc-500 dark:text-zinc-400 mb-2"
          >
            Question {currentIndex + 1} of {totalQuestions}
          </motion.p>

        <Card className="w-full max-w-2xl p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <motion.h2
                className="text-lg sm:text-xl font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed transition-colors duration-300"
                animate={isShaking ? "shake" : ""}
                variants={shakeVariants}
              >
                {currentQuestion.question}
              </motion.h2>

              <motion.div
                className="space-y-3"
                variants={optionsContainerVariants}
                initial="initial"
                animate="animate"
              >
                {options.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => handleSelectAnswer(option)}
                    disabled={isLocked}
                    variants={optionVariants}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl border-2
                      transition-all duration-200
                      disabled:cursor-not-allowed
                      ${getOptionStyle(option)}
                    `}
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </main>
      </div>
    </DynamicBackground>
  );
}
