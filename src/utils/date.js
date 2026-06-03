/**
 * Format date string or Date object using toLocaleDateString with Indian locale ('en-IN').
 * @param {string|Date} value - The date to format
 * @param {object} [options] - Options for toLocaleDateString
 * @returns {string} Formatted date
 */
export function formatDate(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!value) return '';
  try {
    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    // Check if valid date
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
