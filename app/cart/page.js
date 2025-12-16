"use client";

import { Suspense, useEffect, useState } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import {
  handleRemoveGuestProduct,
  handleSaveGustProduct,
  formatCurrency,
} from "@/app/_utils/helper";
import BackButton from "@/app/_components/BackButton";
import CartProductBox from "@/app/_components/CartProductBox";
import {
  createOrUpdateCart,
  getCustomerCart,
  removeFromCart,
} from "@/app/_lib/cart-service";
import { getCustomer } from "@/app/_lib/customer-service"; // ✅ used to detect login
import Spinner from "@/app/_components/Spinner";
import { HiOutlineInformationCircle, HiShoppingBag } from "react-icons/hi2";
import toast from "react-hot-toast";
import PayHereButton from "@/app/_components/PayHereButton";
import { getSetting } from "@/app/_lib/setting-service";
import { quoteCoupon } from "@/app/_lib/coupon-service";

export default function Page() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [includingShipping, setIncludingShipping] = useState(true);

  // ✅ Coupon states (NEW)
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  function clearCouponSilently() {
    if (appliedCoupon || discountAmount > 0) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  }

  async function handleApplyCoupon() {
    if (!isLoggedIn) return toast.error("Please login to use coupon codes");

    const code = couponInput.trim().toUpperCase();
    if (!code) return toast.error("Enter a coupon code");

    const toastId = toast.loading("Applying coupon...");
    setIsApplyingCoupon(true);

    try {
      const data = await quoteCoupon(code, includingShipping);
      if (!data?.coupon?.valid) {
        setAppliedCoupon(null);
        setDiscountAmount(0);

        const reason = data?.coupon?.reason;
        if (reason === "MIN_NOT_MET") {
          toast.error("Cart total is not enough for this coupon", {
            id: toastId,
          });
          return;
        }
        if (reason === "NOT_FOUND") {
          toast.error("Invalid coupon code", { id: toastId });
          return;
        }

        toast.error("Coupon not applicable", { id: toastId });
        return;
      }
      setAppliedCoupon(data.coupon.code);
      setDiscountAmount(Number(data.discountAmount || 0));
      toast.success(`Coupon applied: ${data.coupon.code}`, { id: toastId });
    } catch (err) {
      toast.error(err.message || "Failed to apply coupon", { id: toastId });
    } finally {
      setIsApplyingCoupon(false);
    }
  }
  // ✅ 1. On load: check login and fetch correct cart
  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const resCustomer = await getCustomer(); // returns customer data or throws
        if (!resCustomer) throw new Error("Customer not logged in");
        setIsLoggedIn(true);
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        for (const product of guestCart) {
          await createOrUpdateCart(product._id, product.quantity);
        }
        localStorage.removeItem("guestCart");
        const cartRes = await getCustomerCart();
        const cartItems = cartRes.cart?.cartItems || [];
        const normalized = cartItems.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          finalPrice: item.product.finalPrice,
          priceDiscount: item.product.priceDiscount || 0,
          imageCover: item.product.imageCover,
          slug: item.product.slug,
          category: item.product.category,
          quantity: item.quantity,
        }));
        setCart(normalized);
      } catch (err) {
        //  localStorage.setItem("guestCart", JSON.stringify(guestCart));
        const guest = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCart(guest);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const res = await getSetting();
        setShippingFee(res.data.data.shippingFee || 0);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load shipping settings");
      }
    })();
  }, []);

  // ✅ 2. Handle quantity changes
  async function handleQuantityChange(newQuantity, product) {
    // NEW: coupon cleared when cart changes
    clearCouponSilently();

    if (isLoggedIn) {
      const toastId = toast.loading("Wait a sec...");
      try {
        await createOrUpdateCart(product._id, newQuantity);
        //
        handleSaveGustProduct(newQuantity, product);

        setCart((prev) =>
          prev.map((p) =>
            p._id === product._id ? { ...p, quantity: newQuantity } : p,
          ),
        );
        toast.success("added change to the total", { id: toastId });
      } catch (err) {
        toast.error(err.message, { id: toastId });
      }
    } else {
      const updatedCart = handleSaveGustProduct(newQuantity, product);
      setCart(updatedCart);
    }
  }

  // ✅ 3. Handle removal
  async function handleRemove(productId) {
    // NEW: coupon cleared when cart changes
    clearCouponSilently();

    if (isLoggedIn) {
      const toastId = toast.loading("Wait a sec...");

      // Optional: implement DELETE call for logged-in user
      try {
        await removeFromCart(productId);
        handleRemoveGuestProduct(productId);
        toast.success("Removed", { id: toastId });
      } catch (err) {
        toast.error(err.message, { id: toastId });
      }
      setCart((prev) => prev.filter((p) => p._id !== productId));
    } else {
      const updatedCart = handleRemoveGuestProduct(productId);
      setCart(updatedCart);
    }
  }

  // ✅ 4. Totals
  const itemsTotal = cart.reduce(
    (sum, p) => sum + p.finalPrice * p.quantity,
    0,
  );

  const baseTotal = includingShipping ? itemsTotal + shippingFee : itemsTotal;

  // NEW: apply discount (display-side)
  const total = Math.max(0, baseTotal - (discountAmount || 0));

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 md:px-10">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-2xl font-semibold text-zinc-300 sm:text-3xl">
          Your cart
        </h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : cart.length === 0 ? (
        <p className="py-20 text-center text-base text-zinc-400 sm:text-lg">
          <HiShoppingBag size={22} className="inline-block" /> Your cart is
          empty. Let’s add something!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <Suspense fallback={<Spinner />}>
            <CartProductBox
              cart={cart}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          </Suspense>

          <div className="flex h-fit flex-col gap-4 rounded-xl bg-zinc-900 p-4 text-zinc-300 shadow-md sm:p-6">
            <h2 className="mb-2 text-xl font-bold tracking-wider sm:text-2xl">
              Summary
            </h2>

            <div className="flex justify-between">
              <span>Total Items:</span>
              <span>{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(itemsTotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includingShipping}
                  onChange={() => {
                    // NEW: coupon cleared when shipping option changes
                    clearCouponSilently();
                    setIncludingShipping((prev) => !prev);
                  }}
                  className="h-4 w-4 accent-blue-600"
                />
                Include Shipping Fee ({formatCurrency(shippingFee)})
              </label>
            </div>

            <div className="my-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-sm font-semibold">Coupon Code</label>

              <div className="flex w-full gap-2">
                <input
                  type="text"
                  className="input w-full"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold hover:bg-zinc-700 disabled:opacity-60"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>

            {appliedCoupon && discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400">Applied: {appliedCoupon}</span>
                <button
                  type="button"
                  className="text-zinc-300 underline"
                  onClick={() => {
                    setAppliedCoupon(null);
                    setDiscountAmount(0);
                    setCouponInput("");
                    toast("Coupon removed");
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            {!includingShipping && (
              <p className="flex items-start gap-2 text-sm text-yellow-400">
                <HiOutlineInformationCircle className="mt-0.5" size={22} />
                Shipping fee (Rs.{shippingFee}) will be collected when your
                order is delivered
              </p>
            )}

            {/* NEW: discount line */}
            {discountAmount > 0 && (
              <div className="flex justify-between text-base font-medium">
                <span>Coupon Discount:</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="my-5 flex justify-between text-base font-medium sm:text-lg">
              <span>Total Price:</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <PayHereButton
              total={total}
              isCart={true}
              isLoading={isLoading}
              includingShipping={includingShipping}
              couponCode={appliedCoupon} // ✅ send to backend at checkout (your PayHereButton must forward it)
              variant="buy"
            >
              Checkout
            </PayHereButton>
          </div>
        </div>
      )}
    </div>
  );
}
