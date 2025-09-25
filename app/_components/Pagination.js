"use client";

import Button from "@/app/_components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const PAGE_SIZE = process.env.NEXT_PUBLIC_PAGE_SIZE;

export default function Pagination({ count }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(count / PAGE_SIZE);

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleNext = () => {
    if (currentPage < pageCount) updatePage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) updatePage(currentPage - 1);
  };

  if (pageCount <= 1) return null;

  return (
    <div className="mx-10 my-8 flex items-center">
      <p className="ml-1 w-fit text-xs text-zinc-300 md:text-sm">
        <em>
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * PAGE_SIZE + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
          </span>{" "}
          of <span className="font-medium">{count}</span> results
        </em>
      </p>
      <div className="ml-auto flex w-fit gap-3">
        <Button
          variant="pagination"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <HiChevronLeft /> <span>Previous</span>
        </Button>
        <Button
          variant="pagination"
          onClick={handleNext}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight />
        </Button>
      </div>
    </div>
  );
}
