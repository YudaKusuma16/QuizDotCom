import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuiz } from "./context/QuizContext";
import { usePersistence } from "./hooks/usePersistence";
import LoginPage from "./components/LoginPage";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import RestorePromptModal from "./components/RestorePromptModal";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

function App() {
  const { user, questions, restoreSession, clearQuizSession, resetQuiz } =
    useQuiz();
  const { hasPendingSession, pendingSession } = usePersistence();
  const [restorePromptDismissed, setRestorePromptDismissed] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const showRestoreModal = hasPendingSession && !restorePromptDismissed;

  const handleRestore = () => {
    if (pendingSession) {
      restoreSession(pendingSession);
      setRestorePromptDismissed(true);
    }
  };

  const handleStartNew = () => {
    clearQuizSession();
    resetQuiz();
    setRestorePromptDismissed(true);
  };

  const handleQuizEnd = () => {
    clearQuizSession();
    setShowResults(true);
  };

  if (showRestoreModal) {
    return (
      <RestorePromptModal onRestore={handleRestore} onDismiss={handleStartNew} />
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <AnimatePresence mode="sync">
        {!user ? (
        <motion.div
          key="login"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full"
        >
          <LoginPage />
        </motion.div>
      ) : questions.length > 0 && !showResults ? (
        <motion.div
          key="quiz"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full"
        >
          <QuizScreen totalTime={60} onQuizEnd={handleQuizEnd} />
        </motion.div>
      ) : (
        <motion.div
          key="result"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full"
        >
          <ResultScreen onPlayAgain={() => { resetQuiz(); setShowResults(false); }} />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default App;
