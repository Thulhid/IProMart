import { useState } from "react";
import toast from "react-hot-toast";

export function useQuantity(product, onQuantityChange) {
  const [currentQuantity, setCurrentQuantity] = useState(
    product?.quantity || 1
  );

  function handleDecCurrentQuantity() {
    if (currentQuantity <= 1) {
      setCurrentQuantity(1);
      return;
    }

    const newQuantity = currentQuantity - 1;
    setCurrentQuantity(newQuantity);
    onQuantityChange?.(newQuantity, product);
  }

  function handleIncCurrentQuantity() {
    const newQuantity = currentQuantity + 1;
    if (product.availability < newQuantity)
      return toast.error(`Only ${product.availability} product(s) in stock`);

    setCurrentQuantity(newQuantity);
    onQuantityChange?.(newQuantity, product);
  }

  return {
    currentQuantity,
    handleDecCurrentQuantity,
    handleIncCurrentQuantity,
  };
}
