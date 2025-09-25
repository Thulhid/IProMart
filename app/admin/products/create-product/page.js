"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import toast from "react-hot-toast";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import { createProduct, getCategories } from "@/app/_lib/product-service";
import { createProductSchema } from "@/app/_utils/validationSchema";

export default function CreateProductPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { categories } = await getCategories("products"); // assuming model is "products"
        setCategories(categories); // expecting: [{ category: "laptops" }, { category: "phones" }]
      } catch (err) {
        toast.error("Failed to load categories");
      }
    }

    fetchCategories();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(createProductSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      const featuresArray = data.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      console.log(featuresArray);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("priceDiscount", data.priceDiscount || 0);
      formData.append("category", data.category);
      formData.append("availability", data.availability);
      formData.append("warranty", data.warranty || 0);
      formData.append("description", data.description);
      formData.append("isUsed", data.isUsed ? "true" : "false");
      // formData.append("features", featuresArray);

      // Cover image
      const coverFile = data.imageCover?.[0];
      if (coverFile) {
        formData.append("imageCover", coverFile);
      }

      // Multiple images
      const images = data.images || [];
      for (let img of images) {
        formData.append("images", img);
      }

      // const features = data.images || [];
      for (let feature of featuresArray) {
        formData.append("features", feature);
      }

      await createProduct(formData);
      toast.success("Product created successfully");
      reset(); // Reset form
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">
          Create New Product
        </h1>
      </div>

      <ContainerBox>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Product Name</label>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter product name"
                className="input"
              />
              <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Price (Rs)</label>
              <input type="number" {...register("price")} className="input" />
              <p className="text-sm text-red-500">{errors.price?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Discount (Rs)</label>
              <input
                type="number"
                {...register("priceDiscount")}
                className="input"
              />
              <p className="text-sm text-red-500">
                {errors.priceDiscount?.message}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Category</label>
              <select
                {...register("category")}
                className="relative z-10 rounded-md bg-zinc-800 px-4 py-2 text-zinc-300 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="text-sm text-red-500">{errors.category?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Availability</label>
              <input
                type="number"
                {...register("availability")}
                className="input"
              />
              <p className="text-sm text-red-500">
                {errors.availability?.message}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Warranty (Months)</label>
              <input
                type="number"
                {...register("warranty")}
                className="input"
              />
              <p className="text-sm text-red-500">{errors.warranty?.message}</p>
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Description</label>
              <textarea
                rows="3"
                {...register("description")}
                className="input"
              ></textarea>
              <p className="text-sm text-red-500">
                {errors.description?.message}
              </p>
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <label className="text-sm text-zinc-400">
                Features (comma separated)
              </label>
              <textarea
                rows="2"
                {...register("features")}
                className="input"
                placeholder="ex: 8 GB DDR4,Windows 11,.."
              ></textarea>
              <p className="text-sm text-red-500">{errors.features?.message}</p>
            </div>

            <div className="col-span-full flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isUsed")}
                className="scale-125 accent-blue-500"
              />
              <label className="text-sm text-zinc-400">Used Product</label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                className="rounded-lg bg-zinc-800 text-sm text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-600 file:px-2 file:py-2 file:font-semibold file:text-red-50 hover:file:brightness-105"
                {...register("imageCover")}
              />
              <p className="text-sm text-red-500">
                {errors.imageCover?.message}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="rounded-lg bg-zinc-800 text-sm text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-600 file:px-2 file:py-2 file:font-semibold file:text-red-50 hover:file:brightness-105"
                {...register("images")}
              />
              <p className="text-sm text-red-500">{errors.images?.message}</p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
              configStyles="ml-auto"
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </ContainerBox>
    </div>
  );
}
