// import { useEffect, useRef } from 'react';

// export function useOutsideClick(handler, listingCapturing = true) {
//   const ref = useRef();

//   useEffect(
//     function () {
//       function handleClick(e) {
//         if (ref.current && !ref.current.contains(e.target)) handler();
//       }
//       document.addEventListener('click', handleClick, listingCapturing);

//       return () =>
//         document.removeEventListener('click', handleClick, listingCapturing);
//     },
//     [handler, listingCapturing],
//   );

//   return { ref };
// }

// /app/_hooks/useOutsideClick.js
import { useEffect, useRef } from "react";

export function useOutsideClick(callback) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);

  return { ref };
}
