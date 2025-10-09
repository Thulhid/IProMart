import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PAGE_SIZE = process.env.NEXT_PUBLIC_PAGE_SIZE;

export async function getCustomer() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/customers/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // User is not logged in
      return null;
    }

    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function updateCustomer(firstName, lastName, photoFile) {
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  if (photoFile) formData.append("photo", photoFile);
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/customers/me/update-me`,
      formData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getShippingAddresses() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/customers/me/shipping-addresses`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching customer details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}
export async function createShippingAddresses(payload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/customers/me/shipping-addresses`,

      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching customer details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function updateShippingAddresses(addressId, payload) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/customers/me/shipping-addresses/${addressId}`,

      payload,

      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching customer details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}
export async function deleteShippingAddresses(addressId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/customers/me/shipping-addresses/${addressId}`,

      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching customer details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getCustomers(page) {
  //console.log(page);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/customers?page=${page}&limit=${PAGE_SIZE}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function updateCustomerById(id, payload) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/customers/id/${id}`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}
export async function getCustomerById(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/customers/id/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch customer",
    );
  }
}

export async function updateShippingAddressesById(id, addressId, payload) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/customers/id/${id}/addressId/${addressId}`,

      payload,

      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching customer details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getShippingAddressesById(id, addressId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/customers/id/${id}/addressId/${addressId}`,

      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    console.error("Error fetching customer details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function deleteCustomer(id) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/customers/id/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}
