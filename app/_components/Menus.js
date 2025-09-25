import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import Button from "./Button";
import { useOutsideClick } from "@/app/_hooks/useOutsideClick";

const MenusContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{
        openId,
        position,
        setPosition,
        close,
        open,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const { openId, close, open, setPosition } = useContext(MenusContext);
  function handleClick(e) {
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    openId === "" || openId !== id ? open(id) : close();
  }
  return (
    <button
      onClick={handleClick}
      className="w-fit focus:rounded focus:ring focus:ring-blue-400"
    >
      <HiEllipsisVertical size={22} className="cursor-pointer text-blue-400" />
    </button>
  );
}
function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);
  const { ref } = useOutsideClick(close);
  if (openId !== id) return null;
  return createPortal(
    <ul
      style={{ top: `${position.y}px`, right: `${position.x}px` }}
      className="animate-fade-slide fixed z-1001 space-y-1 rounded border border-zinc-700 bg-zinc-900 px-1 py-1 text-zinc-300 transition duration-300 ease-in-out"
      ref={ref}
    >
      {children}
    </ul>,
    document.body,
  );
}
function ButtonMenu({ children, icon, onClick, variant, link }) {
  const { close } = useContext(MenusContext);
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <Button onClick={handleClick} variant={variant} link={link}>
        {icon}
        <span>{children}</span>
      </Button>
    </li>
  );
}

// Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.ButtonMenu = ButtonMenu;
export default Menus;
