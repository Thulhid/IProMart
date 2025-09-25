import Empty from "@/app/_components/Empty";
import RepairJob from "@/app/_components/RepairJob";

function RepairJobBox({ jobs }) {
  if (jobs?.length === 0) return <Empty resourceName="Repair Job" />;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {jobs?.map((job) => (
        <RepairJob job={job} key={job._id} />
      ))}
    </div>
  );
}

export default RepairJobBox;
