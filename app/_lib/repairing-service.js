import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PAGE_SIZE = process.env.NEXT_PUBLIC_PAGE_SIZE;

export async function createRepairRequests(payload) {
  const formData = new FormData();
  formData.append("brand", payload.brand);
  formData.append("model", payload.model);
  formData.append("device", payload.device);
  formData.append("problemDescription", payload.problemDescription);

  payload.serialNumber && formData.append("serialNumber", payload.serialNumber);
  // payload.photos &&
  //   payload.photos.length > 0 &&
  //   formData.append("photos", payload.photos);
  const files = Array.isArray(payload.photos)
    ? payload.photos
    : payload.photos
      ? Array.from(payload.photos)
      : [];

  for (const file of files) {
    formData.append("photos", file); // or "photos[]", but match your server
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/repair-requests`,
      formData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error create repairing:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getRepairRequest(page) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/repair-requests?page=${page}&limit=${PAGE_SIZE}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repair requests:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getRepairRequestById(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/repair-requests/id/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repair request details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function createRepairJob(payload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/repair-jobs`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error create repair Job:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getRepairJobsByCustomerId() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/repair-jobs/my-repair-jobs`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repair jobs:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getMyRepairJobById(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/repair-jobs/my-repair-jobs/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repair job details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

// export async function getRepairJobs() {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/v1/repair-jobs`, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching repair jobs:", error);
//     throw new Error(
//       error.response?.data?.message || "Something went wrong. Please try again",
//     );
//   }
// }

export async function getRepairJobs(page, status, paymentStatus) {
  try {
    const params = new URLSearchParams();

    if (page) params.set("page", page);
    if (status && status !== "ALL") params.set("status", status); // backend expects uppercase status
    if (paymentStatus && paymentStatus !== "ALL")
      params.set("paymentStatus", paymentStatus);

    const qs = params.toString();
    const url = `${API_BASE_URL}/api/v1/repair-jobs${qs ? `?${qs}` : ""}`;

    const res = await axios.get(url, { withCredentials: true });
    return res.data; // keep your current return shape
  } catch (error) {
    console.error("Error fetching repair jobs:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function updateRepairJob(id, payload) {
  try {
    await axios.patch(`${API_BASE_URL}/api/v1/repair-jobs/${id}`, payload, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error update repair job:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function getRepairJobById(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/repair-jobs/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repair job details:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function deleteRepairJobById(id) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/repair-jobs/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error delete repair job:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function deleteRepairRequestById(id) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/repair-requests/id/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error delete repair job:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}
