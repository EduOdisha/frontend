/**
 * Utility functions for formatting values on the EduOdisha platform.
 */

/**
 * Format packages to LPA (Lakhs Per Annum) format.
 * If the value is absolute Rupees (e.g. 850000), it converts it to Lakhs (e.g. 8.5 LPA).
 * If the value is already in Lakhs (e.g. 8.5), it formats it with 1 decimal place.
 * 
 * @param {number} val - The package value
 * @returns {string} - Formatted string (e.g., "₹8.5 LPA")
 */
export const formatLPA = (val) => {
  if (!val) return 'N/A';
  const num = Number(val);
  if (isNaN(num)) return 'N/A';

  if (num > 99) {
    // Convert absolute Rupees to Lakhs
    const lpa = num / 100000;
    return `₹${Number(lpa.toFixed(1))} LPA`;
  }
  return `₹${Number(num.toFixed(1))} LPA`;
};

/**
 * Format packages to short Lakhs format (e.g., "₹45L").
 * If the value is absolute Rupees (e.g. 4500000), it converts it to Lakhs (e.g. 45L).
 * If the value is already in Lakhs (e.g. 45), it formats it.
 * 
 * @param {number} val - The package value
 * @returns {string} - Formatted string (e.g., "₹45L")
 */
export const formatLakhs = (val) => {
  if (!val) return 'N/A';
  const num = Number(val);
  if (isNaN(num)) return 'N/A';

  if (num > 99) {
    // Convert absolute Rupees to Lakhs
    const lakhs = num / 100000;
    return `₹${Number(lakhs.toFixed(1))}L`;
  }
  return `₹${Number(num.toFixed(1))}L`;
};
