import AdminProductEdit from "@/app/_components/AdminProductEdit";
import Button from "@/app/_components/Button";
import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Modal from "@/app/_components/Modal";
import { formatCurrency } from "@/app/_utils/helper";
import Image from "next/image";
import { HiPencilSquare } from "react-icons/hi2";

function AdminProduct({ product, editingId, onEditingId, onSave, onDelete }) {
  return (
    <div
      key={product._id}
      className="flex flex-col gap-2 rounded-xl bg-zinc-900 p-4 shadow-md"
    >
      <Image
        className="h-30 w-full rounded-t-lg object-contain sm:h-50 md:h-60"
        src={product.imageCover}
        alt="product image"
        width={400}
        height={400}
      />

      {editingId === product._id ? (
        <AdminProductEdit
          product={product}
          onSave={onSave}
          onCancel={() => onEditingId(null)}
        />
      ) : (
        <>
          <h2 className="truncate text-lg font-semibold">{product.name}</h2>
          <p className={`$ text-sm`}>
            {product.category.name} - {product.subcategory.name} •{" "}
            {product.availability ? (
              <span
                className={`${
                  product.availability <= 10
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {product.availability} in stock
              </span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>
          <p className="text-sm text-zinc-400">
            {product.isUsed ? "Used" : "Brand New"}
          </p>
          <p className="text-base font-medium">
            {formatCurrency(product.finalPrice)}
          </p>
          <p className="text-sm text-zinc-400">Clicks: {product.clicks ?? 0}</p>
          <p className="text-sm text-zinc-400">
            Orders count: {product.orderCount ?? 0}
          </p>
          <p className="text-sm text-zinc-400">
            Units sold: {product.unitsSold ?? 0}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Button
              link={`/admin/products/${product._id}`}
              configStyles="px-2"
              onClick={() => onEditingId(product._id)}
              variant="edit"
            >
              <HiPencilSquare size={22} />
            </Button>

            <Modal>
              <Modal.Open opens="product-delete">
                <Button variant="danger">Delete</Button>
              </Modal.Open>
              <Modal.Window name="product-delete">
                <ConfirmDelete
                  resource="product"
                  onConfirm={() => onDelete(product._id)}
                />
              </Modal.Window>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminProduct;
