import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SETTING_ID = process.env.NEXT_PUBLIC_SETTING_ID;

function handleError(error) {
  console.error("Hero slide error:", error);
  throw new Error(
    error.response?.data?.message || "Something went wrong. Please try again",
  );
}

// 🔴 Create hero slide (multipart/form-data)
export async function createSetting(payload) {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/v1/setting`, payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateSetting(payload) {
  try {
    const apiPayload = {
      shippingFee: payload.shippingFee,
      pointsEnabled: payload.pointsEnabled,
      pointsValueRs: payload.pointValueRs,
      pointsRedeemCapPercent: payload.maxRedeemPercent,
      pointsMinRedeemPoints: payload.minRedeemPoints,
      pointsAllowWithCoupon: payload.allowPointsWithCoupon,
    };

    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/setting/${SETTING_ID}`,
      apiPayload,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getSetting() {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/v1/setting/${SETTING_ID}`,
      {
        withCredentials: true,
      },
    );

    const doc = res.data?.data?.data ?? {};
    const mapped = {
      ...doc,
      pointValueRs: doc?.pointsValueRs ?? 1,
      maxRedeemPercent: doc?.pointsRedeemCapPercent ?? 20,
      minRedeemPoints: doc?.pointsMinRedeemPoints ?? 0,
      allowPointsWithCoupon: doc?.pointsAllowWithCoupon ?? false,
    };

    const resData = res.data ?? {};
    const resDataData = resData.data ?? {};

    return {
      ...resData,
      data: { ...resDataData, data: mapped },
    };
  } catch (error) {
    handleError(error);
  }
}
