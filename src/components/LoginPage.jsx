import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { fetchQuizQuestions } from "../services/quizService";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import Card from "./Card";
import Logo from "./Logo";
import DynamicBackground from "./DynamicBackground";

export default function LoginPage() {
  const { login, setQuestions } = useQuiz();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState("form");
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState(null);
  const [pendingData, setPendingData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    setPhase("loading");
    try {
      const questions = await fetchQuizQuestions();
      setPendingData({ name: trimmed, questions });
      setPhase("countdown");
      setCountdown(3);
    } catch (err) {
      setError(err.message || "Failed to load questions.");
      setPhase("form");
    }
  };

  useEffect(() => {
    if (phase !== "countdown" || !pendingData) return;
    if (countdown <= 0) {
      setQuestions(pendingData.questions);
      login(pendingData.name);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown, pendingData, setQuestions, login]);

  return (
    <DynamicBackground intensity="calm">
      <div className="min-h-screen transition-colors duration-300">
        <header className="flex justify-end items-center gap-3 sm:gap-4 p-4 sm:p-5 absolute top-0 right-0">
          <SoundToggle />
          <ThemeToggle />
        </header>

        <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          {phase === "countdown" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
                Quiz starts in
              </p>
              <motion.p
                className="text-7xl sm:text-8xl font-bold text-indigo-600 dark:text-indigo-500 tabular-nums"
                aria-live="polite"
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {countdown}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              {/* Logo Section */}
              <div className="flex flex-col items-center mb-8">
                <Logo size="large" animated={true} />
              </div>

              {/* Subtitle */}
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 text-center transition-colors duration-300">
                Enter your name to start the challenge
              </p>

              <Card className="w-full p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      autoComplete="name"
                      disabled={phase === "loading"}
                      className="
                        w-full px-4 py-3 rounded-xl
                        bg-white/60 dark:bg-zinc-800/60
                        backdrop-blur-sm
                        border border-zinc-200 dark:border-zinc-700
                        text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500
                        outline-none
                        transition-all duration-200 ease-out
                        focus:border-indigo-500 dark:focus:border-indigo-400
                        focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
                        disabled:opacity-70
                      "
                    />
                  </div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            Failed to load questions
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {error}
                          </p>
                          <button
                            onClick={handleSubmit}
                            className="mt-3 text-sm text-red-700 dark:text-red-300 font-medium hover:text-red-800 dark:hover:text-red-200 transition-colors flex items-center gap-1.5"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Try Again
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <button
                    type="submit"
                    disabled={!name.trim() || phase === "loading"}
                    className="
                      cursor-pointer w-full py-3.5 px-4 rounded-xl font-medium
                      bg-gradient-to-r from-indigo-600 to-purple-600
                      hover:from-indigo-700 hover:to-purple-700
                      active:from-indigo-800 active:to-purple-800
                      text-white
                      shadow-lg shadow-indigo-500/25
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600
                    "
                  >
                    {phase === "loading" ? "Loading questions..." : "Start Quiz"}
                  </button>
                </form>
              </Card>

            </motion.div>
          )}
        </main>
      </div>
    </DynamicBackground>
  );
}
