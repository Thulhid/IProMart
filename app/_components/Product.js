import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/app/_utils/helper";

function Product({ product, isHoverScale = true, isPreBuilt = false }) {
  const hasDiscount = Boolean(product.priceDiscount);

  return (
    <div
      className={`flex w-full max-w-xs flex-col rounded-lg border border-zinc-600 bg-zinc-900 shadow-lg transition-all ${isHoverScale ? "hover:scale-105" : ""} hover:shadow-xs hover:shadow-zinc-400 sm:max-w-sm md:max-w-md lg:max-w-xs`}
    >
      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between px-4 pb-3 md:pb-5">
        <Link href={`/products/${product.slug}`} key={product._id}>
          <Image
            className="h-30 w-full rounded-t-lg object-contain sm:h-50 md:h-60"
            src={product.imageCover}
            alt="product image"
            width={400}
            height={400}
          />
          {/* Name */}
          <h5 className="mt-2 line-clamp-2 text-xs font-semibold tracking-tight text-zinc-100 sm:text-sm md:text-base">
            {product.name}
          </h5>
          {!isPreBuilt && (
            <p className="text-sm text-zinc-300">
              {product.isUsed ? "Used" : "Brand New"}
            </p>
          )}

          {/* Prices */}
          <div className="mt-1 min-h-[3.2rem] text-xs text-zinc-400 sm:mt-2 md:min-h-[3rem] md:text-sm">
            {hasDiscount ? (
              <>
                <div>
                  Regular price:{" "}
                  <span className="line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="text-xs font-semibold text-green-500 sm:text-sm md:text-base">
                  Discount: {formatCurrency(product.priceDiscount)}
                </div>
              </>
            ) : (
              <div className="opacity-0">placeholder</div>
            )}
          </div>

          {/* Final Price */}
          <span className="block py-2 text-base font-bold text-zinc-200 sm:text-lg md:text-xl">
            {formatCurrency(product.finalPrice)}
          </span>
        </Link>

        {/* Button */}
      </div>
    </div>
  );
}

export default Product;
