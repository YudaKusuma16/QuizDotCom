/**
 * Decode HTML entities (e.g. &quot; &#039; &amp;).
 *
 * @param {string} text 
 * @returns {string} 
 */
export function decodeHtml(text) {
  if (typeof text !== "string") return "";
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}
