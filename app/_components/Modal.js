"use client";

import Button from "@/app/_components/Button";
import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;
  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}
function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const { ref } = useOutsideClick(close);

  if (name !== openName) return null;
  return createPortal(
    <div className="fixed top-0 left-0 z-1003 h-dvh w-full overflow-auto bg-zinc-900/10 backdrop-blur-xs">
      <div
        ref={ref}
        className="xl:px-10px fixed top-1/2 left-1/2 w-85 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-5 transition-all duration-300 sm:w-auto md:px-5"
      >
        <Button onClick={close} className="cursor-pointer" variant="close">
          <HiXMark size={20} strokeWidth={1} />
        </Button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;
export default Modal;
