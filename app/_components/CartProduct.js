"use client";

import Button from "@/app/_components/Button";
import SparkEffect from "@/app/_components/SparkEffect";
import { formatCurrency } from "@/app/_utils/helper";
import Image from "next/image";
import { HiMinusSmall, HiPlusSmall, HiXMark } from "react-icons/hi2";
import { GiCrossMark } from "react-icons/gi";
import { useQuantity } from "@/app/_hooks/useQuantity";

function CartProduct({ product, onQuantityChange, onRemove }) {
  //await new Promise((resolve) => setTimeout(resolve, 2000)); // NOTE: TESTING

  const {
    currentQuantity,
    isUpdating,
    handleDecCurrentQuantity,
    handleIncCurrentQuantity,
  } = useQuantity(product, onQuantityChange);

  return (
    <div
      key={product._id}
      className="flex flex-col items-start gap-4 rounded-xl bg-zinc-900 p-4 shadow-md sm:flex-row sm:items-center sm:p-5"
    >
      <div className="self-end sm:self-start">
        <Button variant="close">
          <HiXMark
            size={20}
            strokeWidth={1}
            onClick={() => onRemove(product._id)}
          />
        </Button>
      </div>

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded sm:h-28 sm:w-28">
        <Image
          src={product.imageCover}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full flex-1 text-zinc-300">
        <Button link={`/products/${product.slug}`}>
          <h2 className="text-lg font-medium sm:text-xl">{product.name}</h2>
        </Button>
        <p className="mb-2 text-sm text-zinc-400">
          {/* {uiCategoryFormat(product.category)} */}
        </p>
        <div className="flex items-center gap-1 text-base font-semibold sm:text-lg">
          {product.priceDiscount
            ? formatCurrency(product.price - product.priceDiscount)
            : formatCurrency(product.price)}
          <SparkEffect>
            <GiCrossMark size={20} />
          </SparkEffect>
          {product.quantity}
        </div>

        <div className="mt-3 sm:mt-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="updateQuantity"
              onClick={handleDecCurrentQuantity}
              disabled={isUpdating}
            >
              <HiMinusSmall
                className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
                size={22}
                strokeWidth={1}
              />
            </Button>
            <span className="w-8 text-center text-zinc-50">
              {currentQuantity}
            </span>
            <Button
              variant="updateQuantity"
              onClick={handleIncCurrentQuantity}
              disabled={isUpdating}
            >
              <HiPlusSmall
                className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
                size={22}
                strokeWidth={1}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
