import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getNiceError(err, fallback = "Something went wrong") {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error?.message ||
    err?.message ||
    fallback
  );
}

export async function createOrUpdateCart(productId, quantity, mode = "replace") {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/v1/carts/my-cart`,
      { productId, quantity, mode },
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    throw new Error(getNiceError(err, "Failed to update cart"));
  }
}

export async function getCustomerCart() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/carts/my-cart`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw new Error(getNiceError(err, "Failed to load cart"));
  }
}

export async function removeFromCart(productId) {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/api/v1/carts/my-cart/${productId}`,
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    throw new Error(getNiceError(err, "Failed to remove item"));
  }
}
