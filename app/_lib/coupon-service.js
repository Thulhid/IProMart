import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function quoteCoupon(couponCode) {
  const res = await axios.post(
    `${API}/api/v1/coupons/quote`,
    {
      isCart: true,
      includingShipping: true,
      couponCode,
    },
    { withCredentials: true },
  );
  return res.data;
}
