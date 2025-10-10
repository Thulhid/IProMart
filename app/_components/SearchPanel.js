"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Button from "@/app/_components/Button";
import { useDebounce } from "@/app/_hooks/useDebounce";
import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { useCategories } from "@/app/_hooks/useCategories";

function SearchPanel({ categories }) {
  const uiCategories = [
    { name: "All Categories", _id: "10210" },
    ...categories,
  ];
  //const [open, setOpen] = useState(false);
  //const [category, setSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 400);
  const { open, setOpen, setSelected, selected } = useCategories();
  const { ref } = useOutsideClick(() => setOpen(false));
  const router = useRouter();
  const searchParams = useSearchParams();
  // const isFirstRender = useRef(true);

  useEffect(() => {
    // if (searchParams.get("category")) {
    //   setSelected(searchParams.get("category"));
    // }

    if (searchParams.get("category") && !selected) {
      setSelected(() => searchParams.get("category"));
    }

    const params = new URLSearchParams(searchParams.toString());

    const trimmedQuery = debouncedQuery.trim();
    if (trimmedQuery) {
      params.set("name", trimmedQuery);
    } else {
      params.delete("name");
    }

    const newQuery = `?${params.toString()}`;
    const currentQuery = `?${searchParams.toString()}`;
    if (newQuery !== currentQuery) {
      router.replace(newQuery);
    }
  }, [debouncedQuery, selected, router, searchParams, setSelected]);

  return (
    <form className="mx-auto max-w-md rounded-lg bg-zinc-200 xl:min-w-md">
      <label
        htmlFor="default-search"
        className="sr-only mb-2 text-sm font-medium text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
          <svg
            className="h-4 w-4 text-blue-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className={`block w-3xs border-none p-2.5 ps-8 text-sm text-zinc-800 transition-all duration-300 focus:outline-none md:p-4 md:ps-10 md:focus:w-3xs`}
          placeholder="What do you looking for..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="absolute end-2.5 bottom-0.5 hidden py-1.5 text-left md:py-2 xl:inline-block">
          <Button
            variant="small"
            configStyles="!text-blue-800 font-semibold"
            onClick={(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
          >
            {selected
              ? uiCategories.reduce((acc, el) => {
                  if (el._id === selected) {
                    return el.name;
                  }
                  return acc;
                }, null)
              : "Categories"}
            <FaChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>

          {open && (
            <ul
              ref={ref}
              className="animate-fade-slide absolute mt-2 grid w-xl grid-cols-3 overflow-hidden rounded-lg bg-blue-50 p-6 text-sm font-semibold text-blue-900 shadow-lg ring ring-zinc-400 transition duration-300 ease-in-out"
            >
              {uiCategories.map((category, i) => (
                <li
                  key={i}
                  onClick={() => setSelected(category._id)}
                  className="cursor-pointer px-4 py-2 transition-colors duration-200 hover:bg-blue-900 hover:text-blue-50"
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </form>
  );
}

export default SearchPanel;
