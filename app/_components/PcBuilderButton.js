"use client";

import Button from "@/app/_components/Button";
import { motion } from "framer-motion";

function PcBuilderButton() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 bg-[length:200%_200%] px-1 py-1 transition duration-300 ease-in-out hover:scale-105"
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
    >
      {" "}
      <Button link="/pc-builder" variant="header">
        PC Builder
      </Button>
    </motion.div>
  );
}

export default PcBuilderButton;
