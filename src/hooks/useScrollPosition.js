import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor scroll position and return whether window is scrolled past a threshold.
 * @param {number} [threshold=8] - Threshold in pixels
 * @returns {boolean} Whether the window is scrolled past threshold
 */
export function useScrollPosition(threshold = 8) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check immediately in case page is already scrolled on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isScrolled;
}

export default useScrollPosition;
