import AdminProductEdit from "@/app/_components/AdminProductEdit";
import Button from "@/app/_components/Button";
import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Modal from "@/app/_components/Modal";
import { formatCurrency } from "@/app/_utils/helper";
import Image from "next/image";
import { HiPencil, HiPencilSquare, HiTrash } from "react-icons/hi2";

function AdminProduct({ product, editingId, onEditingId, onSave, onDelete }) {
  return (
    <div
      key={product._id}
      className="bg-zinc-900 p-4 rounded-xl shadow-md flex flex-col gap-2"
    >
      <Image
        className="rounded-t-lg object-contain w-full h-30 sm:h-50 md:h-60"
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
          <h2 className="text-lg font-semibold truncate">{product.name}</h2>
          <p className={`text-sm $`}>
            {product.category} •{" "}
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
          <p className="font-medium text-base">
            {formatCurrency(product.finalPrice)}
          </p>
          <div className="flex gap-3 mt-3 items-center">
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
