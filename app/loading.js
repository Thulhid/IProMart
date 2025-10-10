import Spinner from "@/app/_components/Spinner";

export default function Loading() {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <p className="my-2 text-base text-zinc-300">Loading products...</p>
    </div>
  );
}
