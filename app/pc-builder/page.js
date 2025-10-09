"use client";

import { useEffect, useMemo, useState } from "react";
import { HiOutlineChevronLeft, HiShoppingBag } from "react-icons/hi2";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import toast from "react-hot-toast";
import { getProducts } from "@/app/_lib/product-service";
import BuilderProductBox from "@/app/_components/BuilderProductBox";

// ✅ cart + auth + guest helpers for add-to-cart
import { createOrUpdateCart, getCustomerCart } from "@/app/_lib/cart-service";
import { getCustomer } from "@/app/_lib/customer-service";
import { formatCurrency, handleSaveGustProduct } from "@/app/_utils/helper";
import Spinner from "@/app/_components/Spinner";
import BuildPdfButton from "@/app/_components/BuildPdfButton";
import Image from "next/image";

// Map builder steps -> category names to match (lowercased). Add/adjust synonyms if needed.
const CATEGORY_MATCH = {
  cpu: ["cpu", "CPU", "processor", "processors"],
  motherboard: ["motherboard", "mainboard", "mobos", "motherboards"],
  ram: ["ram", "rams", "memory", "RAM"],
  gpu: ["gpu", "graphics card", "graphics", "vga", "graphic cards"],
  storage: [
    "storage",
    "ssd",
    "hdd",
    "nvme",
    "sata ssd",
    "hard drive",
    "storages",
  ],
  case: ["case", "pc case", "chassis", "cases", "casings"],
  psu: ["psu", "power supply", "power supplies"],
  cooler: [
    "cooler",
    "coolers",
    "cpu cooler",
    "cpu coolers",
    "air cooler",
    "liquid cooler",
    "liquid coolers",
  ],
};

const AMD_CPU_KEYS = /(ryzen)/i;
const INTEL_CPU_KEYS = /(intel|\bi3\b|\bi5\b|\bi7\b|\bi9\b)/i;

// include ryzen/intel keywords for mobos too
const AMD_MB_KEYS =
  /(ryzen|am4|am5|b450|b550|x470|x570|a520|b650|x670|x670e|b650e)/i;
const INTEL_MB_KEYS =
  /(intel|lga(1151|1200|1700)|\bz\d{3}\b|\bb\d{3}\b|\bh\d{3}\b)/i;

function isAmdCPU(p) {
  const t = `${p?.subcategory?.name ?? ""} ${p?.name ?? ""}`.toLowerCase();
  return AMD_CPU_KEYS.test(t);
}
function isIntelCPU(p) {
  const t = `${p?.subcategory?.name ?? ""} ${p?.name ?? ""}`.toLowerCase();
  return INTEL_CPU_KEYS.test(t);
}
function isAmdMB(p) {
  const t =
    `${p?.subcategory?.name ?? ""} ${p?.name ?? ""} ${p?.description ?? ""}`.toLowerCase();
  return AMD_MB_KEYS.test(t);
}
function isIntelMB(p) {
  const t =
    `${p?.subcategory?.name ?? ""} ${p?.name ?? ""} ${p?.description ?? ""}`.toLowerCase();
  return INTEL_MB_KEYS.test(t);
}

const PART_STEPS = [
  { key: "cpu", label: "CPU" },
  { key: "motherboard", label: "Motherboard" },
  { key: "ram", label: "RAM" },
  { key: "gpu", label: "Graphics Card" },
  { key: "storage", label: "Storage" },
  { key: "case", label: "Case" },
  { key: "psu", label: "Power Supply" },
  { key: "cooler", label: "CPU Cooler" },
];

