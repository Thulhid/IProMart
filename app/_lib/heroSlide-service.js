import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function handleError(error) {
  console.error("Hero slide error:", error);
  throw new Error(
    error.response?.data?.message || "Something went wrong. Please try again"
  );
}

// 🔴 Create hero slide (multipart/form-data)
export async function createHeroSlide(payload) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/v1/hero-slides`,
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

// 🟠 Get all hero slides
export async function getHeroSlides() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/hero-slides`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

// 🟡 Update hero slide (can use formData for image or JSON for other fields)
export async function updateHeroSlide(id, payload) {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/hero-slides/id/${id}`,
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

// ⚫️ Delete hero slide
export async function deleteHeroSlide(id) {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/api/v1/hero-slides/id/${id}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
}
