"use client";
import Button from "@/app/_components/Button";
import { useRouter, useSearchParams } from "next/navigation";

function Filter({
  filterField,
  options,
  searchParamsToReset,
  configStyles = "",
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentFilter = searchParams.get(filterField) || options[0].value;
  const currentLabel =
    options.find((option) => option.value === currentFilter)?.label ||
    options[0].label;

  function handleClick(value) {
    const params = new URLSearchParams(searchParams.toString());

    // Set selected filter
    params.set(filterField, value);

    // Reset other params
    searchParamsToReset?.forEach((param) => {
      params.set(param.name, param.value);
    });

    router.push(`?${params.toString()}`);
  }

  return (
    <div className="m-2 ml-auto flex w-fit items-center gap-1.5 p-1 px-2 shadow-sm sm:m-0">
      {options.map((option) => (
        <Button
          variant="filter"
          key={option.value}
          onClick={() => handleClick(option.value)}
          selected={currentLabel}
          configStyles={configStyles}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export default Filter;
