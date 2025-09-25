"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const images = ["/hero4.jpg", "/hero2.webp", "/hero3.webp"];

function HeroSlider() {
  const searchParams = useSearchParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    stopAutoplay();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    stopAutoplay();
  };

  const stopAutoplay = () => {
    setAutoplay(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (autoplay) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoplay]);
  if (searchParams.get("name")) return null;

  return (
    <div className="relative flex items-center justify-center overflow-x-hidden max-w-4xl m-auto mb-10">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 1 }}
        className="relative h-[8rem] md:h-[20rem] w-full max-w-4xl overflow-hidden rounded-lg shadow 
       transition-transform duration-300"
      >
        <Image
          src={images[currentIndex]}
          alt={`Headphone ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
      </motion.div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer text-xs"
      >
        <HiChevronLeft size={30} className="text-gray-100" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-xs"
      >
        <HiChevronRight size={30} className="text-gray-100" />
      </button>
    </div>
  );
}

export default HeroSlider;
