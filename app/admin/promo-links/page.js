"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { HiOutlineChevronLeft } from "react-icons/hi2";

import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import Empty from "@/app/_components/Empty";
import PromoLinkRow from "@/app/_components/PromoLinkRow";
import Spinner from "@/app/_components/Spinner";
import Table from "@/app/_components/Table";
import { getEmployee } from "@/app/_lib/employee-service";
import {
  createCouponLink,
  deleteCouponLink,
  getCouponLinks,
  getCouponsForSelect,
  searchProductsForSelect,
  updateCouponLink,
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
  const [rangePreset, setRangePreset] = useState("all"); // all | 7 | 30 | custom
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [applyTick, setApplyTick] = useState(0); // trigger custom apply

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
      maxRedemptions: "",
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

      if (values.maxRedemptions !== "" && values.maxRedemptions != null) {
        const max = Number(values.maxRedemptions);
        if (!Number.isFinite(max) || max < 1 || !Number.isInteger(max)) {
          return toast.error("Max redemptions must be a whole number (>= 1)");
        }
        payload.maxRedemptions = max;
      }

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
      reset({
        couponId: "",
        productId: "",
        isActive: true,
        maxRedemptions: "",
      });
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

  const handleUpdateLink = async (
    id,
    patch,
    successMessage = "Link updated",
  ) => {
    const toastId = toast.loading("Updating...");
    try {
      await updateCouponLink(id, patch);
      toast.success(successMessage, { id: toastId });
      await refresh();
      return true;
    } catch (err) {
      toast.error(err?.message || "Failed to update link", { id: toastId });
      return false;
    }
  };

  const handleToggleActive = async (id, nextActive) => {
    await handleUpdateLink(
      id,
      { isActive: Boolean(nextActive) },
      `Link ${nextActive ? "activated" : "deactivated"}`,
    );
  };

  const filteredLinks = useMemo(() => {
    if (!Array.isArray(links) || links.length === 0) return [];
    if (rangePreset === "all") return links;

    const now = new Date();
    let start;

    if (rangePreset === "7") {
      start = new Date(now);
      start.setDate(now.getDate() - 6);
    } else if (rangePreset === "30") {
      start = new Date(now);
      start.setDate(now.getDate() - 29);
    } else if (rangePreset === "custom" && customFrom && customTo) {
      start = new Date(customFrom);
      const end = new Date(customTo);
      return links.filter((l) => {
        const created = new Date(
          l.createdAt || l.updatedAt || l.date || l.created_at,
        );
        return (
          !Number.isNaN(created) &&
          created >= start &&
          created <=
            new Date(
              end.getFullYear(),
              end.getMonth(),
              end.getDate(),
              23,
              59,
              59,
            )
        );
      });
    }

    return links.filter((l) => {
      const created = new Date(
        l.createdAt || l.updatedAt || l.date || l.created_at,
      );
      return (
        !Number.isNaN(created) &&
        created >=
          new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate(),
            0,
            0,
            0,
          )
      );
    });
  }, [links, rangePreset, customFrom, customTo, applyTick]);

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
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <div className="flex flex-1 items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-zinc-300">Promo Links</h1>
          <div className="hidden items-center gap-2 text-xs text-zinc-300 sm:flex">
            <span className="rounded-full bg-blue-700 px-3 py-1 text-blue-50">
              Total: {filteredLinks.length}
            </span>
            <span className="rounded-full bg-green-700 px-3 py-1 text-green-50">
              Active: {filteredLinks.filter((l) => l.isActive).length}
            </span>
          </div>
        </div>
      </div>

      {/* Create */}
      <div className="mx-auto mt-6 rounded-lg border border-zinc-700/50 bg-zinc-900/40 p-4 2xl:max-w-6xl">
        <h2 className="text-lg font-semibold text-zinc-200">Create new link</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid grid-cols-1 gap-15 md:grid-cols-2"
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
              className="mt-2 w-full cursor-pointer rounded-md bg-zinc-800 px-3 py-2 text-zinc-200"
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

          {/* Max redemptions */}
          <div>
            <label className="font-medium text-zinc-200">
              Max redemptions{" "}
              <span className="text-xs font-normal text-zinc-500">
                (optional)
              </span>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              placeholder="Leave empty for unlimited"
              className="input mt-2 w-full"
              {...register("maxRedemptions")}
            />
            <p className="mt-1 text-xs text-zinc-500">
              When the redeemed count reaches this number, the link is
              automatically deactivated.
            </p>
          </div>

          {/* Active + Create */}
          <div className="flex flex-col gap-3 md:justify-end">
            <div className="flex items-center gap-3">
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

            <div>
              <Button variant="primary" type="submit">
                Create Promo Link
              </Button>
            </div>
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
      <div className="mx-auto mt-8 2xl:max-w-6xl">
        <h2 className="text-lg font-semibold text-zinc-200">Existing links</h2>

        {links.length === 0 ? (
          <Empty resourceName="promo link" />
        ) : (
          <div className="mt-3">
            <Table>
              <Table.Header styles="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] items-center gap-x-4 text-xs sm:text-sm md:text-base font-medium text-zinc-300 uppercase p-2 md:h-10 ">
                <div className="min-w-0 truncate">Product</div>
                <div className="min-w-0 truncate">Coupon</div>
                <div className="min-w-0 truncate">Status</div>
                <div className="min-w-0 truncate">Redeemed / Max</div>
                <div aria-hidden="true" />
              </Table.Header>
              <Table.Body
                data={links}
                render={(link) => (
                  <PromoLinkRow
                    key={link._id || link.id}
                    link={link}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                    onUpdate={handleUpdateLink}
                    onRefresh={refresh}
                  />
                )}
              />
            </Table>
            <p className="mt-3 text-xs text-zinc-500">
              Note: Backend stores only token hash for security. Copy the link
              right after creation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
