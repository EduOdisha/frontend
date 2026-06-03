export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(w => {
    const lower = w.toLowerCase();
    if (['for', 'of', 'in', 'and', 'to', 'with', 'by'].includes(lower)) {
      return lower;
    }
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ').replace(/^\w/, c => c.toUpperCase());
};

export const formatAffiliation = (str) => {
  if (!str) return '';
  if (str.toLowerCase() === 'bput') return 'BPUT';
  return capitalizeWords(str);
};
