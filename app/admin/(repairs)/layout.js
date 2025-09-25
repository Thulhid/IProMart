"use client";

import BackButton from "@/app/_components/BackButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineChevronLeft } from "react-icons/hi2";

export default function CourseLayout({ children, params }) {
  // ✅ unwrap the params Promise
  const pathname = usePathname();

  const tabs = [
    {
      name: "Requests",
      href: `/admin/repair-requests`,
    },
    { name: "Jobs", href: `/admin/repair-jobs` },
  ];

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Repairs</h1>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <ul className="-mb-px flex flex-wrap text-center text-sm font-medium">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const isRequest = pathname.endsWith("repair-requests");
              const isJob = pathname.endsWith("repair-jobs");
              return (
                <li key={tab.name} className="me-2">
                  <Link
                    href={tab.href}
                    className={`inline-block rounded-t-lg border-b-2 p-4 ${
                      isActive
                        ? isRequest
                          ? "border-blue-400 text-blue-400"
                          : isJob
                            ? "border-blue-400 text-blue-400"
                            : ""
                        : "border-transparent text-zinc-400 hover:border-zinc-300 hover:text-zinc-200"
                    }`}
                  >
                    {tab.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
