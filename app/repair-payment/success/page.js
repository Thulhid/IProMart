"use client";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import { useRouter, useSearchParams } from "next/navigation";
import { HiCheckCircle, HiOutlineChevronLeft } from "react-icons/hi2";

export default function RepairPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const repairJobId = searchParams.get("repairJobId");
  const router = useRouter();

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-blue-400 group-active:text-blue-400"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">
          Payment Success
        </h1>
      </div>
      <ContainerBox>
        <div className="flex max-w-4xl items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 p-8 px-4 shadow-lg shadow-blue-400/40">
          <div className="space-y-4 text-center">
            <HiCheckCircle className="mx-auto text-blue-400" size={48} />
            <h1 className="text-2xl font-semibold text-zinc-100">
              Repair job Payment Successful
            </h1>
            <p className="text-sm text-zinc-400">
              Your repair job payment has been received.
            </p>
            <Button
              variant="primary"
              configStyles="m-auto"
              onClick={() => router.replace(`/repairs`)}
            >
              track repair jobs
            </Button>
            {repairJobId && (
              <p className="mt-5 text-sm text-zinc-300">
                <span className="font-medium text-zinc-400">
                  Repair job ID:
                </span>{" "}
                <span className="text-zinc-200">{repairJobId}</span>
              </p>
            )}
          </div>
        </div>
      </ContainerBox>
    </div>
  );
}
