"use client";

import AdminRepairRequestBox from "@/app/_components/AdminRepairRequestBox";
import Spinner from "@/app/_components/Spinner";
import { getRepairRequest } from "@/app/_lib/repairing-service";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function RepairRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getRepairRequest(page);
        setRequests(res.data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page]);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <AdminRepairRequestBox requests={requests} />
    </div>
  );
}

export default RepairRequestsPage;
