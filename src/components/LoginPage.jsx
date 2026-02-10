import { useState, useEffect } from "react";
import { useQuiz } from "../context/QuizContext";
import { fetchQuizQuestions } from "../services/quizService";
import ThemeToggle from "./ThemeToggle";
import Card from "./Card";

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
      setPhase("form");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown, pendingData, setQuestions, login]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      <header className="flex justify-end p-4 absolute top-0 right-0">
        <ThemeToggle />
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 -mt-12">
        {phase === "countdown" ? (
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
              Quiz starts in
            </p>
            <p
              className="text-7xl sm:text-8xl font-bold text-indigo-600 dark:text-indigo-500 tabular-nums"
              aria-live="polite"
            >
              {countdown}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 transition-colors duration-300">
              Quiz<span style={{ color: '#29AB00' }}>Dot</span>Com
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 sm:mb-10 transition-colors duration-300">
              Enter your name to get started
            </p>

            <Card className="w-full max-w-md p-6 sm:p-8">
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
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={phase === "loading"}
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-slate-50 dark:bg-zinc-800
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
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!name.trim() || phase === "loading"}
                  className="
                    cursor-pointer w-full py-3 px-4 rounded-xl font-medium
                    bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                    text-white
                    transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
                  "
                >
                  {phase === "loading" ? "Loading questions..." : "Start Quiz"}
                </button>
              </form>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
