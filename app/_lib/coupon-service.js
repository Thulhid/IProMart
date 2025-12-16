import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function quoteCoupon(couponCode, includingShipping) {
  const res = await axios.post(
    `${API_BASE_URL}/api/v1/coupons/quote`,
    {
      isCart: true,
      includingShipping,
      couponCode,
    },
    { withCredentials: true },
  );
  return res.data;
}

export async function quoteItemCoupon(
  couponCode,
  includingShipping,
  itemId,
  quantity,
) {
  const res = await axios.post(
    `${API_BASE_URL}/api/v1/coupons/quote`,
    {
      isCart: false,
      includingShipping,
      couponCode,
      itemObj: {
        item: {
          _id: itemId,
        },
        quantity,
      },
    },
    { withCredentials: true },
  );
  return res.data;
}

export async function getCoupons() {
  try {
    return await axios.get(`${API_BASE_URL}/api/v1/coupons`, {
      withCredentials: true,
    });
  } catch (err) {
    apiError(err);
  }
}

export async function updateCoupon(id, payload) {
  try {
    return await axios.patch(`${API_BASE_URL}/api/v1/coupons/${id}`, payload, {
      withCredentials: true,
    });
  } catch (err) {
    apiError(err);
  }
}

export async function createCoupon(payload) {
  try {
    return await axios.post(`${API_BASE_URL}/api/v1/coupons`, payload, {
      withCredentials: true,
    });
  } catch (err) {
    apiError(err);
  }
}

export async function deleteCoupon(id) {
  try {
    return await axios.delete(`${API_BASE_URL}/api/v1/coupons/${id}`, {
      withCredentials: true,
    });
  } catch (err) {
    apiError(err);
  }
}
