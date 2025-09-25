function Tag({ status }) {
  const base = `text-[10px] sm:text-xs font-medium md:font-semibold w-fit py-1 px-1.5 rounded-full uppercase shadow`;

  const statusTag = {
    pending: base + " bg-red-700 text-red-100",
    processing: base + " bg-yellow-700 text-yellow-100",
    shipped: base + " bg-blue-700 text-blue-100",
    delivered: base + " bg-green-700 text-green-100",
    cancelled: base + " bg-zinc-700 text-zinc-100",
  };

  return <div className={statusTag[status?.toLowerCase()]}>{status}</div>;
}

export default Tag;
