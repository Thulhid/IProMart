import AuthPanel from "@/app/_components/AuthPanel";
import BottomNavigationBar from "@/app/_components/BottomNavigationBar";
import HeaderWrapper from "@/app/_components/HeaderWrapper";
import NavBar from "@/app/_components/NavBar";
import Pagination from "@/app/_components/Pagination";
import ProductBox from "@/app/_components/ProductBox";
import ProductOperations from "@/app/_components/ProductOperations";
import SearchPanel from "@/app/_components/SearchPanel";
import Slider from "@/app/_components/Slider";
import Spinner from "@/app/_components/Spinner";
import { getHeroSlides } from "@/app/_lib/heroSlide-service";
import {
  getProducts,
  filterProducts,
  getCategories,
} from "@/app/_lib/product-service";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const name = params?.name;
  const category = params?.category;
  const used = params?.used;
  const sortBy = params?.sort;
  const page = Number(params?.page || 1);

  const { categories } = await getCategories("products");
  const {
    data: { data: SlideArray },
  } = await getHeroSlides();

  const orderedSlides = SlideArray.slice() // make a shallow copy to avoid mutating original
    .sort((a, b) => a.order - b.order); // ascending order
  let products;

  const sort =
    (sortBy === "name-asc" && "name") ||
    (sortBy === "name-desc" && "-name") ||
    (sortBy === "finalPrice-asc" && "finalPrice") ||
    (sortBy === "finalPrice-desc" && "-finalPrice") ||
    undefined;

  const isUsed =
    used === "used" ? true : used === "brand-new" ? false : undefined; // if "all" or not defined, skip filtering
  if (name || category || typeof isUsed === "boolean" || sort) {
    products = await filterProducts(name, category, page, isUsed, sort);
  } else {
    products = await getProducts(page);
  }

  return (
    <div className="mt-25 w-full">
      <HeaderWrapper
        leftContent={<SearchPanel categories={categories} />}
        rightContent={
          <div className="hidden xl:flex gap-4">
            <NavBar />
            <AuthPanel />
          </div>
        }
      />
      <Slider
        slides={orderedSlides}
        autoSlide
        containerStyles="pb-15"
        autoSlideInterval={4000}
      />

      <ProductBox products={products.data} />
      <Pagination count={products.total} />
      <BottomNavigationBar categories={categories} />
    </div>
  );
}
