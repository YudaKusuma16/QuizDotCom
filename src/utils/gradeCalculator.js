// Utility for calculating quiz performance grades and badges

/**
 * Calculate grade based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Grade letter (A-F)
 */
export function calculateGrade(percentage) {
  if (percentage === 100) return "A+";
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

/**
 * Get badge type based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Badge type (perfect | excellent | good | practicing)
 */
export function getBadgeType(percentage) {
  if (percentage === 100) return "perfect";
  if (percentage >= 80) return "excellent";
  if (percentage >= 60) return "good";
  return "practicing";
}

/**
 * Get badge message based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {object} Badge configuration with label, message, and emoji
 */
export function getBadgeConfig(percentage) {
  const badgeType = getBadgeType(percentage);

  const configs = {
    perfect: {
      label: "Perfect!",
      message: "You're a quiz master!",
      emoji: "",
    },
    excellent: {
      label: "Excellent!",
      message: "Amazing performance!",
      emoji: "",
    },
    good: {
      label: "Good Job!",
      message: "Keep up the good work!",
      emoji: "",
    },
    practicing: {
      label: "Keep Practicing!",
      message: "You'll do better next time!",
      emoji: "",
    },
  };

  return configs[badgeType];
}

/**
 * Calculate performance stats from quiz results
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {object} Performance statistics
 */
export function calculatePerformanceStats(correct, total) {
  const percentage = Math.round((correct / total) * 100);
  const grade = calculateGrade(percentage);
  const badgeType = getBadgeType(percentage);
  const badgeConfig = getBadgeConfig(percentage);

  return {
    correct,
    total,
    percentage,
    grade,
    badgeType,
    badgeLabel: badgeConfig.label,
    badgeMessage: badgeConfig.message,
  };
}
