"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { HiOutlineChevronLeft } from "react-icons/hi2";

import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";

import { getProductById, updateProductById } from "@/app/_lib/product-service";
import { getCategories } from "@/app/_lib/product-service"; // You already have this
import { updateProductSchema } from "@/app/_utils/validationSchema";

export default function UpdateProductPage() {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(updateProductSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    (async () => {
      try {
        const productRes = await getProductById(id);
        const { categories } = await getCategories("products");
        const doc = productRes.data.data;

        setProduct(doc);
        setCategories(categories);

        reset({
          name: doc.name,
          price: doc.price,
          priceDiscount: doc.priceDiscount,
          category: doc.category,
          availability: doc.availability,
          warranty: doc.warranty,
          description: doc.description,
          features: doc.features?.join(", "),
          isUsed: doc.isUsed,
        });
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const changed = {}; // for debug if needed

      // Compare and add only changed fields
      if (data.name !== product.name) {
        formData.append("name", data.name);
        changed.name = data.name;
      }

      if (+data.price !== +product.price) {
        formData.append("price", data.price);
        changed.price = data.price;
      }

      if (+data.priceDiscount !== +product.priceDiscount) {
        formData.append("priceDiscount", data.priceDiscount || 0);
        changed.priceDiscount = data.priceDiscount;
      }

      if (data.category !== product.category) {
        formData.append("category", data.category);
        changed.category = data.category;
      }

      if (+data.availability !== +product.availability) {
        formData.append("availability", data.availability);
        changed.availability = data.availability;
      }

      if (+data.warranty !== +product.warranty) {
        formData.append("warranty", data.warranty || 0);
        changed.warranty = data.warranty;
      }

      if (data.description !== product.description) {
        formData.append("description", data.description);
        changed.description = data.description;
      }

      const newFeatures = data.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const oldFeatures = product.features || [];
      const featuresChanged =
        newFeatures.length !== oldFeatures.length ||
        newFeatures.some((f, i) => f !== oldFeatures[i]);

      if (featuresChanged) {
        for (let feature of newFeatures) {
          formData.append("features", feature);
        }
        changed.features = newFeatures;
      }

      if (!!data.isUsed !== !!product.isUsed) {
        formData.append("isUsed", data.isUsed ? "true" : "false");
        changed.isUsed = data.isUsed;
      }

      if (data.imageCover?.[0]) {
        formData.append("imageCover", data.imageCover[0]);
        changed.imageCover = "changed";
      }

      if (data.images?.length > 0) {
        for (let img of data.images) {
          formData.append("images", img);
        }
        changed.images = "changed";
      }

      // Debug output
      if (Object.keys(changed).length === 0) {
        toast.error("No changes detected");
        return;
      }

      console.log("Changed fields:", changed);

      // Log FormData entries

      const res = await updateProductById(id, formData);
      setProduct(res.data.data);
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!product) return <p className="text-zinc-400">Loading product...</p>;

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
        <h1 className="text-3xl font-semibold text-zinc-300">Update Product</h1>
      </div>

      <ContainerBox>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {/* --- NAME --- */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Product Name</label>
              <input {...register("name")} className="input" />
              <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            {/* --- PRICE --- */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Price (Rs)</label>
              <input type="number" {...register("price")} className="input" />
              <p className="text-sm text-red-500">{errors.price?.message}</p>
            </div>

            {/* --- DISCOUNT --- */}
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

            {/* --- CATEGORY --- */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Category</label>
              <select
                {...register("category")}
                className="rounded-md bg-zinc-800 px-4 py-2 text-zinc-300 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="text-sm text-red-500">{errors.category?.message}</p>
            </div>

            {/* --- AVAILABILITY --- */}
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

            {/* --- WARRANTY --- */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Warranty (Months)</label>
              <input
                type="number"
                {...register("warranty")}
                className="input"
              />
              <p className="text-sm text-red-500">{errors.warranty?.message}</p>
            </div>

            {/* --- DESCRIPTION --- */}
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

            {/* --- FEATURES --- */}
            <div className="col-span-full flex flex-col gap-1">
              <label className="text-sm text-zinc-400">
                Features (comma separated)
              </label>
              <textarea
                rows="2"
                {...register("features")}
                className="input"
              ></textarea>
              <p className="text-sm text-red-500">{errors.features?.message}</p>
            </div>

            {/* --- USED --- */}
            <div className="col-span-full flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isUsed")}
                className="scale-125 accent-blue-500"
              />
              <label className="text-sm text-zinc-400">Used Product</label>
            </div>

            {/* --- COVER IMAGE --- */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                {...register("imageCover")}
                className="rounded-md bg-zinc-800 text-zinc-400 file:rounded file:bg-blue-600 file:px-3 file:py-1 file:font-semibold file:text-white"
              />
              <p className="text-sm text-red-500">
                {errors.imageCover?.message}
              </p>
            </div>

            {/* --- IMAGES --- */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                {...register("images")}
                className="rounded-md bg-zinc-800 text-zinc-400 file:rounded file:bg-blue-600 file:px-3 file:py-1 file:font-semibold file:text-white"
              />
              <p className="text-sm text-red-500">{errors.images?.message}</p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              buttonType="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
              configStyles="ml-auto"
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </ContainerBox>
    </div>
  );
}
