import { motion } from "framer-motion";

function ContainerBox({ children, isCentered = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`my-4 flex ${isCentered ? "" : "min-h-screen justify-center"} items-start bg-zinc-950 p-4 md:my-8`}
    >
      {children}
    </motion.div>
  );
}

export default ContainerBox;
