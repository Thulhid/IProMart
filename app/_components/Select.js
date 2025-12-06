"use client";
import { useState, useEffect, useRef } from "react";
import { HiMiniChevronDown } from "react-icons/hi2";

function Select({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const selected = options.find((opt) => opt.value === value) || options[0];

  function handleSelect(val) {
    onChange({ target: { value: val } });
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative m-2 ml-auto w-55 text-sm text-zinc-300 sm:m-0"
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-left text-sm text-zinc-200 hover:border-zinc-500"
      >
        {selected.label}
        <HiMiniChevronDown />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-zinc-600 bg-zinc-900 shadow-md">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`cursor-pointer px-4 py-2 hover:bg-zinc-800 ${
                option.value === value
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-400"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
