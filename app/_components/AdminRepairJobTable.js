"use client";

import AdminRepairJobRow from "@/app/_components/AdminRepairJobRow";
import Empty from "@/app/_components/Empty";
import Table from "@/app/_components/Table";

function AdminRepairJobTable({ jobs, onUpdateRepairJob, onDeleteRepairJob }) {
  if (jobs.length === 0) return <Empty resourceName="repair job" />;
  return (
    <Table>
      <Table.Header
        styles="hidden sm:grid gap-2 text-[11px] sm:text-sm md:text-base uppercase font-semibold
              grid-cols-2 sm:grid-cols-3 md:grid-cols-[2fr_2fr_2fr_2fr_0.5fr] px-2 py-2 text-zinc-300"
      >
        <div>Device</div>
        <div>Current Status</div>
        <div>Payment Status</div>
        <div>Total Amount</div>
      </Table.Header>

      <Table.Body
        data={jobs}
        render={(job) => (
          <AdminRepairJobRow
            job={job}
            key={job._id}
            onUpdateRepairJob={onUpdateRepairJob}
            onDeleteRepairJob={onDeleteRepairJob}
          />
        )}
      />

      <Table.Footer></Table.Footer>
    </Table>
  );
}

export default AdminRepairJobTable;
