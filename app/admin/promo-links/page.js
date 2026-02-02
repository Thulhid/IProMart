"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import Button from "@/app/_components/Button";
import Spinner from "@/app/_components/Spinner";
import { getEmployee } from "@/app/_lib/employee-service";
import {
  createCouponLink,
  deleteCouponLink,
  getCouponLinks,
  getCouponsForSelect,
  searchProductsForSelect,
} from "@/app/_lib/coupon-link-service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [links, setLinks] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [lastCreated, setLastCreated] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      couponId: "",
      productId: "",
      isActive: true,
    },
  });

  const couponId = watch("couponId");
  const isActive = watch("isActive");

  const selectedCoupon = useMemo(
    () => coupons.find((c) => String(c._id) === String(couponId)),
    [coupons, couponId],
  );

  const refresh = async () => {
    const [linksRes, couponsRes] = await Promise.all([
      getCouponLinks(),
      getCouponsForSelect(),
    ]);

    const linksData = linksRes?.data?.data || linksRes?.data?.data?.data;
    const couponsData = couponsRes?.data?.data || couponsRes?.data?.data?.data;

    setLinks(Array.isArray(linksData) ? linksData : []);
    setCoupons(Array.isArray(couponsData) ? couponsData : []);
  };

  useEffect(() => {
    async function init() {
      try {
        const me = await getEmployee();
        const role = me?.data?.data?.role;
        const ok = role === "admin";
        setIsAdmin(ok);

        if (!ok) {
          setLoading(false);
          return;
        }

        await refresh();
      } catch (err) {
        toast.error(err?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // debounce product search
  useEffect(() => {
    let t;
    const q = productQuery?.trim();
    if (!q || q.length < 2) {
      setProductResults([]);
      return;
    }

    t = setTimeout(async () => {
      try {
        const res = await searchProductsForSelect(q, 8);
        const items = res?.data?.data || res?.data?.data?.data;
        setProductResults(Array.isArray(items) ? items : []);
      } catch {
        setProductResults([]);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [productQuery]);

  const onSelectProduct = (p) => {
    const id = p?._id || p?.id;
    setSelectedProduct(p);
    setProductQuery(p?.name || "");
    setProductResults([]);
    setValue("productId", id, { shouldValidate: true });
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed");
    }
  };

  const onSubmit = async (values) => {
    try {
      if (!values.productId) return toast.error("Select a product");
      if (!values.couponId) return toast.error("Select a coupon");

      const payload = {
        productId: values.productId,
        couponId: values.couponId,
        isActive: Boolean(values.isActive),
      };

      const res = await createCouponLink(payload);
      const created = res?.data?.data || res?.data?.data?.data;

      // backend returns token once (recommended)
      const token = created?.token;
      const shareLink = token
        ? `${API_BASE_URL}/api/v1/p/${token}`
        : created?.link;

      const directLink =
        token && selectedProduct?.slug
          ? `${window.location.origin}/products/${selectedProduct.slug}?promo=${token}`
          : null;

      setLastCreated({
        ...created,
        shareLink: shareLink || null,
        directLink,
      });

      toast.success("Promo link created");
      reset({ couponId: "", productId: "", isActive: true });
      setSelectedProduct(null);
      setProductQuery("");
      await refresh();
    } catch (err) {
      toast.error(err?.message || "Failed to create promo link");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCouponLink(id);
      toast.success("Link removed");
      await refresh();
    } catch (err) {
      toast.error(err?.message || "Failed to remove link");
    }
  };

  if (loading) return <Spinner />;

  if (!isAdmin) {
    return (
      <div className="m-auto max-w-6xl p-4 text-zinc-300">
        <h1 className="text-2xl font-semibold">Promo Links</h1>
        <p className="mt-2 text-zinc-400">
          This page is available for <span className="font-medium">admins</span>{" "}
          only.
        </p>
      </div>
    );
  }

  return (
    <div className="m-auto max-w-6xl p-4">
      <h1 className="text-2xl font-semibold text-zinc-200">Promo Links</h1>
      <p className="mt-1 text-zinc-400">
        Create a shareable link that auto-applies a coupon for a specific
        product.
      </p>

      {/* Create */}
      <div className="mt-6 rounded-lg border border-zinc-700/50 bg-zinc-900/40 p-4">
        <h2 className="text-lg font-semibold text-zinc-200">Create new link</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Product search */}
          <div className="relative">
            <label className="font-medium text-zinc-200">Product</label>
            <input
              className="input mt-2 w-full"
              placeholder="Type product name (min 2 letters)"
              value={productQuery}
              onChange={(e) => {
                setProductQuery(e.target.value);
                setSelectedProduct(null);
                setValue("productId", "");
              }}
            />
            <input
              type="hidden"
              {...register("productId", { required: true })}
            />
            {errors.productId && (
              <p className="mt-1 text-sm text-red-400">Select a product</p>
            )}

            {productResults.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-xl">
                {productResults.map((p) => (
                  <button
                    type="button"
                    key={p._id || p.id}
                    onClick={() => onSelectProduct(p)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-900"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="ml-3 shrink-0 text-xs text-zinc-500">
                      {p.slug}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedProduct && (
              <p className="mt-1 text-xs text-zinc-500">
                Selected:{" "}
                <span className="text-zinc-300">{selectedProduct.name}</span>
              </p>
            )}
          </div>

          {/* Coupon select */}
          <div>
            <label className="font-medium text-zinc-200">Coupon</label>
            <select
              {...register("couponId", { required: true })}
              className="input mt-2 w-full"
              defaultValue=""
            >
              <option value="" disabled>
                Select a coupon
              </option>
              {coupons.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} ({c.type} - {c.value})
                </option>
              ))}
            </select>

            {errors.couponId && (
              <p className="mt-1 text-sm text-red-400">Select a coupon</p>
            )}

            {selectedCoupon && (
              <p className="mt-1 text-xs text-zinc-500">
                Selected:{" "}
                <span className="text-zinc-300">{selectedCoupon.code}</span>
              </p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center gap-3 md:col-span-2">
            <input
              id="isActive"
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4"
              checked={Boolean(isActive)}
              onChange={(e) => setValue("isActive", e.target.checked)}
            />
            <label htmlFor="isActive" className="text-zinc-200">
              Active (can be redeemed)
            </label>
          </div>

          <div className="md:col-span-2">
            <Button variant="primary" type="submit">
              Create Promo Link
            </Button>
          </div>
        </form>

        {/* Share */}
        {lastCreated && (
          <div className="mt-5 rounded-lg border border-zinc-700/50 bg-zinc-950/40 p-3">
            <p className="text-sm font-semibold text-zinc-200">Link ready</p>

            <div className="mt-2 space-y-2 text-sm">
              {lastCreated.shareLink && (
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-zinc-400">Share link (recommended)</p>
                    <p className="truncate text-zinc-200">
                      {lastCreated.shareLink}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="edit"
                    onClick={() => copy(lastCreated.shareLink)}
                  >
                    Copy
                  </Button>
                </div>
              )}

              {lastCreated.directLink && (
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-zinc-400">Direct product link</p>
                    <p className="truncate text-zinc-200">
                      {lastCreated.directLink}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="edit"
                    onClick={() => copy(lastCreated.directLink)}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-200">Existing links</h2>

        {links.length === 0 ? (
          <p className="mt-2 text-zinc-400">No promo links yet.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3">
            {links.map((l) => {
              const id = l._id || l.id;
              const productName =
                l?.Product?.name ||
                l?.product?.name ||
                l?.productName ||
                l?.product;

              const couponCode =
                l?.Coupon?.code || l?.coupon?.code || l?.couponCode || "";

              const active = Boolean(l.isActive);
              const redeemed = Number(l.redeemedCount || 0);

              return (
                <div
                  key={id}
                  className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">Product</p>
                      <p className="text-zinc-200">{productName}</p>

                      <p className="mt-2 text-sm text-zinc-500">Coupon</p>
                      <p className="text-zinc-200">{couponCode || "-"}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                            active
                              ? "bg-green-600/15 text-green-400 ring-green-600/40"
                              : "bg-red-600/15 text-red-400 ring-red-600/40"
                          }`}
                        >
                          {active ? "Active" : "Inactive"}
                        </span>

                        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300 ring-1 ring-zinc-700">
                          Redeemed: {redeemed}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 md:flex-col md:items-end">
                      <Button
                        variant="close"
                        type="button"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">
                    Note: Backend stores only token hash for security. Copy the
                    link right after creation.
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
