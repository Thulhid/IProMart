import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEmployee() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/employees/me`, {
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

export async function getEmployees() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/employees`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function createEmployee(payload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/employees`,
      payload,
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
export async function deleteEmployee(id) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/customers/id/${id}`,
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

export async function updateEmployeeById(id, payload) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/employees/id/${id}`,
      payload,
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

export async function getEmployeeById(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/employees/id/${id}`,
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

export async function updateEmployee(firstName, lastName, photoFile) {
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  if (photoFile) formData.append("photo", photoFile);
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/employees/me/update-me`,
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
