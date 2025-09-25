import AdminProduct from "@/app/_components/AdminProduct";
import Empty from "@/app/_components/Empty";

function AdminProductBox({
  products,
  editingId,
  onEditingId,
  onSave,
  onDelete,
}) {
  if (products?.length === 0) return <Empty resourceName="Products" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {products?.map((product) => (
        <AdminProduct
          product={product}
          editingId={editingId}
          onEditingId={onEditingId}
          onSave={onSave}
          onDelete={onDelete}
          key={product._id}
        />
      ))}
    </div>
  );
}

export default AdminProductBox;
