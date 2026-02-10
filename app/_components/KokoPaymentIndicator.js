function InstallmentTile({ label, amount, compact = false }) {
  return (
    <div
      className={`rounded-md border border-fuchsia-800/70 bg-fuchsia-950/60 text-center ${compact ? "px-3 py-2" : "px-4 py-2"}`}
    >
      <p
        className={`${compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"} leading-none text-violet-300`}
      >
        {label}
      </p>
      <p
        className={`mt-1 leading-none font-semibold text-fuchsia-100 ${compact ? "text-base sm:text-lg" : "text-lg sm:text-xl"}`}
      >
        {amount}
      </p>
    </div>
  );
}

export default function KokoPaymentIndicator({
  todayAmount,
  day30Amount,
  day60Amount,
  totalAmount,
  compact = false,
}) {
  return (
    <section
      className={`w-full overflow-hidden rounded-xl border border-fuchsia-700/70 bg-gradient-to-br from-[#130015] to-[#270029] ${compact ? "p-2.5" : "p-3"}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`${compact ? "text-[9px]" : "text-[10px]"} font-bold tracking-wide text-violet-200 uppercase sm:text-xs`}
          >
            koko
          </div>
          <div className="leading-tight">
            <h3
              className={`${compact ? "text-sm sm:text-base" : "text-base sm:text-lg"} font-semibold text-fuchsia-50`}
            >
              KOKO Pay
            </h3>
            <p
              className={`${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"} text-violet-300`}
            >
              Buy Now, Pay Later
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full bg-fuchsia-700/60 font-medium text-fuchsia-100 ${compact ? "px-2.5 py-1 text-[11px] sm:text-xs" : "px-3 py-1 text-xs sm:text-sm"}`}
        >
          Transaction fee included
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2.5">
        <InstallmentTile label="Today" amount={todayAmount} compact={compact} />
        <InstallmentTile
          label="30 days"
          amount={day30Amount}
          compact={compact}
        />
        <InstallmentTile label="60 days" amount={day60Amount} compact={compact} />
      </div>

      <div
        className={`mt-3 flex flex-col gap-1 border-t border-fuchsia-800/80 pt-2 sm:flex-row sm:items-center sm:justify-between ${compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"}`}
      >
        <p className={`${compact ? "text-emerald-300" : "text-green-400"}`}>
          No credit check
        </p>
        <p className="text-violet-200">
          Total: <span className="font-medium text-violet-100">{totalAmount}</span>
        </p>
      </div>
    </section>
  );
}
