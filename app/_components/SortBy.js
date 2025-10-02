"use client";

import Select from "@/app/_components/Select";
import { useRouter, useSearchParams } from "next/navigation";

function SortBy({ options }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortBy = searchParams.get("sort") || "";

  function handleChange(e) {
    const newValue = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newValue);
    params.set("page", "1"); // Optional: Reset page on sort
    router.push(`?${params.toString()}`);
  }

  return <Select options={options} onChange={handleChange} value={sortBy} />;
}

export default SortBy;
