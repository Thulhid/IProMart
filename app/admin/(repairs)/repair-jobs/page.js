"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import AdminRepairJobTable from "@/app/_components/AdminRepairJobTable";
import Spinner from "@/app/_components/Spinner";
import AdminRepairJobFilters from "@/app/_components/AdminRepairJobFilters";

import {
  deleteRepairJobById,
  getRepairJobs,
  updateRepairJob,
} from "@/app/_lib/repairing-service";

function RepairJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(null);
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") || "ALL").toUpperCase();
  const paymentStatus = (
    searchParams.get("paymentStatus") || "ALL"
  ).toUpperCase();
  const page = Number(searchParams.get("page") || 1);

  async function fetchJobs() {
    setIsLoading(true);
    try {
      // pass status + page (service is backward-compatible)
      const res = await getRepairJobs(page, status, paymentStatus);
      setJobs(res.data.data); // keep your shape
      setTotal(res.data.total);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // refetch whenever status or page changes
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, searchParams.toString()]);

  async function handleUpdateRepairJob(id, payload) {
    try {
      await updateRepairJob(id, payload);
      await fetchJobs();
      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteRepairJob(id) {
    try {
      await deleteRepairJobById(id);
      await fetchJobs();
      toast.success("Status deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <AdminRepairJobFilters />
      {isLoading ? (
        <Spinner />
      ) : (
        <AdminRepairJobTable
          jobs={jobs}
          onUpdateRepairJob={handleUpdateRepairJob}
          onDeleteRepairJob={handleDeleteRepairJob}
        />
      )}
      {/* <Pagination count={total} /> */}
    </>
  );
}

export default RepairJobs;
