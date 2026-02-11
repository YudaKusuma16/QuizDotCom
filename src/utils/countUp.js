// Utility for counting up animation (used in ScoreCounter component)

/**
 * Ease out quart function for smooth animation
 * @param {number} x - Progress value (0-1)
 * @returns {number} Eased value
 */
export function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

/**
 * Ease out cubic function
 * @param {number} x - Progress value (0-1)
 * @returns {number} Eased value
 */
export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

/**
 * Ease out bounce function for bouncy animation
 * @param {number} x - Progress value (0-1)
 * @returns {number} Eased value
 */
export function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

/**
 * Format a number with commas for thousands
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  return num.toLocaleString("en-US");
}
