import Logo from "@/app/_components/Logo";
import { motion } from "framer-motion";

const BLUE_300 = "#93c5fd"; // tailwind blue-300
const BLUE_400 = "#60a5fa"; // tailwind blue-400
const BLUE_500 = "#3b82f6"; // tailwind blue-500
const BLUE_600 = "#2563eb"; // tailwind blue-600 (a touch deeper anchor)

function AnimateTitle({ children }) {
  const SHINE = [BLUE_500, BLUE_400, BLUE_300, BLUE_400, BLUE_500];

  return (
    <>
      <Logo configStyles="m-auto !w-40" width={200} />
      <motion.h2
        className="pt-5 pb-4.5 text-center text-3xl tracking-tighter md:text-5xl"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.span
          className="inline-flex items-center gap-3"
          animate={{ color: SHINE }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.span>
      </motion.h2>
    </>
  );
}

export default AnimateTitle;
