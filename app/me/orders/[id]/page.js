"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  HiOutlineChevronLeft,
  HiOutlineInformationCircle,
  HiOutlineTruck,
} from "react-icons/hi2";
import { BsCash } from "react-icons/bs";
import BackButton from "@/app/_components/BackButton";
import ContainerBox from "@/app/_components/ContainerBox";
import { getMyOrderById } from "@/app/_lib/order-service";
import Spinner from "@/app/_components/Spinner";
import toast from "react-hot-toast";
import { formatCurrency, formatDistanceFromNow } from "@/app/_utils/helper";
import Tag from "@/app/_components/Tag";
import { format, isToday, parseISO } from "date-fns";
import { FaMoneyBillWave } from "react-icons/fa6";
import { getSetting } from "@/app/_lib/setting-service";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setIsLoading(true);
      try {
        const res = await getMyOrderById(id);
        setOrder(res.data.data);
        const resShippingFee = await getSetting(
          process.env.NEXT_PUBLIC_SETTING_ID,
        );
        setShippingFee(resShippingFee.data.data.shippingFee);
      } catch (err) {
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (!isLoading && !order)
    return <p className="py-20 text-center text-zinc-400">Order not found.</p>;

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Order Details</h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <div className="space-y-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-lg shadow-blue-600/40 sm:p-8">
            <div className="space-y-1 text-sm text-zinc-400">
              <p>
                <span className="font-medium text-zinc-200">Order ID:</span>{" "}
                {order.orderId}
              </p>
              <p>
                <span className="font-medium text-zinc-200">Placed:</span>{" "}
                {/* {isToday(parseISO(order.createdAt))
                ? "Today"
                : formatDistanceFromNow(order.createdAt)} */}
                {/* {format(new Date(order.createdAt), "yyyy-MM-dd hh:mm a")} */}
                {format(parseISO(order.createdAt), "MMM dd yyyy hh:mm a")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-800 p-3"
                >
                  <div className="relative h-16 w-16">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 text-zinc-200">
                    <p className="leading-5 font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-400">
                      Qty: {item.quantity} ×{" "}
                      {formatCurrency(item.priceAtPurchase)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-zinc-700 pt-4 text-sm text-zinc-300 sm:flex-row sm:justify-between">
              <div className="space-y-1">
                <p>
                  <span className="text-zinc-400">Shipping Address:</span>{" "}
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </p>
                <p>
                  <span className="text-zinc-400">Contact Number:</span>{" "}
                  {order.shippingAddress.mobileNumber}
                </p>
                <p>
                  <span className="text-zinc-400">Payment Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" />
                  <span>
                    <span className="text-zinc-400">Payment:</span>{" "}
                    <span
                      className={`${
                        order.paymentStatus === "Paid"
                          ? "text-green-500"
                          : order.paymentStatus === "Failed"
                            ? "text-red-500"
                            : "text-zinc-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>{" "}
                  </span>
                </p>
                <Tag status={order.orderStatus} />
              </div>
              <div className="self-end text-base font-semibold text-zinc-100">
                <p>Total: {formatCurrency(order.totalAmount)}</p>
                {order.shippingFee !== 0 && (
                  <p className="text-sm font-normal text-zinc-400">
                    (Paid Shipping Fee: {formatCurrency(order.shippingFee)})
                  </p>
                )}
              </div>
            </div>
            {order.shippingFee === 0 && (
              <span className="flex items-start gap-2 text-sm text-yellow-400">
                <HiOutlineInformationCircle className="" size={18} />
                Shipping fee (Rs.{shippingFee}) will be collected when your
                order is delivered
              </span>
            )}

            {/* Order Status History */}
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold text-zinc-200">
                Order Status History
              </h2>
              <div className="space-y-2">
                {order.orderStatusHistory.map((status, index) => (
                  <div
                    key={status._id}
                    className="flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2"
                  >
                    <span className="font-medium text-zinc-300">
                      {status.status}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {/* {format(new Date(status.changedAt), "yyyy-MM-dd hh:mm a")} */}
                      {format(
                        parseISO(status.changedAt),
                        "MMM dd yyyy hh:mm a",
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContainerBox>
      )}
    </div>
  );
}
