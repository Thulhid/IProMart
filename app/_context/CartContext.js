"use client";
//import { useCart } from "@/app/_hooks/useCart";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  // const [guestCart, setGuestCart] = useState([]);
  // console.log(guestCart);

  // // Load cart from localStorage initially
  // useEffect(() => {
  //   const stored = localStorage.getItem("guestCart");
  //   if (stored) {
  //     setGuestCart(JSON.parse(stored));
  //   }
  // }, []);

  // const {
  //   handleDecCurrentQuantity,
  //   handleIncCurrentQuantity,
  //   setSaveCartProduct,
  // } = useCart();

  return (
    // <CartContext.Provider
    //   value={{
    //     currentQuantity,
    //     handleDecCurrentQuantity,
    //     handleIncCurrentQuantity,
    //     setSaveCartProduct,
    //     saveCartProduct,
    //   }}
    // >
    //   {children}
    // </CartContext.Provider>
    <CartContext.Provider value={{}}>{children}</CartContext.Provider>
  );
}
