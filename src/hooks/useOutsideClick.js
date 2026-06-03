import { useEffect } from 'react';

/**
 * Custom hook that fires a callback when a click or touch event occurs outside the referenced element.
 * @param {React.RefObject} ref - The element ref to monitor
 * @param {function} callback - The function to call when a click outside occurs
 */
export function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback]);
}

export default useOutsideClick;
