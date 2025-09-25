import { motion } from "framer-motion";
import { HiOutlineLightBulb } from "react-icons/hi2";

function DescriptionBulb() {
  return (
    <motion.div
      className="text-yellow-400 drop-shadow-lg"
      animate={{
        opacity: [0.8, 1, 0.8],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <HiOutlineLightBulb size={40} />
    </motion.div>
  );
}

export default DescriptionBulb;
