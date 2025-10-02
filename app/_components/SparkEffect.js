"use client";
import { motion } from "framer-motion";
import {
  HiBolt,
  HiHeart,
  HiMiniFire,
  HiOutlineBolt,
  HiOutlineLightBulb,
} from "react-icons/hi2";
function SparkEffect({ children }) {
  return (
    <motion.span
      className="drop-shadow-[0_0_10px_oklch(48.8% 0.243 264.376)] inline-block text-blue-400"
      animate={{
        opacity: [0.6, 1, 0.6],
        filter: [
          //   "drop-shadow(0 0 5px rgba(255, 255, 0, 0.4))",
          //   "drop-shadow(0 0 12px rgba(255, 255, 0, 0.9))",
          //   "drop-shadow(0 0 5px rgba(255, 255, 0, 0.4))",
          "drop-shadow(0 0 5px oklch(70.7% 0.165 254.624))",
          "drop-shadow(0 0 12px oklch(48.8% 0.243 264.376))",
          "drop-shadow(0 0 5px oklch(70.7% 0.165 254.624))",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}

export default SparkEffect;
