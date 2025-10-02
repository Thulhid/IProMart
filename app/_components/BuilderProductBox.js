"use client";

import { useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Product from "@/app/_components/Product";

export default function BuilderProductBox({
  products = [],
  title = "Pre-built Desktops",
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth } = el;
    const delta = direction === "left" ? -clientWidth : clientWidth;
    el.scrollTo({ left: scrollLeft + delta, behavior: "smooth" });
  };

  if (!products?.length) return null;

  return (
    <div className="relative w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-200">{title}</h2>
      </div>

      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full border border-zinc-700 bg-zinc-900/80 p-2 text-zinc-200 backdrop-blur hover:bg-zinc-800"
      >
        <HiChevronLeft size={20} />
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full border border-zinc-700 bg-zinc-900/80 p-2 text-zinc-200 backdrop-blur hover:bg-zinc-800"
      >
        <HiChevronRight size={20} />
      </button>

      {/* Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-10 py-4"
      >
        {products.map((p) => (
          <div
            key={p._id}
            className="w-[260px] shrink-0 snap-start sm:w-[320px] md:w-[360px]"
          >
            <Product product={p} isPreBuilt={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
