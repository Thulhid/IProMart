import { Suspense } from "react";

import AuthPanel from "@/app/_components/AuthPanel";
import BottomNavigationBar from "@/app/_components/BottomNavigationBar";
import HeaderWrapper from "@/app/_components/HeaderWrapper";
import NavBar from "@/app/_components/NavBar";
import SearchPanel from "@/app/_components/SearchPanel";
import Slider from "@/app/_components/Slider";

import { getCategories } from "@/app/_lib/category-service";
import { getHeroSlides } from "@/app/_lib/heroSlide-service";

// NOTE: we will render this inside Suspense
import ProductsAndPagination from "../_components/ProductsAndPagination";
import Loading from "./loading";

export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};
  const resCategories = await getCategories();
  const {
    data: { data: SlideArray },
  } = await getHeroSlides();

  const orderedSlides = SlideArray.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="mt-25 w-full">
      <HeaderWrapper
        leftContent={<SearchPanel categories={resCategories.data.data} />}
        rightContent={
          <div className="hidden gap-4 xl:flex">
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

      <Suspense key={JSON.stringify(params)} fallback={<Loading />}>
        <ProductsAndPagination searchParams={params} />
        <BottomNavigationBar categories={resCategories.data.data} />
      </Suspense>
    </div>
  );
}
