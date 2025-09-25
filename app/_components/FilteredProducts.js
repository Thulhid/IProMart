// app/_components/FilteredProducts.jsx
import ProductBox from "@/app/_components/ProductBox";
import Pagination from "@/app/_components/Pagination";
import { filterProducts, getProducts } from "@/app/_lib/product-service";

export default async function FilteredProducts({ searchParams }) {
  const name = searchParams?.name;
  const category = searchParams?.category;
  const used = searchParams?.used;
  const sortBy = searchParams?.sort;
  const page = Number(searchParams?.page || 1);

  const sort =
    (sortBy === "name-asc" && "name") ||
    (sortBy === "name-desc" && "-name") ||
    (sortBy === "finalPrice-asc" && "finalPrice") ||
    (sortBy === "finalPrice-desc" && "-finalPrice") ||
    undefined;

  const isUsed =
    used === "used" ? true : used === "brand-new" ? false : undefined;

  let products;
  if (name || category || typeof isUsed === "boolean" || sort) {
    products = await filterProducts(name, category, page, isUsed, sort);
  } else {
    products = await getProducts(page);
  }

  return (
    <>
      <ProductBox products={products.data} />
      <Pagination count={products.total} />
    </>
  );
}
