// "use client";

// import Button from "@/app/_components/Button";
// import SparkEffect from "@/app/_components/SparkEffect";
// import {
//   formatCurrency,
//   handleRemoveGuestProduct,
//   uiCategoryFormat,
// } from "@/app/_utils/helper";
// import Image from "next/image";
// import {
//   HiMiniXMark,
//   HiMinusSmall,
//   HiPlusSmall,
//   HiXMark,
// } from "react-icons/hi2";
// import { GiCrossMark } from "react-icons/gi";
// import { useQuantity } from "@/app/_hooks/useQuantity";

// function CartProduct({ product, onQuantityChange, onRemove }) {
//   const {
//     currentQuantity,
//     handleDecCurrentQuantity,
//     handleIncCurrentQuantity,
//   } = useQuantity(product, onQuantityChange);

//   return (
//     <div
//       key={product._id}
//       className="bg-zinc-900 p-4 rounded-xl shadow-md flex gap-4 items-start"
//     >
//       <Button variant="close" configStyles=" ">
//         <HiXMark
//           size={20}
//           strokeWidth={1}
//           onClick={() => onRemove(product._id)}
//         />{" "}
//       </Button>
//       <div className="relative w-28 h-28 shrink-0 rounded overflow-hidden">
//         <Image
//           src={product.imageCover}
//           alt={product.name}
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       <div className="flex-1 text-zinc-300">
//         <Button link={`/products/${product.slug}`}>
//           <h2 className="text-xl font-medium">{product.name}</h2>
//         </Button>
//         <p className="text-zinc-400 mb-2 text-sm">
//           {uiCategoryFormat(product.category)}
//         </p>
//         <div className="text-lg font-semibold inline-flex items-center gap-1">
//           {product.priceDiscount
//             ? formatCurrency(product.price - product.priceDiscount)
//             : formatCurrency(product.price)}{" "}
//           <SparkEffect>
//             <GiCrossMark size={22} />
//           </SparkEffect>{" "}
//           {product.quantity}
//         </div>
//         <div className="mt-2">
//           <div>
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="updateQuantity"
//                 onClick={handleDecCurrentQuantity}
//               >
//                 <HiMinusSmall
//                   className=" text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
//                   size={25}
//                   strokeWidth={1}
//                 />
//               </Button>
//               <span className="text-zinc-50 min-w-8 text-center">
//                 {currentQuantity}
//               </span>
//               <Button
//                 variant="updateQuantity"
//                 onClick={handleIncCurrentQuantity}
//               >
//                 <HiPlusSmall
//                   className=" text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
//                   size={25}
//                   strokeWidth={1}
//                 />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CartProduct;
// //          <SparkEffect>{`x ${product.quantity}`}</SparkEffect>

"use client";

import Button from "@/app/_components/Button";
import SparkEffect from "@/app/_components/SparkEffect";
import { formatCurrency, uiCategoryFormat } from "@/app/_utils/helper";
import Image from "next/image";
import { HiMinusSmall, HiPlusSmall, HiXMark } from "react-icons/hi2";
import { GiCrossMark } from "react-icons/gi";
import { useQuantity } from "@/app/_hooks/useQuantity";

function CartProduct({ product, onQuantityChange, onRemove }) {
  //await new Promise((resolve) => setTimeout(resolve, 2000)); // NOTE: TESTING

  const {
    currentQuantity,
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
          {uiCategoryFormat(product.category)}
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
            <Button variant="updateQuantity" onClick={handleDecCurrentQuantity}>
              <HiMinusSmall
                className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
                size={22}
                strokeWidth={1}
              />
            </Button>
            <span className="w-8 text-center text-zinc-50">
              {currentQuantity}
            </span>
            <Button variant="updateQuantity" onClick={handleIncCurrentQuantity}>
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
