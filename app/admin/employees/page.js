"use client";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import EmployeeRow from "@/app/_components/EmployeeRow";
import Pagination from "@/app/_components/Pagination";
import Spinner from "@/app/_components/Spinner";
import Table from "@/app/_components/Table";
import { deleteEmployee, getEmployees } from "@/app/_lib/employee-service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";

function Page() {
  const [employees, setEmployees] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(function () {
    (async function () {
      setIsLoading(true);
      try {
        const res = await getEmployees();
        setEmployees(res.data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  async function handleDelete(id) {
    try {
      await deleteEmployee(id);
      const res = await getEmployees();
      toast.success("Employee delete successful");
      setEmployees(res.data.data);
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
        <h1 className="text-3xl font-semibold text-zinc-300">Employees</h1>
      </div>
      <div className="mb-4 ml-auto w-fit max-w-6xl">
        <Button link="/admin/employees/create-employee" variant="primary">
          + Add Employees
        </Button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <Table.Header styles="grid grid-cols-[4fr_3fr_3fr_1fr] md:grid-cols-[4fr_3fr_3fr_1fr]  items-center gap-x-4 text-xs sm:text-sm md:text-base font-medium text-zinc-300 uppercase p-2 md:h-10 max-w-6xl">
            <div className="min-w-0 truncate">Employee</div>
            <div className="min-w-0 truncate">Contact</div>
            <div className="min-w-0 truncate">Email</div>
          </Table.Header>

          <Table.Body
            data={employees}
            render={(employee) => (
              <EmployeeRow
                employee={employee}
                key={employee._id}
                onDelete={handleDelete}
              />
            )}
          ></Table.Body>
          <Table.Footer>{/* <Pagination count={count} /> */}</Table.Footer>
        </Table>
      )}
    </div>
  );
}

export default Page;
