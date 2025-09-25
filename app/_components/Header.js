import Logo from "@/app/_components/Logo";
import { motion } from "framer-motion";

function Header({ children, headerMotion, onIsToggleMenu }) {
  const { headerWidth, headerPadding } = headerMotion;
  return (
    <motion.div
      style={{
        width: headerWidth,
        paddingTop: headerPadding,
        paddingBottom: headerPadding,
      }}
      className="fixed top-4 left-1/2 z-1000 flex max-w-7xl -translate-x-1/2 items-center justify-between rounded-xl bg-zinc-700 px-1.5 shadow-lg transition-colors duration-300 md:px-3"
    >
      {children}
    </motion.div>
  );
}

function leftContent({ children }) {
  return (
    <>
      <div className="m-auto inline-block xl:hidden">
        <Logo photoUrl={"/logo/logo-white.png"} />
      </div>
      <div className="flex items-center gap-3">{children}</div>
      <div className="m-auto hidden xl:inline-block">
        <Logo
          configStyles="!w-50"
          width={90}
          photoUrl={"/logo/logo-white.png"}
        />
      </div>
    </>
  );
}

function rightContent({ children }) {
  return <div className="flex items-center gap-2 sm:gap-10">{children}</div>;
}

Header.leftContent = leftContent;
Header.rightContent = rightContent;

export default Header;