// Fallback image (only used if a product has no imageCover)
const fallbackImg = (seed) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/400`;

// ✅ simple, robust matcher for category names like "pre-built-desktop", "Pre Built PC", "prebuilt_pc", etc.
function isPrebuiltCategoryName(name) {
  const s = (name || "").toLowerCase().replace(/[_-]+/g, " ");
  const hasPrebuilt =
    s.includes("prebuilt") || (s.includes("pre") && s.includes("build"));
  const isDesktopish = s.includes("desktop") || s.includes("pc");
  return hasPrebuilt && isDesktopish;
}

export default function PcBuilderPage() {
  const [pickerOpenFor, setPickerOpenFor] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({}); // { cpu: product, ... }

  // Picker data state
  const [options, setOptions] = useState([]); // accumulated filtered products for the current part
  const [isLoading, setIsLoading] = useState(false);
  const [apiPage, setApiPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // NEW: prebuilt desktops for the horizontal scroller
  const [prebuiltProducts, setPrebuiltProducts] = useState([]);
  const [loadingPrebuilt, setLoadingPrebuilt] = useState(true);

  // for “Open Cart” button after adding
  const [addedToCart, setAddedToCart] = useState(false);
  const [adding, setAdding] = useState(false);

  // ✅ moved INSIDE component so `selected` exists
  const allSelected = useMemo(
    () => PART_STEPS.every(({ key }) => Boolean(selected[key])),
    [selected],
  );

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pc_builder_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setSelected(parsed);
      }
    } catch {}
  }, []);

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pc_builder_v1", JSON.stringify(selected));
    } catch {}
  }, [selected]);

  // 🔄 load a handful of prebuilt desktops (category matches "pre-built desktop" idea)
  useEffect(() => {
    (async () => {
      setLoadingPrebuilt(true);
      try {
        const out = [];
        let page = 1;
        // pull up to 5 pages or ~20 items; stop early if a page is empty
        while (page <= 5 && out.length < 20) {
          const res = await getProducts(page);
          const docs = res?.data?.data || [];
          if (!docs.length) break;

          const filtered = docs.filter((p) =>
            isPrebuiltCategoryName(p?.category?.name),
          );
          out.push(...filtered);

          const results = Number(res?.results ?? docs.length);
          if (!results) break;
          page += 1;
        }
        setPrebuiltProducts(out);
      } catch (e) {
        toast.error(e?.message || "Failed to load pre-built desktops");
      } finally {
        setLoadingPrebuilt(false);
      }
    })();
  }, []);

  const subtotal = useMemo(
    () =>
      Object.values(selected).reduce(
        (sum, item) => sum + (item?.finalPrice ?? item?.price ?? 0),
        0,
      ),
    [selected],
  );

  const anySelected = Object.keys(selected).length > 0;

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.subcategory?.name?.toLowerCase().includes(q),
    );
  }, [search, options]);

  function openPicker(partKey) {
    setPickerOpenFor(partKey);
    setOptions([]);
    setSearch("");
    setApiPage(1);
    setHasMore(true);
    // initial batch
    void loadMore(partKey, 1, true);
  }

  function closePicker() {
    setPickerOpenFor(null);
    setOptions([]);
    setSearch("");
    setApiPage(1);
    setHasMore(true);
  }

  function selectPart(partKey, product) {
    setSelected((s) => {
      const next = { ...s, [partKey]: product };

      // If picking a CPU and an incompatible motherboard is already selected → clear it
      if (partKey === "cpu" && s.motherboard) {
        const cpuIsAmd = isAmdCPU(product);
        const cpuIsIntel = isIntelCPU(product);
        if (
          (cpuIsAmd && !isAmdMB(s.motherboard)) ||
          (cpuIsIntel && !isIntelMB(s.motherboard))
        ) {
          toast("Incompatible motherboard cleared");
          delete next.motherboard;
        }
      }

      // If picking a Motherboard and an incompatible CPU is already selected → clear it
      if (partKey === "motherboard" && s.cpu) {
        const mbIsAmd = isAmdMB(product);
        const mbIsIntel = isIntelMB(product);
        if (
          (mbIsAmd && !isAmdCPU(s.cpu)) ||
          (mbIsIntel && !isIntelCPU(s.cpu))
        ) {
          toast("Incompatible CPU cleared");
          delete next.cpu;
        }
      }

      return next;
    });

    closePicker();
  }

  function clearPart(partKey) {
    setSelected((s) => {
      const copy = { ...s };
      delete copy[partKey];
      return copy;
    });
  }

  function clearAll() {
    setSelected({});
    setAddedToCart(false);
  }

  // --- API loader: pulls pages until we have some items (client-side filtered by category name)
  async function loadMore(
    partKey = pickerOpenFor,
    page = apiPage + 1,
    isFirst = false,
  ) {
    if (!partKey || isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const wantNames = (CATEGORY_MATCH[partKey] || []).map((s) =>
        s.toLowerCase(),
      );
      let localPage = isFirst ? 1 : page;
      let collected = isFirst ? [] : [...options];
      let loop = 0;
      let reachedEnd = false;

      while (loop < 3) {
        const res = await getProducts(localPage);
        const docs = res?.data?.data || [];
        const results = Number(res?.results ?? docs.length);

        // 1) Filter by category name (case-insensitive)
        const byCategory = docs.filter((p) => {
          const cat = (p?.category?.name || "").toLowerCase();
          return wantNames.includes(cat);
        });

        // 2) Normalize product shape (include fields used by cart/guest)
        let mapped = byCategory.map((p) => ({
          id: p._id,
          _id: p._id,
          name: p.name,
          price: p.price,
          priceDiscount: p.priceDiscount || 0,
          finalPrice:
            p.finalPrice ??
            Math.max(0, (p.price ?? 0) - (p.priceDiscount ?? 0)),
          description: p.description,
          imageCover: p.imageCover || fallbackImg(p._id || p.name),
          subcategory: p.subcategory,
          category: p.category,
          slug: p.slug,
        }));

        // 3) Simple platform filter:
        if (partKey === "motherboard" && selected?.cpu) {
          if (isAmdCPU(selected.cpu)) mapped = mapped.filter(isAmdMB);
          else if (isIntelCPU(selected.cpu)) mapped = mapped.filter(isIntelMB);
        }

        if (partKey === "cpu" && selected?.motherboard) {
          if (isAmdMB(selected.motherboard)) mapped = mapped.filter(isAmdCPU);
          else if (isIntelMB(selected.motherboard))
            mapped = mapped.filter(isIntelCPU);
        }

        collected = [...collected, ...mapped];

        if (!results || results === 0) {
          reachedEnd = true;
          break;
        }

        localPage += 1;
        loop += 1;
      }

      setOptions(collected);
      setApiPage(localPage - 1);
      setHasMore(!reachedEnd);
    } catch (err) {
      toast.error(err?.message || "Failed to load products");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Add all selected parts to cart (increment if already exists)
  async function handleAddBuildToCart() {
    if (!anySelected) {
      toast.error("Please select at least one part.");
      return;
    }
    setAdding(true);
    const toastId = toast.loading("Adding your selected parts to cart…");

    try {
      // Build a list of items to add (each +1)
      const items = PART_STEPS.map(({ key }) => selected[key]).filter(Boolean);

      let loggedIn = false;
      try {
        const user = await getCustomer();
        loggedIn = Boolean(user);
      } catch {
        loggedIn = false;
      }

      if (loggedIn) {
        // 1) Read current server cart to know existing quantities
        let serverQtyMap = new Map();
        try {
          const cartRes = await getCustomerCart();
          const cartItems = cartRes?.cart?.cartItems || [];
          for (const ci of cartItems) {
            const pid = ci?.product?._id || ci?.product;
            const q = Number(ci?.quantity || 0);
            if (pid) serverQtyMap.set(pid, q);
          }
        } catch {
          // if fetch fails, treat as empty cart
          serverQtyMap = new Map();
        }

        // 2) For each selected item → set quantity = current + 1
        await Promise.allSettled(
          items.map((p) => {
            const pid = p.id || p._id;
            const newQty = (serverQtyMap.get(pid) || 0) + 1;
            return createOrUpdateCart(pid, newQty);
          }),
        );

        // 3) Mirror to guest cart (for local UX), using same increment logic
        const guest =
          JSON.parse(localStorage.getItem("guestCart") || "[]") || [];
        const guestMap = new Map(guest.map((g) => [g._id, g.quantity || 0]));
        for (const p of items) {
          const pid = p.id || p._id;
          const mirroredQty = (guestMap.get(pid) || 0) + 1;
          handleSaveGustProduct(mirroredQty, {
            _id: pid,
            name: p.name,
            price: p.price,
            priceDiscount: p.priceDiscount || 0,
            finalPrice: p.finalPrice ?? p.price ?? 0,
            imageCover: p.imageCover,
            slug: p.slug,
            category: p.category,
          });
          guestMap.set(pid, mirroredQty);
        }
      } else {
        // Guest cart only: increment if exists
        const guest =
          JSON.parse(localStorage.getItem("guestCart") || "[]") || [];
        const guestMap = new Map(guest.map((g) => [g._id, g.quantity || 0]));

        for (const p of items) {
          const pid = p.id || p._id;
          const newQty = (guestMap.get(pid) || 0) + 1;
          handleSaveGustProduct(newQty, {
            _id: pid,
            name: p.name,
            price: p.price,
            priceDiscount: p.priceDiscount || 0,
            finalPrice: p.finalPrice ?? p.price ?? 0,
            imageCover: p.imageCover,
            slug: p.slug,
            category: p.category,
          });
          guestMap.set(pid, newQty);
        }
      }

      toast.success(`Added ${items.length} item(s) to cart.`, { id: toastId });
      setAddedToCart(true);
    } catch (err) {
      toast.error(err?.message || "Failed to add to cart", { id: toastId });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">PC Builder</h1>
      </div>
      {/* Builder Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left: Steps (2 columns on md+) */}
        <ContainerBox isCentered={true}>
          <div className="grid gap-4 md:grid-cols-2">
            {PART_STEPS.map(({ key, label }) => {
              const chosen = selected[key];
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-zinc-700 bg-zinc-900 p-5 shadow-lg shadow-blue-600/30"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <h3 className="text-lg font-medium text-zinc-200">
                        {label}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {chosen && (
                        <Button
                          buttonType="button"
                          variant="secondary"
                          onClick={() => clearPart(key)}
                        >
                          Remove
                        </Button>
                      )}
                      <Button
                        buttonType="button"
                        variant="primary"
                        onClick={() => openPicker(key)}
                      >
                        {chosen ? "Change" : "Choose"}
                      </Button>
                    </div>
                  </div>

                  {/* Selection summary with thumbnail */}
                  {chosen ? (
                    <div className="flex gap-4 rounded-xl border border-zinc-700 bg-zinc-800/70 p-4">
                      <Image
                        src={
                          chosen.imageCover ||
                          fallbackImg(chosen.id || chosen.name)
                        }
                        alt={chosen.name}
                        width={112} // matches w-28 (7rem)
                        height={80} // matches h-20 (5rem)
                        className="h-20 w-28 rounded-lg object-cover"
                      />

                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-100">
                          {chosen.name}
                        </p>
                        {chosen.subcategory?.name && (
                          <p className="mt-1 text-sm text-zinc-400">
                            {chosen.subcategory.name}
                          </p>
                        )}
                        <p className="mt-2 font-semibold text-zinc-200">
                          {formatCurrency(
                            chosen.finalPrice ?? chosen.price ?? 0,
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-400">No {label} selected.</p>
                  )}
                </div>
              );
            })}
          </div>
        </ContainerBox>

        {/* Right: Summary */}
        <div className="space-y-6">
          <ContainerBox isCentered={true}>
            <div className="min-w-xs rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-lg shadow-blue-600/40 sm:min-w-sm xl:min-w-md">
              <h2 className="mb-4 text-lg font-semibold text-zinc-200">
                Your Build
              </h2>

              <div className="space-y-2">
                {PART_STEPS.map(({ key, label }) => {
                  const item = selected[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-zinc-400">{label}</span>
                      <span className="text-zinc-200">
                        {item
                          ? formatCurrency(item.finalPrice ?? item.price ?? 0)
                          : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 h-px bg-zinc-700" />

              <div className="mt-4 flex items-center justify-between">
                <span className="text-zinc-400">Total</span>
                <span className="text-xl font-semibold text-zinc-100 md:text-2xl">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <Button
                  buttonType="button"
                  variant="secondary"
                  onClick={clearAll}
                >
                  Clear
                </Button>
                <BuildPdfButton
                  enabled={allSelected}
                  total={subtotal}
                  parts={PART_STEPS.map((p) => ({
                    label: p.label,
                    item: selected[p.key],
                  })).filter((x) => x.item)}
                />

                {/* ✅ Add-to-cart for the whole build (increments existing qty) */}
                {anySelected && (
                  <Button
                    buttonType="button"
                    variant="cart"
                    disabled={!anySelected || adding}
                    onClick={handleAddBuildToCart}
                  >
                    Add
                    <HiShoppingBag size={22} />
                  </Button>
                )}

                {addedToCart && (
                  <Button link="/cart" variant="cart">
                    Open
                    <HiShoppingBag size={22} />
                  </Button>
                )}
              </div>
            </div>
          </ContainerBox>
        </div>
      </div>
      {/* Picker Overlay */}
      {pickerOpenFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-6">
          <div className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
            {/* Header + Close */}
            <div className="border-b border-zinc-700 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-zinc-200">
                  Choose{" "}
                  {PART_STEPS.find((s) => s.key === pickerOpenFor)?.label}
                </h3>
                <Button
                  buttonType="button"
                  variant="secondary"
                  onClick={closePicker}
                >
                  Close
                </Button>
              </div>

              {/* Search (always visible) */}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name/specs…"
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-auto p-4">
              <div className="grid gap-3 md:grid-cols-2">
                {filteredBySearch.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800/60"
                  >
                    <Image
                      src={item.imageCover || fallbackImg(item.id || item.name)}
                      alt={item.name}
                      width={60} // ≈ w-15 (3.75rem)
                      height={60} // ≈ h-15 (3.75rem)
                      className="m-2 h-15 w-15 object-cover"
                    />

                    <div className="p-4">
                      <p className="font-medium text-zinc-100">{item.name}</p>
                      {item.subcategory?.name && (
                        <p className="mt-1 text-sm text-zinc-400">
                          {item.subcategory.name}
                        </p>
                      )}
                      <p className="mt-2 font-semibold text-zinc-200">
                        {formatCurrency(item.finalPrice ?? item.price ?? 0)}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <Button
                          buttonType="button"
                          variant="primary"
                          onClick={() => selectPart(pickerOpenFor, item)}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {!isLoading && filteredBySearch.length === 0 && (
                  <p className="col-span-full py-8 text-center text-zinc-400">
                    No items found.
                  </p>
                )}
              </div>
            </div>

            {/* Footer (always visible) */}
            <div className="border-t border-zinc-700 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                  Showing {filteredBySearch.length} item
                  {filteredBySearch.length === 1 ? "" : "s"}
                </p>
                <Button
                  buttonType="button"
                  variant="secondary"
                  onClick={() => loadMore()}
                  disabled={!hasMore || isLoading}
                >
                  {isLoading
                    ? "Loading…"
                    : hasMore
                      ? "Load more"
                      : "No more items"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* ⭐ Pre-built desktops scroller */}
      {loadingPrebuilt ? (
        <Spinner />
      ) : (
        <BuilderProductBox products={prebuiltProducts} />
      )}
    </div>
  );
}
