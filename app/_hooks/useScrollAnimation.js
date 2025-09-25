"use client";

import { useScroll, useSpring, useTransform } from "framer-motion";

export function useScrollAnimation() {
  const { scrollYProgress } = useScroll(); // no container

  const headerWidth = useTransform(scrollYProgress, [0, 0.1], ["95%", "85%"]);
  const headerPadding = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["13px", "6px"]
  );

  const headerMotion = {
    headerWidth: useSpring(headerWidth, {
      stiffness: 100,
      damping: 20,
      mass: 0.5,
    }),
    headerPadding: useSpring(headerPadding, {
      stiffness: 100,
      damping: 20,
      mass: 0.5,
    }),
  };

  return { headerMotion };
}
