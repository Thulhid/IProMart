"use client";
//import { useCart } from "@/app/_hooks/useCart";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  

  return (
    <CartContext.Provider value={{}}>{children}</CartContext.Provider>
  );
}
