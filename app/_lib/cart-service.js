import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export async function createOrUpdateCart(productId, quantity) {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/v1/carts/my-cart`,
//       {
//         productId,
//         quantity,
//       },
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error || "Something went wrong. Please try again";
//   }
// }

export async function createOrUpdateCart(
  productId,
  quantity,
  mode = "replace"
) {
  console.log(productId);
  const res = await axios.post(
    `${API_BASE_URL}/api/v1/carts/my-cart`,
    {
      productId,
      quantity,
      mode,
    },
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function getCustomerCart() {
  const res = await axios.get(`${API_BASE_URL}/api/v1/carts/my-cart`, {
    withCredentials: true,
  });
  return res.data;
}

export async function removeFromCart(productId) {
  const res = await axios.delete(
    `${API_BASE_URL}/api/v1/carts/my-cart/${productId}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
}
