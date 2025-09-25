"use client";
import Button from "@/app/_components/Button";
import { CartContext } from "@/app/_context/CartContext";
import { useContext } from "react";
import { HiMinus, HiMinusSmall, HiPlus, HiPlusSmall } from "react-icons/hi2";

function UpdateProductQuantity({ isCartPage }) {
  const [currentQuantity, setCurrentQuantity] = useState(1);
  function handleDecCurrentQuantity() {
    if (currentQuantity <= 1) {
      setCurrentQuantity(1);
      return;
    }

    setCurrentQuantity((cur) => cur - 1);
  }
  function handleIncCurrentQuantity() {
    setCurrentQuantity((cur) => cur + 1);
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="updateQuantity" onClick={handleDecCurrentQuantity}>
        <HiMinusSmall
          className=" text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
          size={25}
          strokeWidth={1}
        />
      </Button>
      <span className="text-zinc-50 min-w-8 text-center">
        {currentQuantity}
      </span>
      <Button variant="updateQuantity" onClick={handleIncCurrentQuantity}>
        <HiPlusSmall
          className=" text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
          size={25}
          strokeWidth={1}
        />
      </Button>
    </div>
  );
}

export default UpdateProductQuantity;
