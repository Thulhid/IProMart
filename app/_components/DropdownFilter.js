"use client";

import { useRouter, useSearchParams } from "next/navigation";

function DropdownFilter({
  filterField,
  options,
  searchParamsToReset,
  className = "",
  label,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get(filterField) ?? options?.[0]?.value ?? "";

  function onChange(e) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    // set selected filter
    params.set(filterField, value);

    // reset other params (e.g., page)
    searchParamsToReset?.forEach((p) => params.set(p.name, p.value));

    router.push(`?${params.toString()}`);
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label ? <span className="text-sm text-slate-200">{label}</span> : null}
      <select
        value={current}
        onChange={onChange}
        className="cursor-pointer rounded-md bg-zinc-800 py-1.5 text-zinc-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownFilter;
