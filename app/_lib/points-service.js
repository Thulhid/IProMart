import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Expected backend response shape (example):
 * {
 *   status: "success",
 *   balancePoints: 1200,
 *   settings: {
 *     pointsEnabled: true,
 *     pointValueRs: 1,
 *     maxRedeemPercent: 30,
 *     minRedeemPoints: 0,
 *     allowPointsWithCoupon: false
 *   }
 * }
 */
export async function getMyPoints() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/points/me`, {
      withCredentials: true,
    });
    const raw = res.data?.data?.data ?? res.data?.data ?? res.data;

    if (raw?.balance) {
      const s = raw.settings || {};
      return {
        settings: {
          pointsEnabled: Boolean(s.pointsEnabled),
          pointValueRs: Number(s.pointValueRs ?? s.pointsValueRs ?? 1),
          maxRedeemPercent: Number(
            s.maxRedeemPercent ?? s.pointsRedeemCapPercent ?? 0,
          ),
          minRedeemPoints: Number(
            s.minRedeemPoints ?? s.pointsMinRedeemPoints ?? 0,
          ),
          allowPointsWithCoupon: Boolean(
            s.allowPointsWithCoupon ?? s.pointsAllowWithCoupon,
          ),
        },
        balancePoints: Number(raw.balance?.pointsBalance ?? 0),
        pendingPoints: Number(raw.balance?.pointsPending ?? 0),
        reservedPoints: Number(raw.balance?.pointsReserved ?? 0),
        recent: raw.recent ?? [],
        summary: raw.summary ?? null,
        threshold: raw.threshold ?? null,
      };
    }

    return raw;
  } catch (error) {
    if (error.response?.status === 401) return null;

    throw new Error(
      error.response?.data?.message || "Failed to load points info",
    );
  }
}
