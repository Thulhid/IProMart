"use client";

import { getCategoryById } from "@/app/_lib/category-service";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function SubcategorySelection({ isVertical = false }) {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryId = searchParams.get("category") ?? null;
  // Load subcategories when category changes
  useEffect(() => {
    (async () => {
      if (!categoryId) {
        setSubcategories([]);
        setSelectedId(null);
        return;
      }
      try {
        const res = await getCategoryById(categoryId);
        const list = res?.data?.data?.data?.Subcategories ?? [];
        setSubcategories(list);
      } catch (error) {
        toast.error(error?.message || "Failed to load subcategories");
      }
    })();
  }, [categoryId]);

  // Keep selectedId in sync with URL (?subcategory=...) and available list
  useEffect(() => {
    const fromUrl = searchParams.get("subcategory");
    if (!fromUrl) {
      if (selectedId !== null) setSelectedId(null);
      return;
    }
    const exists = subcategories.some((s) => s._id === fromUrl);
    setSelectedId(exists ? fromUrl : null);
  }, [searchParams, subcategories, selectedId]); // runs on URL change

  // Update the URL query string
  const setQuery = (nextId) => {
    const next = new URLSearchParams(searchParams.toString());
    if (nextId) next.set("subcategory", nextId);
    else next.delete("subcategory");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleToggle = (id) => {
    if (selectedId === id) {
      // uncheck if clicking the same one
      setSelectedId(null);
      setQuery(null);
    } else {
      // enforce single selection
      setSelectedId(id);
      setQuery(id);
    }
  };

  if (!categoryId) return null;

  return (
    <div className={`flex gap-5 ${isVertical ? "flex-col" : ""}`}>
      {subcategories.map((sc) => {
        const checked = selectedId === sc._id;
        return (
          <label
            key={sc._id}
            className={`flex cursor-pointer items-center gap-2 text-sm text-zinc-200 select-none lg:text-base`}
          >
            <input
              type="checkbox"
              className="h-3 w-3 cursor-pointer accent-blue-700 lg:h-4 lg:w-4"
              checked={checked}
              onChange={() => handleToggle(sc._id)}
              aria-checked={checked}
              aria-label={sc.name}
            />
            <span className="capitalize">{sc.name}</span>
          </label>
        );
      })}
    </div>
  );
}
