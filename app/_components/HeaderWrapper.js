"use client";

import Header from "@/app/_components/Header";
import { useScrollAnimation } from "@/app/_hooks/useScrollAnimation";
import { useState } from "react";

function HeaderWrapper({ leftContent, rightContent }) {
  const { headerMotion } = useScrollAnimation();
  const [isToggleMenu, setIsToggleMenu] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      <Header headerMotion={headerMotion} onIsToggleMenu={setIsToggleMenu}>
        <Header.leftContent>{leftContent}</Header.leftContent>
        <Header.rightContent>{rightContent}</Header.rightContent>
      </Header>
    </div>
  );
}
export default HeaderWrapper;
