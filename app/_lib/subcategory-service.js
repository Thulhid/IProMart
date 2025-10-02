import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createSubcategory(payload) {
  console.log(payload);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/subcategories`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating sub category:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function deleteSubcategory(subcategoryId) {
  try {
    await axios.delete(
      `${API_BASE_URL}/api/v1/subcategories/${subcategoryId}`,
      {
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to delete subcategory",
    );
  }
}
