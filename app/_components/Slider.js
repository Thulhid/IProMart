"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CiGps } from "react-icons/ci";
import { useSearchParams } from "next/navigation";

function Slider({
  slides,
  containerStyles,
  autoSlide = false,
  autoSlideInterval = 3000,
  buttonColor,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const intervalRef = useRef(null);
  const searchParams = useSearchParams();

  // ✅ Normalize slide input: allow string or object
  const normalizedSlides = slides.map((s) =>
    typeof s === "string" ? { image: s } : s,
  );

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % normalizedSlides.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + normalizedSlides.length) % normalizedSlides.length,
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const handleUserAction = (action) => {
    setUserInteracted(true);
    action();
  };

  useEffect(() => {
    if (autoSlide && !userInteracted) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % normalizedSlides.length);
      }, autoSlideInterval);
    }

    return () => clearInterval(intervalRef.current);
  }, [autoSlide, autoSlideInterval, normalizedSlides.length, userInteracted]);

  if (searchParams.get("name")) return null;

  return (
    <div className={`relative m-auto max-w-7xl ${containerStyles}`}>
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-160">
        {normalizedSlides.map((slide, index) => {
          const imageElement = (
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
            />
          );

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              {slide.link ? (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full"
                >
                  {imageElement}
                </a>
              ) : (
                imageElement
              )}
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {normalizedSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleUserAction(() => goToSlide(index))}
            className={`cursor-pointer rounded-full ${
              activeIndex === index ? "text-zinc-300" : "text-zinc-500/50"
            }`}
            aria-label={`Slide ${index + 1}`}
          >
            <CiGps size={22} strokeWidth={1} />
          </button>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={() => handleUserAction(prevSlide)}
        type="button"
        className="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        aria-label="Previous Slide"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full group-hover:bg-zinc-400/20 group-active:bg-zinc-400/20">
          <svg
            className={`h-4 w-4 text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200 rtl:rotate-180 ${buttonColor}`}
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
        onClick={() => handleUserAction(nextSlide)}
        type="button"
        className="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        aria-label="Next Slide"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full group-hover:bg-zinc-400/20 group-active:bg-zinc-400/20">
          <svg
            className={`h-4 w-4 text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200 rtl:rotate-180 ${buttonColor}`}
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

export default Slider;
