import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export async function createPay(
//   cart,
//   total,
//   customer,
//   includingShipping,
//   itemObj
// ) {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/v1/payhere/session`,
//       {
//         cart,
//         total,
//         customer,
//         includingShipping,
//         itemObj,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching payhere:", error);
//     throw new Error(
//       error.response?.data?.message || "Something went wrong. Please try again"
//     );
//   }
// }

export async function createPay(isCart, customer, includingShipping, itemObj) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/payhere/session`,
      {
        isCart,
        customer,
        includingShipping,
        itemObj,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payhere:", error);
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again",
    );
  }
}

export async function createRepairPay(jobId, totalAmount) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/payhere/repair/session`,
      { jobId, totalAmount },
      { withCredentials: true },
    );
    return data; // { payhereParams }
  } catch (error) {
    console.error("Error fetching payhere (repair):", error);
    throw new Error(error.response?.data?.message || "Failed to init payment");
  }
}
