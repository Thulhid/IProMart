import Button from "@/app/_components/Button";
import { useState } from "react";

function AdminProductEdit({ product, onSave, onCancel }) {
  const [form, setForm] = useState(product);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
        placeholder="Product name"
      />
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
        placeholder="Price"
      />
      <input
        type="number"
        name="priceDiscount"
        value={form.priceDiscount}
        onChange={handleChange}
        className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
        placeholder="Discount"
      />
      <input
        type="number"
        name="availability"
        value={form.availability}
        onChange={handleChange}
        className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
        placeholder="Stock"
      />
      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
        placeholder="Category"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isUsed"
          checked={form.isUsed}
          onChange={handleChange}
        />
        Used product
      </label>
      <div className="flex gap-3 mt-2">
        <Button
          variant="primary"
          onClick={() => onSave(product._id, form)}
          className="flex-1"
        >
          Save
        </Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default AdminProductEdit;

// function EditableProduct({ product, onSave, onCancel }) {
//   const [form, setForm] = useState(product);

//   function handleChange(e) {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       <input
//         type="text"
//         name="name"
//         value={form.name}
//         onChange={handleChange}
//         className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
//         placeholder="Product name"
//       />
//       <input
//         type="number"
//         name="price"
//         value={form.price}
//         onChange={handleChange}
//         className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
//         placeholder="Price"
//       />
//       <input
//         type="number"
//         name="priceDiscount"
//         value={form.priceDiscount}
//         onChange={handleChange}
//         className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
//         placeholder="Discount"
//       />
//       <input
//         type="number"
//         name="availability"
//         value={form.availability}
//         onChange={handleChange}
//         className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
//         placeholder="Stock"
//       />
//       <input
//         type="text"
//         name="category"
//         value={form.category}
//         onChange={handleChange}
//         className="bg-zinc-800 px-3 py-2 rounded text-zinc-100"
//         placeholder="Category"
//       />
//       <label className="flex items-center gap-2 text-sm">
//         <input
//           type="checkbox"
//           name="isUsed"
//           checked={form.isUsed}
//           onChange={handleChange}
//         />
//         Used product
//       </label>
//       <div className="flex gap-3 mt-2">
//         <Button
//           variant="primary"
//           onClick={() => onSave(product._id, form)}
//           className="flex-1"
//         >
//           Save
//         </Button>
//         <Button variant="secondary" onClick={onCancel} className="flex-1">
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// }
