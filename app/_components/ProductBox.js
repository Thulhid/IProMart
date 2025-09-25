import Button from "@/app/_components/Button";
import Empty from "@/app/_components/Empty";
import Product from "@/app/_components/Product";
import ProductOperations from "@/app/_components/ProductOperations";
import { getProducts } from "@/app/_lib/product-service";
import Link from "next/link";

async function ProductBox({ products }) {
  return (
    <div
      className=" max-w-7xl
        mx-auto
        px-4
        py-5"
    >
      <ProductOperations />

      {products.data.length === 0 ? (
        <Empty resourceName="Products" />
      ) : (
        <div
          className="
        grid       
        grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        2xl:grid-cols-5
        xl:gap-x-6
        xl:gap-y-10
        gap-4
        place-items-center 
       

      "
        >
          {products.data.map((product) => (
            <Product product={product} key={product._id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductBox;
