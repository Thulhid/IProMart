// useCartItem.js
import { useState, useEffect } from "react";

export function useCartItem(product) {
  const [quantity, setQuantity] = useState(product.quantity || 1);

  useEffect(() => {
    // initialize quantity from localStorage if needed
    const stored = JSON.parse(localStorage.getItem("guestCart")) || [];
    const match = stored.find((p) => p._id === product._id);
    if (match) setQuantity(match.quantity);
  }, [product._id]);

  const saveToCart = (newQty) => {
    const existingCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    const updatedCart = [...existingCart];
    const index = updatedCart.findIndex((p) => p._id === product._id);

    if (index > -1) {
      updatedCart[index].quantity = newQty;
    } else {
      updatedCart.push({ ...product, quantity: newQty });
    }

    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
  };

  const increase = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    saveToCart(newQty);
  };

  const decrease = () => {
    const newQty = Math.max(1, quantity - 1);
    setQuantity(newQty);
    saveToCart(newQty);
  };

  return { quantity, increase, decrease };
}
