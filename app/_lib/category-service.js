import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/categories`);

    return response.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getCategoryById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function createCategory(payload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/categories`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function updateCategorySubcategories(categoryId, subcategoryIds) {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/api/v1/categories/${categoryId}`,
      { subcategories: subcategoryIds },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating category subcategories:", error);
    throw new Error(
      error?.response?.data?.message ||
        "Failed to update category with subcategories",
    );
  }
}

export async function deleteCategory(categoryId) {
  try {
    await axios.delete(`${API_BASE_URL}/api/v1/categories/${categoryId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting category subcategories:", error);
    throw new Error(
      error?.response?.data?.message ||
        "Failed to delete category",
    );
  }
}
