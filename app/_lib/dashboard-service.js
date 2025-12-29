import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function handleError(error) {
  console.error("Dashboard error:", error);
  throw new Error(
    error.response?.data?.message || "Something went wrong. Please try again",
  );
}

// export async function getAdminDashboard() {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/api/v1/admin/dashboard`, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error) {
//     handleError(error);
//   }
// }
export async function getAdminDashboard(params = {}) {
  const qs = new URLSearchParams();

  if (params.days) qs.set("days", String(params.days));
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);

  const url = `${API_BASE_URL}/api/v1/admin/dashboard${qs.toString() ? `?${qs}` : ""}`;

  const res = await axios.get(url, { withCredentials: true });
  return res.data;
}
