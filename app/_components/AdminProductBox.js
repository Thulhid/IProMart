import AdminProduct from "@/app/_components/AdminProduct";
import Empty from "@/app/_components/Empty";
import SubcategorySelection from "@/app/_components/SubcategorySelection";

function AdminProductBox({
  products,
  editingId,
  onEditingId,
  onSave,
  onDelete,
}) {
  if (products?.length === 0) return <Empty resourceName="Products" />;

  return (
    <>
      <div className="mb-10">
        <SubcategorySelection />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}

export default AdminProductBox;
