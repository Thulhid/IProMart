"use client";

import Button from "@/app/_components/Button";
import { useQuantity } from "@/app/_hooks/useQuantity";
import {
  handleSaveGustProduct,
  isProductInGuestCart,
} from "@/app/_utils/helper";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMinusSmall, HiPlusSmall, HiShoppingBag } from "react-icons/hi2";
import { createOrUpdateCart } from "@/app/_lib/cart-service";
import { getCustomer } from "@/app/_lib/customer-service"; // ✅ your getCustomer API
import Modal from "@/app/_components/Modal";
import ConfirmBuyNow from "@/app/_components/ConfirmBuyNow";

function ProductDetailsActions({ product }) {
  const [isCart, setIsCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    currentQuantity,
    handleDecCurrentQuantity,
    handleIncCurrentQuantity,
  } = useQuantity(product);

  useEffect(() => {
    async function checkUser() {
      try {
        const user = await getCustomer();
        if (!user) return;
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false); // Not logged in
      }
    }

    checkUser();
    if (!isLoggedIn) {
      setIsCart(isProductInGuestCart(product._id));
    }
  }, [product._id, isLoggedIn]);

  async function handleAddToCart() {
    try {
      if (isLoggedIn) {
        await createOrUpdateCart(product._id, currentQuantity);
        handleSaveGustProduct(currentQuantity, product);

        toast.success("Added to your cart");
      } else {
        handleSaveGustProduct(currentQuantity, product);
        toast.success("Added to guest cart");
      }
      setIsCart(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  }

  return (
    <>
      {product.availability !== 0 && (
        <>
          <div>
            <div className="flex items-center gap-4">
              <Button
                variant="updateQuantity"
                onClick={() => {
                  handleDecCurrentQuantity();
                  setIsCart(false);
                }}
              >
                <HiMinusSmall
                  className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
                  size={25}
                  strokeWidth={1}
                />
              </Button>
              <span className="min-w-8 text-center text-zinc-50">
                {currentQuantity}
              </span>
              <Button
                variant="updateQuantity"
                onClick={() => {
                  handleIncCurrentQuantity();
                  setIsCart(false);
                }}
              >
                <HiPlusSmall
                  className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
                  size={25}
                  strokeWidth={1}
                />
              </Button>
            </div>
          </div>
          <div className="flex gap-5 transition-all duration-300">
            {/* <Button variant="buy">Buy Now</Button> */}
            <Modal>
              <Modal.Open opens="product-buy">
                <Button variant="buy">Buy now</Button>
              </Modal.Open>
              <Modal.Window name="product-buy">
                <ConfirmBuyNow
                  product={product}
                  currentQuantity={currentQuantity}
                />
              </Modal.Window>
            </Modal>

            {isCart ? (
              <Button link="/cart" variant="cart">
                Open
                <HiShoppingBag size={22} />
              </Button>
            ) : (
              <Button variant="cart" onClick={handleAddToCart}>
                Add to
                <HiShoppingBag size={22} />
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ProductDetailsActions;
