import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createPay(
  isCart,
  customer,
  includingShipping,
  itemObj,
  couponCode,
  redeemPoints,
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/payhere/session`,
      {
        isCart,
        customer,
        includingShipping,
        itemObj,
        couponCode,
        redeemPoints,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payhere:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function cancelPay(orderId) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/payhere/cancel`,
      { orderId },
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    console.error("cancelPay error:", error);
    return null;
  }
}

export async function createRepairPay(jobId, totalAmount) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/payhere/repair/session`,
      { jobId, totalAmount },
      { withCredentials: true },
    );
    return data; // { payhereParams }
  } catch (error) {
    console.error("Error fetching payhere (repair):", error);
    throw new Error(error.response?.data?.message || "Failed to init payment");
  }
}
