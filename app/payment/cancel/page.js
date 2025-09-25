"use client";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import { HiOutlineChevronLeft, HiXCircle } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="mx-4 md:mx-10 my-6 2xl:max-w-4xl 2xl:mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl text-zinc-300 font-semibold">
          Payment Cancelled
        </h1>
      </div>

      <ContainerBox>
        <div className="flex items-center justify-center px-4 max-w-4xl bg-zinc-900 shadow-lg shadow-red-600/40 p-8 rounded-2xl border border-zinc-700">
          <div className="text-center space-y-4">
            <HiXCircle className="text-red-500 mx-auto" size={48} />
            <h1 className="text-zinc-100 text-2xl font-semibold">
              Payment Cancelled
            </h1>
            <p className="text-zinc-400 text-sm">
              You cancelled the payment. No money was deducted.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Button
                variant="primary"
                configStyles="w-full sm:w-auto"
                onClick={() => router.replace("/cart")}
              >
                Return to Cart
              </Button>
              <Button
                variant="secondary"
                link="/products"
                configStyles="w-full sm:w-auto"
                onClick={() => router.replace("/products")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </ContainerBox>
    </div>
  );
}
