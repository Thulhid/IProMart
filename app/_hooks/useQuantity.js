import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useQuantity(product, onQuantityChange) {
  const [currentQuantity, setCurrentQuantity] = useState(product?.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setCurrentQuantity(product?.quantity || 1);
  }, [product?._id, product?.quantity]);

  async function applyQuantity(newQuantity) {
    if (!onQuantityChange) {
      setCurrentQuantity(newQuantity);
      return;
    }

    try {
      setIsUpdating(true);
      await Promise.resolve(onQuantityChange(newQuantity, product));
      setCurrentQuantity(newQuantity);
    } catch (err) {
      toast.error(err?.message || "Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  }

  function handleDecCurrentQuantity() {
    if (isUpdating) return;
    const newQuantity = Math.max(1, currentQuantity - 1);
    if (newQuantity === currentQuantity) return;
    applyQuantity(newQuantity);
  }

  function handleIncCurrentQuantity() {
    if (isUpdating) return;

    const newQuantity = currentQuantity + 1;
    const stock = Number(product?.availability);

    if (Number.isFinite(stock) && stock >= 0 && newQuantity > stock) {
      return toast.error(`Only ${stock} product(s) in stock`);
    }

    applyQuantity(newQuantity);
  }

  return {
    currentQuantity,
    isUpdating,
    handleDecCurrentQuantity,
    handleIncCurrentQuantity,
  };
}
