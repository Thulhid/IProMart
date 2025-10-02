import CartProduct from "@/app/_components/CartProduct";

function CartProductBox({ cart, onQuantityChange, onRemove }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 xl:col-span-2">
      {cart?.map((product) => (
        <CartProduct
          product={product}
          key={product._id}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default CartProductBox;
