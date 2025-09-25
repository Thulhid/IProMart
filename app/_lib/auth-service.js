import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function signupCustomer(payload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/customers/signup`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function verifyEmail(email, code) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/customers/verify-email`,
      {
        email,
        code,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function resendEmailVerificationCode(email) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/customers/verify-email-resend`,
      {
        email,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}
export async function forgotPassword(email) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/customers/forgot-password`,
      {
        email,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}
export async function resetPassword(token, password, passwordConfirm) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/customers/reset-password/${token}`,
      {
        password,
        passwordConfirm,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function customerLogin(email, password) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/customers/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function employeeLogin(email, password) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/employees/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function updateCustomerPassword(
  passwordCurrent,
  password,
  passwordConfirm
) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/customers/me/update-my-password`,
      {
        passwordCurrent,
        password,
        passwordConfirm,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function updateEmployeePassword(
  passwordCurrent,
  password,
  passwordConfirm
) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/employees/me/update-my-password`,
      {
        passwordCurrent,
        password,
        passwordConfirm,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function customerLogout() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/customers/logout`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}

export async function employeeLogout() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/employees/logout`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again"
    );
  }
}
