import AdminRepairJob from "@/app/_components/AdminRepairJob";
import Empty from "@/app/_components/Empty";

function AdminRepairJobBox({ jobs }) {
  if (jobs?.length === 0) return <Empty resourceName="Repair job" />;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {jobs?.map((job) => (
        <AdminRepairJob job={job} key={job._id} />
      ))}
    </div>
  );
}

export default AdminRepairJobBox;
