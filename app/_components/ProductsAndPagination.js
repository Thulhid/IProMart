import ProductBox from "@/app/_components/ProductBox";
import Pagination from "@/app/_components/Pagination";
import { getProducts, filterProducts } from "@/app/_lib/product-service";

export default async function ProductsAndPagination({ searchParams }) {
  const name = (await searchParams)?.name;
  const category = (await searchParams)?.category;
  const subcategory = (await searchParams)?.subcategory;
  const used = (await searchParams)?.used;
  const sortBy = (await searchParams)?.sort;
  const page = Number((await searchParams)?.page || 1);

  const sort =
    (sortBy === "name-asc" && "name") ||
    (sortBy === "name-desc" && "-name") ||
    (sortBy === "finalPrice-asc" && "finalPrice") ||
    (sortBy === "finalPrice-desc" && "-finalPrice") ||
    undefined;

  const isUsed =
    used === "used" ? true : used === "brand-new" ? false : undefined;

  const shouldFilter =
    !!name ||
    !!category ||
    !!subcategory ||
    typeof isUsed === "boolean" ||
    !!sort;

  const products = shouldFilter
    ? await filterProducts(name, category, page, subcategory, isUsed, sort)
    : await getProducts(page);

  return (
    <>
      <ProductBox products={products.data} searchParams={searchParams} />
      <Pagination count={products.total} />
    </>
  );
}
