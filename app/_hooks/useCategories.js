import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function useCategories() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFirstRender = useRef(true);
  //function handleSelect(category) {
  // setSelected(category);
  //BUG:
  //  setOpen(false);

  // }
  useEffect(() => {
    setOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    if (!selected) return;
    if (selected === "10210") {
      params.delete("category");
      params.delete("subcategory");
    } else {
      params.set("category", selected);
    }

    router.replace(`?${params.toString()}`);
    if (isFirstRender.current) {
      setSelected(searchParams.get("category"));
      isFirstRender.current = false;
      return;
    }

    // const params = new URLSearchParams(searchParams.toString());

    if (selected && selected !== "All Categories") {
      params.set("category", selected);
    } else {
      params.delete("category");
    }
  }, [selected, searchParams, router]);
  return { open, setOpen, selected, setSelected };
}
