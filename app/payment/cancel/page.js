"use client";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import { HiOutlineChevronLeft, HiXCircle } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">
          Payment Cancelled
        </h1>
      </div>

      <ContainerBox>
        <div className="flex max-w-4xl items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 p-8 px-4 shadow-lg shadow-red-600/40">
          <div className="space-y-4 text-center">
            <HiXCircle className="mx-auto text-red-500" size={48} />
            <h1 className="text-2xl font-semibold text-zinc-100">
              Payment Cancelled
            </h1>
            <p className="text-sm text-zinc-400">
              You cancelled the payment. No money was deducted.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                variant="primary"
                configStyles="w-full sm:w-auto"
                onClick={() => router.replace("/cart")}
              >
                Return to Cart
              </Button>
              <Button
                variant="secondary"
                link="/"
                configStyles="w-full sm:w-auto"
                onClick={() => router.replace("/")}
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
