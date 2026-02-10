import { useState, useEffect } from "react";

const QUIZ_SESSION_KEY = "quiz_session";

/**
 * 
 * 
 *
 * @returns {{ hasPendingSession: boolean, pendingSession: object | null }}
 */
export function usePersistence() {
  const [pendingSession, setPendingSession] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_SESSION_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data?.user && Array.isArray(data?.questions) && data.questions.length > 0) {
        setPendingSession(data);
      }
    } catch {
      
    }
  }, []);

  return {
    hasPendingSession: pendingSession !== null,
    pendingSession,
  };
}
