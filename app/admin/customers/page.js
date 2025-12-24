"use client";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import CustomerRow from "@/app/_components/CustomerRow";
import EmployeeRow from "@/app/_components/EmployeeRow";
import Pagination from "@/app/_components/Pagination";
import Spinner from "@/app/_components/Spinner";
import Table from "@/app/_components/Table";
import { deleteCustomer, getCustomers } from "@/app/_lib/customer-service";
import { deleteEmployee, getEmployees } from "@/app/_lib/employee-service";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";

function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const [customers, setCustomers] = useState(null);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(
    function () {
      (async function () {
        setIsLoading(true);
        try {
          const res = await getCustomers(page);
          setCustomers(res.data.data);
          setTotal(res.total);
        } catch (err) {
          toast.error(err.message);
        } finally {
          setIsLoading(false);
        }
      })();
    },
    [page],
  );
  async function handleDelete(id) {
    try {
      await deleteCustomer(id);
      const res = await getCustomers();
      toast.success("Customer delete successful");
      setCustomers(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Customers</h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table>
            <Table.Header styles=" grid grid-cols-[1.5fr_2fr_3fr_0.5fr] md:grid-cols-[2fr_1fr_3fr_0.5fr]  items-center gap-x-4 text-xs sm:text-sm md:text-base font-medium text-zinc-300 uppercase p-2 md:h-10 max-w-6xl">
              <div className="min-w-0 truncate">Customer</div>
              <div className="min-w-0 truncate">Contacts</div>
              <div className="min-w-0 truncate">Shipping Addresses</div>
            </Table.Header>

            <Table.Body
              data={customers}
              render={(customer) => (
                <CustomerRow
                  customer={customer}
                  key={customer._id}
                  onDelete={handleDelete}
                />
              )}
            ></Table.Body>
            <Table.Footer>{/* <Pagination count={count} /> */}</Table.Footer>
          </Table>
          <Pagination count={total} />
        </>
      )}
    </div>
  );
}

export default Page;
