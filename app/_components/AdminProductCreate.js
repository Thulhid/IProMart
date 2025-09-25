"use client";

import { useState } from "react";
import Button from "@/app/_components/Button";

function AdminProductCreate({ onCreate }) {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    priceDiscount: 0,
    description: "",
    category: "laptops",
    imageCover: "/placeholder.jpg",
    isUsed: false,
    warranty: 0,
    features: "",
    availability: 0,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const product = {
      ...form,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      _id: Date.now().toString(),
    };
    onCreate(product);
  }

  return (
    <div className="px-4 sm:px-6">
      <h2 className="text-xl font-semibold text-zinc-200">
        Create New Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 bg-zinc-900 p-6 rounded-2xl text-zinc-100 max-w-6xl mx-auto xl:min-w-4xl min-w-auto overflow-auto"
      >
        {/* Product Name */}
        <div className="flex flex-col gap-1 col-span-full sm:col-span-2 xl:col-span-1">
          <label className="text-sm text-zinc-400">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="bg-zinc-800 px-4 py-2 rounded-lg"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Price & Discount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Price (Rs)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="bg-zinc-800 px-4 py-2 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Discounted Price (Rs)</label>
          <input
            type="number"
            name="priceDiscount"
            value={form.priceDiscount}
            onChange={handleChange}
            className="bg-zinc-800 px-4 py-2 rounded-lg"
          />
        </div>

        {/* Category & Stock */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="bg-zinc-800 px-4 py-2 rounded-lg"
            placeholder="e.g. laptops"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Availability (Stock)</label>
          <input
            type="number"
            name="availability"
            value={form.availability}
            onChange={handleChange}
            className="bg-zinc-800 px-4 py-2 rounded-lg"
            required
          />
        </div>

        {/* Warranty */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Warranty (Months)</label>
          <input
            type="number"
            name="warranty"
            value={form.warranty}
            onChange={handleChange}
            className="bg-zinc-800 px-4 py-2 rounded-lg"
            placeholder="e.g. 12, 24, etc."
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="bg-zinc-800 px-4 py-2 rounded-lg w-full"
            placeholder="Write product description..."
            required
          />
        </div>

        {/* Features */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Features</label>
          <textarea
            name="features"
            value={form.features}
            onChange={handleChange}
            rows="3"
            className="bg-zinc-800 px-4 py-2 rounded-lg w-full"
            placeholder="Comma separated features"
            required
          />
        </div>
        {/* Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isUsed"
            checked={form.isUsed}
            onChange={handleChange}
            className="accent-red-500 scale-125"
          />
          <label className="text-sm text-zinc-400">Used product</label>
        </div>
        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Cover Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="cursor-pointer rounded-lg text-sm text-[10px] text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-red-600 file:px-2 file:py-2 file:font-semibold file:text-red-50 hover:file:brightness-105"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400">Images</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            multiple
            className="cursor-pointer rounded-lg text-sm text-[10px] text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-red-600 file:px-2 file:py-2 file:font-semibold file:text-red-50 hover:file:brightness-105"
          />
        </div>

        {/* Submit */}
        <div className="col-span-full">
          <Button type="submit" variant="primary" className="w-full mt-4">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductCreate;
