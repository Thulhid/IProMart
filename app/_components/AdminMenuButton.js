"use client";

import { useState, useRef, useEffect } from "react";
import { HiCog6Tooth } from "react-icons/hi2";
import Link from "next/link";
import Button from "@/app/_components/Button";
import { CiSettings } from "react-icons/ci";
import { getEmployee } from "@/app/_lib/employee-service";

export default function AdminMenuButton({ userRole }) {
  const [open, setOpen] = useState(false);
  const [dbUser, setDbUser] = useState("");
  const dropdownRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getEmployee();
      setDbUser(user.data.data.role);
    })();
  }, []);

  if (userRole !== "admin" && userRole !== "employee") return null;

  return (
    <>
      {/* Settings Button (anywhere on screen) */}
      <Button
        variant="header"
        onClick={() => setOpen(!open)}
        className="rounded-full p-2 transition hover:bg-zinc-800"
        configStyles="hidden xl:inline-block"
      >
        <HiCog6Tooth size={22} className="text-zinc-300" />
      </Button>
      <Button
        configStyles="flex flex-col items-center xl:hidden"
        onClick={() => setOpen(!open)}
      >
        <CiSettings size={30} className="text-zinc-300" />
        <span className="text-xs text-zinc-400">Settings</span>
      </Button>
      {/* Fixed Center Dropdown */}
      {open && (
        <div className="fixed inset-0 z-[1005] flex items-center justify-center bg-zinc-900/10 backdrop-blur-xs xl:inset-20 xl:items-start xl:justify-end xl:bg-transparent xl:backdrop-blur-none">
          <div
            ref={dropdownRef}
            className="animate-fade-slide w-80 max-w-full rounded-lg border border-zinc-700 bg-zinc-900 p-4 xl:bg-zinc-800 xl:ring xl:ring-zinc-400"
          >
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>
                <Link
                  href="/admin/hero-slides"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Manage Hero
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Manage Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Manage Products
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/orders"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/coupons"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Manage Coupons
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/repair-requests"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Manage Repairs
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/customers"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Manage Customers
                </Link>
              </li>
              {dbUser === "admin" && (
                <li>
                  <Link
                    href="/admin/employees"
                    className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                  >
                    Manage Employees
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/admin/setting"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/about"
                  className="block px-4 py-2 transition-colors duration-200 hover:bg-zinc-300 hover:text-blue-600 active:bg-zinc-300 active:text-blue-600"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
