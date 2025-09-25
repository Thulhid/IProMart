"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {FaChevronDown} from "react-icons/fa6";
import Button from "@/app/_components/Button";
import {useDebounce} from "@/app/_hooks/useDebounce";
import {useOutsideClick} from "@/app/_hooks/useOutsideClick";
import {useCategories} from "@/app/_hooks/useCategories";
import {uiCategoryFormat} from "@/app/_utils/helper";

function SearchPanel({categories}) {
    const uiCategories = ["All Categories", ...categories];
    //const [open, setOpen] = useState(false);
    //const [category, setSelected] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedQuery = useDebounce(searchQuery, 400);
    const {open, setOpen, setSelected, selected} = useCategories();
    const {ref} = useOutsideClick(() => setOpen(false));
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
        <form className="max-w-md xl:min-w-md mx-auto bg-zinc-200 rounded-lg">
            <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium sr-only text-white"
            >
                Search
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-2.5 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-blue-900"
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
                    className={`block transition-all duration-300 p-2.5 md:focus:w-3xs md:p-4 ps-8 md:ps-10 text-sm text-zinc-800 border-none focus:outline-none w-3xs
          
          `}
                    placeholder="What do you looking for..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="text-left absolute end-2.5 bottom-0.5 py-1.5 md:py-2 hidden xl:inline-block">
                    <Button
                        variant="small"
                        configStyles="!text-blue-800 font-semibold"
                        onClick={(e) => {
                            e.preventDefault();
                            setOpen((prev) => !prev);
                        }}
                    >
                        {selected ? uiCategoryFormat(selected) : "Categories"}
                        <FaChevronDown
                            className={`h-4 w-4 transition-transform ${
                                open ? "rotate-180" : ""
                            }`}
                        />
                    </Button>

                    {open && (
                        <ul
                            ref={ref}
                            className="grid grid-cols-3 absolute mt-2 w-xl rounded-lg shadow-lg overflow-hidden ring ring-zinc-400 animate-fade-slide text-sm
              bg-blue-50 text-blue-900 p-6 transition duration-300 ease-in-out font-semibold"
                        >
                            {uiCategories.map((category, i) => (
                                <li
                                    key={i}
                                    onClick={() => setSelected(category)}
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-900 hover:text-blue-50 transition-colors duration-200"
                                >
                                    {uiCategoryFormat(category)}
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
