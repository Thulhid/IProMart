"use client";

import { HiOutlineChevronLeft, HiOutlineTruck } from "react-icons/hi2";
import { BsCash } from "react-icons/bs";
import BackButton from "@/app/_components/BackButton";
import ContainerBox from "@/app/_components/ContainerBox";
import { formatCurrency, formatDistanceFromNow } from "@/app/_utils/helper";
import { useEffect, useState } from "react";
import { getMyOrders } from "@/app/_lib/order-service";
import toast from "react-hot-toast";
import Tag from "@/app/_components/Tag";
import Spinner from "@/app/_components/Spinner";
import { format, isToday, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(function () {
    (async function () {
      setIsLoading(true);
      try {
        const res = await getMyOrders();
        setOrders(res.data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-5xl">
      {/* ✅ Always show this */}
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">My Orders</h1>
      </div>

      {/* ✅ Conditional content */}
      {isLoading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <p className="py-20 text-center text-base text-zinc-400 sm:text-lg">
          <HiOutlineTruck size={22} className="inline-block" /> Your Orders is
          empty. Let’s buy something!
        </p>
      ) : (
        <ContainerBox>
          <div className="w-full space-y-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-lg shadow-blue-600/40 sm:p-8">
            {orders.map((order) => (
              <div
                onClick={() => router.push(`/me/orders/${order._id}`)}
                key={order._id}
                className="cursor-pointer rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 transition-colors hover:border-blue-600 md:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-zinc-200">
                    <HiOutlineTruck size={20} className="text-zinc-400" />
                    <span className="text-sm">
                      <span className="font-medium">Order ID:</span>{" "}
                      {order.orderId}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {isToday(parseISO(order.createdAt))
                      ? "Today"
                      : formatDistanceFromNow(order.createdAt)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.product.imageCover}
                        alt={item.product.name}
                        className="h-14 w-14 rounded-lg border border-zinc-600 object-cover"
                      />
                      <div className="space-y-0.5 text-zinc-200">
                        <p className="leading-5 font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-zinc-400">
                          Qty: {item.quantity} ×{" "}
                          {formatCurrency(item.priceAtPurchase)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-700 pt-4 text-sm text-zinc-300">
                  <div className="flex items-center gap-4">
                    <span>
                      <span className="text-zinc-400">Payment:</span>{" "}
                      {order.paymentStatus}
                    </span>
                    <span className="hidden sm:inline">|</span>
                    <Tag status={order.orderStatus} />
                  </div>
                  <div className="font-semibold text-zinc-100">
                    Total: {formatCurrency(order.totalAmount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContainerBox>
      )}
    </div>
  );
}
