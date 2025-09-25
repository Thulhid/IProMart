import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PAGE_SIZE = process.env.NEXT_PUBLIC_PAGE_SIZE;

function handleError(error) {
  console.error("Order error:", error);
  throw new Error(
    error.response?.data?.message || "Something went wrong. Please try again"
  );
}

export async function getMyOrders() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/orders/me`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getMyOrderById(id) {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/orders/me/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getOrders() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/orders`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
}
export async function getOrder(id) {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/orders/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function filterOrders(orderId, page, orderStatus, sort) {
  const params = new URLSearchParams();

  if (sort) params.set("sort", sort);
  if (orderId) params.set("orderId", orderId);
  if (orderStatus && orderStatus !== "All")
    params.set("orderStatus", orderStatus);
  params.set("page", page);
  params.set("limit", PAGE_SIZE);
  const url = `${API_BASE_URL}/api/v1/orders?${params.toString()}`;

  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteOrder(id) {
  try {
    await axios.delete(`${API_BASE_URL}/api/v1/orders/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    handleError(error);
  }
}

export async function updateOrderStatus(id, orderStatus) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/orders/${id}/status`,
      {
        orderStatus,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
}
