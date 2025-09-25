"use client";

import Button from "@/app/_components/Button";
import { CiUser } from "react-icons/ci";

function MobileSignupLogin({ onCloseModal }) {
  return (
    // <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] flex items-end sm:items-center justify-center px-4 sm:px-0">
    <div className="w-full max-w-sm bg-zinc-900 rounded-lg sm:rounded-2xl p-2 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-zinc-300">
          <CiUser size={22} className="text-red-500" />
          <span className="font-semibold">You are not logged in</span>
        </div>
        {/* <button
            onClick={onClose}
            className="text-zinc-400 hover:text-red-500 text-sm"
          >
            Close
          </button> */}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          link="/auth/login"
          size="sm"
          variant="secondary"
          onClick={onCloseModal}
        >
          Login
        </Button>
        <Button
          link="/auth/signup"
          size="sm"
          variant="primary"
          onClick={onCloseModal}
        >
          Sign Up
        </Button>
      </div>
    </div>
    // </div>
  );
}

export default MobileSignupLogin;
