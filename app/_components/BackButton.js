"use client";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";

function BackButton({ children }) {
  const router = useRouter();
  return (
    <Button variant="back" onClick={() => router.back()}>
      {children}
    </Button>
  );
}

export default BackButton;
