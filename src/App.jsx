import { useState } from "react";
import { useQuiz } from "./context/QuizContext";
import { usePersistence } from "./hooks/usePersistence";
import LoginPage from "./components/LoginPage";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import RestorePromptModal from "./components/RestorePromptModal";

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

  if (!user) {
    return <LoginPage />;
  }

  if (questions.length > 0 && !showResults) {
    return (
      <QuizScreen totalTime={60} onQuizEnd={handleQuizEnd} />
    );
  }

  return <ResultScreen onPlayAgain={() => { resetQuiz(); setShowResults(false); }} />;
}

export default App;
