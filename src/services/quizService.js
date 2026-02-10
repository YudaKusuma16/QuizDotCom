import { decodeHtml } from "../utils/decodeHtml";

const API_URL =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";

/**
 * 
 */
function normalizeQuestion(raw) {
  return {
    ...raw,
    category: decodeHtml(raw.category),
    question: decodeHtml(raw.question),
    correct_answer: decodeHtml(raw.correct_answer),
    incorrect_answers: (raw.incorrect_answers || []).map(decodeHtml),
  };
}

/**
 * Fetch 10 questions from Open Trivia Database.
 *
 * @returns {Promise<Array>} 
 * @throws {Error} 
 */
export async function fetchQuizQuestions() {
  let response;

  try {
    response = await fetch(API_URL);
  } catch (error) {
    throw new Error(
      `Failed to connect to server: ${error.message}. Please check your internet connection.`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load questions (${response.status} ${response.statusText}). Please try again.`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Failed to process data from server. Please try again.");
  }

  // OpenTDB response_code
  if (data.response_code !== 0) {
    const messages = {
      1: "No questions available for this parameter combination.",
      2: "Invalid API parameters.",
      3: "Session token not found.",
      4: "Session token has expired.",
    };
    throw new Error(
      messages[data.response_code] || `API returned code: ${data.response_code}`
    );
  }

  if (!Array.isArray(data.results) || data.results.length === 0) {
    throw new Error("No questions available. Please try again later.");
  }

  return data.results.map(normalizeQuestion);
}
