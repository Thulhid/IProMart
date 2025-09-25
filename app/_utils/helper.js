import { formatDistance, parseISO } from "date-fns";

export const formatCurrency = (value) =>
  `Rs. ${new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

export function uiCategoryFormat(category) {
  //   console.log(category);
  return category
    ?.split("-") // Split by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(" ");
}
export function handleSaveGustProduct(newQuantity, product) {
  if (product) {
    const existingCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    //Note: Add or update product
    const updatedCart = [...existingCart];
    const index = updatedCart.findIndex((p) => p._id === product._id);
    if (index > -1) {
      //Note: update quantity
      updatedCart[index].quantity = newQuantity;
    } else {
      //Note: add new product
      updatedCart.push({ ...product, quantity: newQuantity });
    }

    localStorage.setItem("guestCart", JSON.stringify(updatedCart));

    return updatedCart;
  }
}

export function handleRemoveGuestProduct(productId) {
  if (!productId) return;

  const existingCart = JSON.parse(localStorage.getItem("guestCart")) || [];

  const updatedCart = existingCart.filter(
    (product) => product._id !== productId
  );

  localStorage.setItem("guestCart", JSON.stringify(updatedCart));

  return updatedCart;
}

export function isProductInGuestCart(productId) {
  if (!productId) return false;

  const existingCart = JSON.parse(localStorage.getItem("guestCart")) || [];

  return existingCart.some((product) => product._id === productId);
}
export function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};
