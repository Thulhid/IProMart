"use client";

import {useEffect, useState} from "react";
import Button from "@/app/_components/Button";
import {deleteProduct, filterProducts, getCategories, getProducts,} from "@/app/_lib/product-service";
import toast from "react-hot-toast";
import Pagination from "@/app/_components/Pagination";
import {useRouter, useSearchParams} from "next/navigation";
import SearchPanel from "@/app/_components/SearchPanel";
import HeaderWrapper from "@/app/_components/HeaderWrapper";
import NavBar from "@/app/_components/NavBar";
import AdminProductBox from "@/app/_components/AdminProductBox";
import AuthPanel from "@/app/_components/AuthPanel";

export default function AdminProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState();
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState();
    const [editingId, setEditingId] = useState(null);

    const page = Number(searchParams.get("page") || 1);
    const name = searchParams.get("name");
    const category = searchParams.get("category") || "";

    useEffect(() => {
        (async function () {
            try {
                const {categories} = await getCategories("products");
                setCategories(categories);

                const res =
                    name || category
                        ? await filterProducts(name, category, page)
                        : await getProducts(page);

                setProducts(res.data?.data);
                setTotal(res.total);
            } catch (err) {
                toast.error(err.message);
            }
        })();
    }, [page, name, category]);

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
            prev.map((p) => (p._id === id ? {...p, ...updatedData} : p))
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
        <div className="px-4 sm:px-6 md:px-10 py-6 max-w-screen-2xl mx-auto text-zinc-300 mt-20">
            <div className="flex justify-between items-center relative"></div>
            <HeaderWrapper
                leftContent={<SearchPanel categories={categories}/>}
                rightContent={
                    <div className="hidden xl:flex gap-4">
                        {/* <Button
              variant="header"
              onClick={handleAdd}
              configStyles="hidden xl:flex"
            >
              <HiPlus size={15} strokeWidth={1} className="text-zinc-200" />{" "}
              <span>Add Product</span>
            </Button> */}

                        <NavBar/>
                        <AuthPanel/>

                    </div>
                }
            />
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
            <Pagination count={total}/>
        </div>
    );
}
