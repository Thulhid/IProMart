// app/components/Footer.js
"use client";

import dynamic from "next/dynamic";
import { FaSquareFacebook, FaSquareWhatsapp, FaTiktok } from "react-icons/fa6";
import { SiGmail, SiGooglemaps } from "react-icons/si";
import MiniSpinner from "@/app/_components/MiniSpinner";
import Logo from "@/app/_components/Logo";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("./Map"), {
  ssr: false, // <-- prevent server-side rendering
  loading: () => (
    <div>
      <MiniSpinner size={50} configStyles="text-zinc-300 mt-5" />{" "}
      <span className="my-5 flex content-center justify-center text-xs text-zinc-300">
        Loading map...
      </span>
    </div>
  ),
});

export default function Footer() {
  const latitude = 6.9671488;
  const longitude = 79.9006488;

  return (
    <footer className="mt-5 rounded-b-xl bg-zinc-800 py-2 md:mt-10 md:p-4">
      <div className="mx-2 flex justify-between md:mx-5" role="contentinfo">
        {/* Business Contact Section */}
        <section aria-labelledby="contact-info">
          <div className="my-5">
            <Logo
              photoUrl="/logo/logo-white.png"
              configStyles="!w-100 my-2"
              width={100}
            />

            <address className="text-xs text-zinc-300 not-italic md:text-sm">
              No. 714, KandyRoad, Thorana Junction, Kelaniya, Sri Lanka
            </address>
          </div>

          <div className="mb-5" aria-label="Social media links">
            <p className="mb-2 text-sm text-zinc-300 md:text-base">
              Find us on:
            </p>
            <nav
              className="flex gap-1 md:gap-5"
              role="navigation"
              aria-label="Social media"
            >
              {" "}
              <a href="#" aria-label="TikTok" title="TikTok">
                <FaTiktok size={25} className="text-zinc-100" />
              </a>
              <a href="#" aria-label="Facebook" title="Face Book">
                <FaSquareFacebook size={30} className="text-blue-500" />
              </a>
              <a href="#" aria-label="Gmail">
                <SiGmail size={30} className="text-red-500" title="G-Mail" />
              </a>
              <a href="#" aria-label="WhatsApp">
                <FaSquareWhatsapp
                  size={30}
                  className="text-green-500"
                  title="Whatsapp"
                />
              </a>
              <a href="#" aria-label="GoogleMap">
                <SiGooglemaps
                  size={30}
                  className="text-red-500"
                  title="Google Map"
                />
              </a>
            </nav>
          </div>

          <p className="text-xs text-zinc-400 md:text-sm">
            &#169; I Pro Mart {new Date().getFullYear()}
          </p>
          <p className="text-xs text-zinc-400 md:text-sm">
            Designed & Development by Alpha Media
          </p>
        </section>

        {/* Map Section */}
        <section aria-labelledby="shop-location">
          {/* <h2
            id="shop-location"
            className="text-sm font-semibold mb-2 text-zinc-500"
          >
            Our Shop Location
          </h2> */}
          <div className="h-50 w-40 rounded-lg border border-zinc-600 md:w-sm">
            <Map latitude={latitude} longitude={longitude} />
          </div>
        </section>
      </div>
    </footer>
  );
}
