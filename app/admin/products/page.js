"use client";

import { useEffect, useState } from "react";
import Button from "@/app/_components/Button";
import {
  deleteProduct,
  filterProducts,
  getProducts,
} from "@/app/_lib/product-service";
import toast from "react-hot-toast";
import Pagination from "@/app/_components/Pagination";
import { useSearchParams } from "next/navigation";
import SearchPanel from "@/app/_components/SearchPanel";
import HeaderWrapper from "@/app/_components/HeaderWrapper";
import NavBar from "@/app/_components/NavBar";
import AdminProductBox from "@/app/_components/AdminProductBox";
import AuthPanel from "@/app/_components/AuthPanel";
import { getCategories } from "@/app/_lib/category-service";
import ProductOperations from "@/app/_components/ProductOperations";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState();
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState();
  const [editingId, setEditingId] = useState(null);

  const page = Number(searchParams.get("page") || 1);
  const name = searchParams.get("name");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const sort = searchParams.get("sort");
  const used = searchParams.get("used");

  const isUsed =
    used === "used" ? true : used === "brand-new" ? false : undefined;

  useEffect(() => {
    (async function () {
      try {
        const resCategories = await getCategories();
        setCategories(resCategories.data.data);

        const res =
          name || category || subcategory || isUsed || sort
            ? await filterProducts(
                name,
                category,
                page,
                subcategory,
                isUsed,
                sort,
              )
            : await getProducts(page);

        setProducts(res.data?.data);
        setTotal(res.total);
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, [page, name, category, subcategory, sort, isUsed]);

  //   function handleSearch(queryParams) {
  //     const params = new URLSearchParams(queryParams);
  //     router.push(`?${params.toString()}`);
  //   }

  function handleAdd() {
    const newProduct = {
      _id: Date.now().toString(),
      name: "New Product",
      price: 0,
      priceDiscount: 0,
      category: "laptops",
      availability: 0,
      imageCover: "/placeholder.jpg",
      isUsed: false,
    };
    setProducts([newProduct, ...(products || [])]);
    setEditingId(newProduct._id);
  }

  function handleSave(id, updatedData) {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updatedData } : p)),
    );
    setEditingId(null);
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      const res = await getProducts(page);
      toast.success("Product delete successful");
      setProducts(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-[1440px] px-4 py-6 text-zinc-300 sm:px-6 md:px-10">
      <div className="relative flex items-center justify-between"></div>
      <HeaderWrapper
        leftContent={<SearchPanel categories={categories} />}
        rightContent={
          <div className="hidden gap-4 xl:flex">
            <NavBar />
            <AuthPanel />
          </div>
        }
      />
      <ProductOperations />

      <Button
        link="/admin/products/create-product"
        variant="primary"
        configStyles="ml-auto w-fit"
      >
        + Add Product
      </Button>
      <AdminProductBox
        products={products}
        editingId={editingId}
        onEditingId={setEditingId}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Pagination count={total} />
    </div>
  );
}
