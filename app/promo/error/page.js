import Button from "@/app/_components/Button";
import { HiExclamationTriangle } from "react-icons/hi2";

export const metadata = {
  title: "Promo Link Error",
  description: "Promo link could not be applied.",
};

function getFirst(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};

  const message =
    getFirst(params.message) ||
    getFirst(params.msg) ||
    "Invalid or expired promo link.";

  const statusCode =
    getFirst(params.statusCode) || getFirst(params.code) || getFirst(params.s);

  const safeStatusCode =
    statusCode && /^[0-9]{3}$/.test(String(statusCode))
      ? String(statusCode)
      : "";

  return (
    <div className="mx-4 my-10 flex min-h-[70vh] items-center justify-center md:mx-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900/40 shadow-xl">
        <div className="flex items-start gap-4 border-b border-zinc-700/50 bg-zinc-950/40 p-6">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            <HiExclamationTriangle size={26} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-zinc-100 md:text-2xl">
                Promo link not available
              </h1>
              {safeStatusCode && (
                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300">
                  {safeStatusCode}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm break-words text-zinc-300 md:text-base">
              {String(message)}
            </p>
            <p className="mt-2 text-xs text-zinc-500 md:text-sm">
              This can happen if the promo link expired or reached its maximum
              redemptions.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-500">
            You can still continue shopping and checkout normally.
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" link="/">
              Back to home
            </Button>
            <Button variant="primary" link="/cart">
              View cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
