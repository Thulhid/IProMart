import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SETTING_ID = process.env.NEXT_PUBLIC_SETTING_ID;

function handleError(error) {
  console.error("Hero slide error:", error);
  throw new Error(
    error.response?.data?.message || "Something went wrong. Please try again"
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
    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/setting/${SETTING_ID}`,
      payload,
      {
        withCredentials: true,
      }
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
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
}
