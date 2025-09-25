import AdminRepairRequest from "@/app/_components/AdminRepairRequest";
import Empty from "@/app/_components/Empty";

function AdminRepairRequestBox({ requests, onDeleteRequestById }) {
  if (requests?.length === 0) return <Empty resourceName="Repair Request" />;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {requests?.map((request) => (
        <AdminRepairRequest
          request={request}
          key={request._id}
          onDeleteRequestById={onDeleteRequestById}
        />
      ))}
    </div>
  );
}

export default AdminRepairRequestBox;
