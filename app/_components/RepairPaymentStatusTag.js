export default function RepairPaymentStatusTag({ status }) {
  const styles = {
    PENDING: "bg-yellow-600 text-yellow-50",
    PAID: "bg-green-600 text-green-50",
    FAILED: "bg-red-600 text-red-50",
  };
  const cls = styles[status] || "border-zinc-600 text-zinc-300";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>{status}</span>
  );
}
