import { createContext, useContext, useEffect, useState } from "react";

const QUIZ_SESSION_KEY = "quiz_session";
const QuizContext = createContext();

export function QuizProvider({ children }) {
  // User Status (Name)
  const [user, setUser] = useState(null);

  // Quiz Data (list questions from API)
  const [questions, setQuestionsState] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  // Theme Status (dark/light)
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const login = (name) => {
    setUser({ name: name.trim() });
  };

  // Set questions data from API
  const setQuestions = (questionsData) => {
    setQuestionsState(questionsData || []);
    setCurrentIndex(0);
    setAnswers([]);
  };

  const submitAnswer = (answer) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = answer;
      return next;
    });
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  // Reset quiz state
  const resetQuiz = () => {
    setUser(null);
    setQuestionsState([]);
    setCurrentIndex(0);
    setAnswers([]);
    setTimeRemaining(0);
    localStorage.removeItem(QUIZ_SESSION_KEY);
  };

  // Restore session from localStorage
  const restoreSession = (data) => {
    if (!data?.user || !Array.isArray(data?.questions)) return;
    setUser(data.user);
    setQuestionsState(data.questions);
    setCurrentIndex(data.currentIndex ?? 0);
    setAnswers(data.answers ?? []);
    setTimeRemaining(data.timeRemaining ?? 0);
  };

  // Clear session from localStorage
  const clearQuizSession = () => {
    localStorage.removeItem(QUIZ_SESSION_KEY);
  };

  useEffect(() => {
    if (!user || questions.length === 0) return;
    const session = {
      user,
      questions,
      currentIndex,
      answers,
      timeRemaining,
    };
    localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session));
  }, [user, questions, currentIndex, answers, timeRemaining]);

  const value = {
    
    user,
    questions,
    currentIndex,
    answers,
    isDark,
    timeRemaining,
    
    login,
    setQuestions,
    submitAnswer,
    resetQuiz,
    toggleTheme,
    setTimeRemaining,
    setCurrentIndex,
    restoreSession,
    clearQuizSession,
  };

  return (
    <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
}
