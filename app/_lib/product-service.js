import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PAGE_SIZE = process.env.NEXT_PUBLIC_PAGE_SIZE;

export async function getProducts(page) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products?page=${page}&limit=${PAGE_SIZE}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function filterProducts(
  name,
  category,
  page,
  subcategory,
  isUsed,
  sort,
) {
  const params = new URLSearchParams();

  if (typeof isUsed === "boolean") params.set("isUsed", isUsed);
  if (sort) params.set("sort", sort);
  if (name) params.set("name", name);
  if (category) params.set("category", category);
  if (subcategory) params.set("subcategory", subcategory);
  params.set("page", page);
  params.set("limit", PAGE_SIZE);

  const url = `${API_BASE_URL}/api/v1/products?${params.toString()}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getProductBySlug(slug) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products/slug/${slug}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getProductById(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/products/id/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function updateProductById(id, payload) {
  console.log(payload);
  for (let [key, val] of payload.entries()) {
    console.log(`${key}:`, val);
  }
  console.log(payload);
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/products/id/${id}`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function createProduct(payload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/products`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function deleteProduct(id) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/products/id/${id}`,
      {
        withCredentials: true,
      },
    );
    // return response;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}
