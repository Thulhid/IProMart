import Empty from "@/app/_components/Empty";
import Product from "@/app/_components/Product";
import ProductOperations from "@/app/_components/ProductOperations";
import SubcategorySelection from "@/app/_components/SubcategorySelection";
import { getCategoryById } from "@/app/_lib/category-service";

async function ProductBox({ searchParams, products }) {
  let subs = [];

  if (searchParams?.category) {
    const category = await getCategoryById(searchParams?.category);
    subs = category.data.data.subcategories;
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <ProductOperations />

      <div className="flex gap-5">
        {subs.length !== 0 && (
          <div className="h-fit rounded-md border border-zinc-600 p-5">
            <SubcategorySelection isVertical={true} />
          </div>
        )}

        {products.data.length === 0 ? (
          <div>
            <Empty resourceName="Products" />
          </div>
        ) : (
          <div
            className={`grid place-items-center gap-4 xl:gap-x-6 xl:gap-y-10 2xl:grid-cols-5 ${subs.length ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}
          >
            {products.data.map((product) => (
              <Product product={product} key={product._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductBox;
