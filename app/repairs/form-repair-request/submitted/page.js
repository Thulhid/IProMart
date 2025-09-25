import Button from "@/app/_components/Button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-zinc-200">
        Request submitted
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        We’ll review your request. If a job is created, it will appear in the
        app and you’ll receive an email notification.
      </p>
      <Button link="/" variant="primary" configStyles="w-fit m-auto mt-5">
        Go to Home
      </Button>
    </div>
  );
}
