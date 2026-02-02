import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getErrMsg = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again";

export async function getCouponLinks() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/coupon-links`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching coupon links:", error);
    throw new Error(getErrMsg(error));
  }
}

export async function createCouponLink(payload) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/v1/coupon-links`,
      payload,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error creating coupon link:", error);
    throw new Error(getErrMsg(error));
  }
}

export async function deleteCouponLink(id) {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/api/v1/coupon-links/${id}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting coupon link:", error);
    throw new Error(getErrMsg(error));
  }
}

// --- helpers for admin UI ---

export async function getCouponsForSelect() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/coupons`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw new Error(getErrMsg(error));
  }
}

export async function searchProductsForSelect(name, limit = 8) {
  try {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    params.set("page", "1");
    params.set("limit", String(limit));

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/products?${params.toString()}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error(getErrMsg(error));
  }
}
