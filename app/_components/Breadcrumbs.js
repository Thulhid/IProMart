"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS = {
  admin: "Admin",
  auth: "Auth",
  cart: "Cart",
  me: "Me",
  wallet: "Wallet",
  payment: "Payment",
  products: "Products",
  promo: "Promo",
  repairs: "Repairs",
  "pc-builder": "PC Builder",
  "repair-payment": "Repair Payment",
};

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function formatSegment(segment) {
  if (LABELS[segment]) return LABELS[segment];
  const decoded = safeDecode(segment);
  const spaced = decoded.replace(/[-_]+/g, " ");
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  if (pathname === "/") return null;
  const segments = pathname.split("/").filter(Boolean);
  const nonClickable = new Set(["admin"]);
  const needsHeaderOffset =
    pathname === "/admin/dashboard" || pathname === "/admin/products";
  const topOffset = needsHeaderOffset ? "mt-20 sm:mt-24" : "mt-0";

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = formatSegment(segment);
    const shortLabel = label.length > 28 ? `${label.slice(0, 24)}...` : label;
    return {
      href,
      label,
      shortLabel,
      segment,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav
      className={`mx-4 mb-5 flex flex-wrap items-center gap-2 text-xs text-zinc-400 sm:text-sm md:mx-10 2xl:mx-auto 2xl:max-w-[1440px] ${topOffset}`}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-zinc-100"
      >
        Home
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span className="text-zinc-600">/</span>
          {crumb.isLast ? (
            <span
              className="rounded-md border border-blue-500/40 bg-blue-500/10 px-2 py-1 text-blue-200"
              title={crumb.label}
            >
              {crumb.shortLabel}
            </span>
          ) : nonClickable.has(crumb.segment) ? (
            <span
              className="rounded-md border border-zinc-700 bg-zinc-900/40 px-2 py-1 text-zinc-500"
              title={crumb.label}
            >
              {crumb.shortLabel}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-zinc-100"
              title={crumb.label}
            >
              {crumb.shortLabel}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
