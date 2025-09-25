"use client";

import { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { getSetting } from "@/app/_lib/setting-service";
import { formatCurrency } from "@/app/_utils/helper";
import PayHereButton from "@/app/_components/PayHereButton";

function ConfirmBuyNow({ product, currentQuantity }) {
  const [shippingFee, setShippingFee] = useState(null);
  const [includingShipping, setIncludingShipping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const res = await getSetting();
        setShippingFee(res.data.data.shippingFee);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-zinc-900 px-6 py-5 space-y-4 max-w-md w-full">
      <h3 className="text-lg sm:text-xl font-semibold text-zinc-100">
        Confirm Payment Option
      </h3>

      <div className="flex items-start gap-3 text-zinc-200">
        <input
          type="checkbox"
          id="includeShipping"
          checked={includingShipping}
          onChange={() => setIncludingShipping((prev) => !prev)}
          className="mt-1 accent-red-600 h-5 w-5"
        />
        <label htmlFor="includeShipping" className="cursor-pointer">
          Include Shipping Fee ({formatCurrency(shippingFee)})
        </label>
      </div>

      {!includingShipping && (
        <div className="flex items-start gap-2 text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-600 rounded-lg p-3">
          <HiOutlineInformationCircle
            className="min-w-[20px] mt-0.5"
            size={20}
          />
          <span>
            Shipping fee ({formatCurrency(shippingFee)}) will be collected when
            your order is delivered
          </span>
        </div>
      )}
      <PayHereButton
        variant="primary"
        isLoading={isLoading}
        includingShipping={includingShipping}
        item={product}
        quantity={currentQuantity}
        configStyles="ml-auto !text-base"
      >
        Confirm
      </PayHereButton>

      <div className="text-zinc-300 text-base pt-1 border-t border-zinc-700 mt-4">
        <p>
          Total payable now:{" "}
          <span className="font-medium text-white">
            {includingShipping
              ? formatCurrency(
                  product.finalPrice * currentQuantity + shippingFee
                )
              : formatCurrency(product.finalPrice * currentQuantity)}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ConfirmBuyNow;
