export default function StatusTag({ status }) {
  const styles = {
    ACCEPTED: "bg-blue-600 text-blue-50",
    IN_PROGRESS: "bg-indigo-600 text-indigo-50",
    ON_HOLD: "bg-yellow-600 text-yellow-50",
    READY_FOR_PICKUP: "bg-teal-600 text-teal-50",
    COMPLETED: "bg-green-600 text-green-50",
    CANCELLED: "bg-red-600 text-red-50",
  };
  const cls = styles[status] || "border-zinc-600 text-zinc-300";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
