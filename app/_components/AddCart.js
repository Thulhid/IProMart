"use client";

import Button from "@/app/_components/Button";
import { CartContext } from "@/app/_context/CartContext";
import { useContext } from "react";

function AddCart({ product }) {
  // const { setSaveCartProduct } = useContext(CartContext);
  return (
    <Button
      variant="cart"
      onClick={
        () => {}
        //setSaveCartProduct(product)
      }
    >
      Add Cart
    </Button>
  );
}

export default AddCart;
