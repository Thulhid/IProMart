"use client";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import Empty from "@/app/_components/Empty";
import OrderOperations from "@/app/_components/OrderOperations";
import OrderRow from "@/app/_components/OrderRow";
import Pagination from "@/app/_components/Pagination";
import Spinner from "@/app/_components/Spinner";
import Table from "@/app/_components/Table";
import { deleteOrder, filterOrders, getOrders } from "@/app/_lib/order-service";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";

function Page() {
  const searchParams = useSearchParams();

  const orderStatus = searchParams.get("orderStatus");
  const sortBy = searchParams.get("sort");
  const page = Number(orderStatus?.page || 1);
  const sort =
    (sortBy === "createdAt-asc" && "createdAt") ||
    (sortBy === "createdAt-desc" && "-createdAt") ||
    (sortBy === "totalAmount-asc" && "totalAmount") ||
    (sortBy === "totalAmount-desc" && "-totalAmount") ||
    undefined;
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    (async function () {
      setIsLoading(true);
      try {
        let orders;
        if (searchId || orderStatus || sort) {
          orders = await filterOrders(searchId, page, orderStatus, sort);
        } else {
          orders = await getOrders(page);
        }
        setOrders(orders.data.data);
        setTotal(orders.total);
        if (orders.data.data.length === 0) {
          toast.error("No order found");
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [searchId, page, orderStatus, sort]);

  async function handleDelete(id) {
    try {
      await deleteOrder(id);
      const res = await getOrders();
      toast.success("Customer delete successful");
      setOrders(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  }
  function handleSearch(e) {
    e.preventDefault();
    setSearchId(searchInput.trim());
  }

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Orders</h1>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="mt-2 mb-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
      >
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="min-w-sm rounded-xl bg-zinc-800 px-4 py-2 text-sm text-zinc-200 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-red-500 sm:max-w-sm"
            />
            <Button buttonType="submit" variant="primary" configStyles="w-fit">
              Search
            </Button>
          </div>

          <OrderOperations />
        </div>
      </form>

      {isLoading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <Empty resourceName="order" />
      ) : (
        <>
          <Table>
            <Table.Header
              styles="hidden sm:grid gap-2 text-[11px] sm:text-sm md:text-base uppercase font-semibold
              grid-cols-2 sm:grid-cols-3 md:grid-cols-[2.5fr_3fr_2fr_2fr_1fr_0.5fr] px-2 py-2 text-zinc-300"
            >
              <div>Products</div>
              <div>Customer</div>
              <div>Date</div>
              <div>Status</div>
              <div>Amount</div>
            </Table.Header>

            <Table.Body
              data={orders}
              render={(order) => (
                <OrderRow
                  onOrder={setOrders}
                  order={order}
                  key={order._id}
                  onDelete={handleDelete}
                />
              )}
            />

            <Table.Footer>
              <Pagination count={total} />
            </Table.Footer>
          </Table>

          <Pagination count={total} />
        </>
      )}
    </div>
  );
}

export default Page;
