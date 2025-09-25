"use client";

import { useState } from "react";
import Image from "next/image";
import { CiGps } from "react-icons/ci";

function ProductSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides?.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides?.length) % slides?.length);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative max-w-2xl">
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {slides?.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {slides?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full cursor-pointer ${
              activeIndex === index ? "text-red-600" : "text-zinc-50/50"
            }`}
            aria-label={`Slide ${index + 1}`}
          >
            <CiGps size={22} strokeWidth={1} />
          </button>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center h-full justify-center px-4 cursor-pointer group focus:outline-none"
        aria-label="Previous Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full group-hover:bg-zinc-400/20 group-active:bg-zinc-400/20">
          <svg
            className="w-4 h-4 text-zinc-50/50 rtl:rotate-180 group-hover:text-red-600 group-active:text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </span>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        aria-label="Next Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full group-hover:bg-zinc-400/20 group-active:bg-zinc-400/20">
          <svg
            className="w-4 h-4 text-zinc-50/50 rtl:rotate-180  group-hover:text-red-600 group-active:text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default ProductSlider;
