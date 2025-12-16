import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function quoteCoupon(couponCode, includingShipping) {
  const res = await axios.post(
    `${API}/api/v1/coupons/quote`,
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
    `${API}/api/v1/coupons/quote`,
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
