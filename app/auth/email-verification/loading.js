import Spinner from "@/app/_components/Spinner";

export default function Loading() {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <p className="text-base text-zinc-300 my-2">
        Loading email verification...
      </p>
    </div>
  );
}
