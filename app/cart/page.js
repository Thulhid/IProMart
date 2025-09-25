"use client";

import { Suspense, useEffect, useState } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Button from "@/app/_components/Button";
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

export default function Page() {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [includingShipping, setIncludingShipping] = useState(true);

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
  const total = includingShipping ? itemsTotal + shippingFee : itemsTotal;
  //const total = cart.reduce((sum, p) => sum + p.finalPrice * p.quantity, 0);

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
                  onChange={() => setIncludingShipping((prev) => !prev)}
                  className="h-4 w-4 accent-blue-600"
                />
                Include Shipping Fee ({formatCurrency(shippingFee)})
              </label>
            </div>
            {!includingShipping && (
              <p className="flex items-start gap-2 text-sm text-yellow-400">
                <HiOutlineInformationCircle className="mt-0.5" size={22} />
                Shipping fee (Rs.{shippingFee}) will be collected when your
                order is delivered
              </p>
            )}
            <div className="my-5 flex justify-between text-base font-medium sm:text-lg">
              <span>Total Price:</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <PayHereButton
              total={total}
              isCart={true}
              isLoading={isLoading}
              includingShipping={includingShipping} // ✅ new prop
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

// "use client";

// import { useEffect, useState } from "react";
// import { HiOutlineChevronLeft } from "react-icons/hi";
// import Button from "@/app/_components/Button";
// import {
//   formatCurrency,
//   handleRemoveGuestProduct,
//   handleSaveGustProduct,
// } from "@/app/_utils/helper";
// import CartProductBox from "@/app/_components/CartProductBox";
// import BackButton from "@/app/_components/BackButton";
// import { createOrUpdateCart } from "@/app/_lib/cart-service";

// export default function Page() {
//   const [cart, setCart] = useState([]);
//   useEffect(function () {
//     setCart(JSON.parse(localStorage.getItem("guestCart")));
//   }, []);

//   async function handleQuantityChange(newQuantity, product) {
//     try {
//       const resCustomerCart = await createOrUpdateCart(
//         product._id,
//         newQuantity
//       );
//     } catch (err) {
//       console.log(err.status);
//     }
//     let updatedCart;
//     cart.forEach((p) => {
//       if (product._id === p._id)
//         updatedCart = handleSaveGustProduct(newQuantity, p);
//     });
//     setCart(updatedCart);
//   }
//   function handleRemove(productId) {
//     const updatedCart = handleRemoveGuestProduct(productId);
//     setCart(updatedCart);
//   }

//   const total = cart?.reduce(
//     (sum, product) =>
//       sum + (product.price - (product.priceDiscount || 0)) * product.quantity,
//     0
//   );

//   return (
//     <div className="px-4 sm:px-6 md:px-10 py-6 max-w-screen-2xl mx-auto">
//       <div className="flex items-center gap-4 mb-6">
//         <BackButton>
//           <HiOutlineChevronLeft
//             className="text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
//             size={28}
//             strokeWidth={3}
//           />
//         </BackButton>
//         <h1 className="text-2xl sm:text-3xl text-zinc-300 font-semibold">
//           Your cart
//         </h1>
//       </div>

//       {cart?.length === 0 ? (
//         <div className="text-zinc-400 text-base sm:text-lg text-center py-20">
//           🛒 Your cart is empty. Let’s add something!
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
//           <CartProductBox
//             cart={cart}
//             onQuantityChange={handleQuantityChange}
//             onRemove={handleRemove}
//           />
//           <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-md flex flex-col gap-4 text-zinc-300 h-fit">
//             <h2 className="text-xl sm:text-2xl font-bold mb-2 tracking-wider">
//               Summary
//             </h2>
//             <div className="flex justify-between">
//               <span>Total Items:</span>
//               <span>{cart?.reduce((acc, i) => acc + i.quantity, 0) || 0}</span>
//             </div>
//             <div className="flex justify-between font-medium text-base sm:text-lg">
//               <span>Total Price:</span>
//               <span>{formatCurrency(total || 0)}</span>
//             </div>
//             <Button variant="buy" className="mt-4 w-full" disabled={!total}>
//               Checkout
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const [cart, setCart] = useState([
//   {
//     name: "RGB Wireless Mouse",
//     _id: 1234,
//     price: 4200,
//     description: "Precision sensor with customizable lighting",
//     category: "mice",
//     priceDiscount: 300,
//     imageCover:
//       "https://res.cloudinary.com/dgmayiuly/image/upload/v1749654569/neurotech/products/product_cover_images/d9ems3oah75dbdnay9y7.webp",
//     images: [
//       "https://res.cloudinary.com/dgmayiuly/image/upload/v1749654569/neurotech/products/product_cover_images/sample1.webp",
//       "https://res.cloudinary.com/dgmayiuly/image/upload/v1749654569/neurotech/products/product_cover_images/sample2.webp",
//       "https://res.cloudinary.com/dgmayiuly/image/upload/v1749654569/neurotech/products/product_cover_images/sample2.webp",
//       "https://res.cloudinary.com/dgmayiuly/image/upload/v1749654569/neurotech/products/product_cover_images/sample2.webp",
//     ],
//     warranty: 12,
//     features: ["Ergonomic Design", "Rechargeable Battery", "Eco-friendly"],
//     availability: 0,
//   },
// ]);
//  console.log(cart);
//const { handleSaveProduct, saveCartProduct } = useCart();
// const { guestCart } = useContext(CartContext);

// useEffect(() => {
//   const stored = localStorage.getItem("guestCart");
//   if (stored) {
//     setGuestCart(JSON.parse(stored));
//   }
// }, []);
//  const { saveCartProduct: guestCart } = useContext(CartContext);
//  const [guestCart, setCartProduct] = useState();

// useEffect(() => {
//   const stored = localStorage.getItem("guestCart");
//   if (stored) {
//     setCart(JSON.parse(stored));
//   }
// }, []);
// const total = cart?.reduce(
//   (sum, product) =>
//     sum + (product.price - (product.priceDiscount || 0)) * product.quantity,
//   0
// );

// function handleQuantityChange(productId, newQty) {
//   const updatedCart = cart.map((product) =>
//     product._id === productId ? { ...product, quantity: newQty } : product
//   );

//   setCart(updatedCart);
//   localStorage.setItem("guestCart", JSON.stringify(updatedCart));
// }
