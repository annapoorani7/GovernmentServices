/**
 * Safely escapes all special regular expression characters in a user-supplied search string
 * to prevent Regex Injection, SyntaxErrors, and ReDoS vulnerabilities.
 *
 * @param {string} text - User input string to sanitize
 * @returns {string} Sanitized string safe for RegExp construction
 */
export const sanitizeRegex = (text = "") => {
  if (typeof text !== "string") return "";
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export default sanitizeRegex;
