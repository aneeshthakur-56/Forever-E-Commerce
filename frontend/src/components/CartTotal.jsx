import { useShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, deliveryFee, cartTotal } = useShopContext();

  const total = cartTotal === 0 ? 0 : cartTotal + deliveryFee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART "} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {cartTotal.toFixed(2)}
          </p>
        </div>
        <hr />

        {/* Shipping */}
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{cartTotal === 0 ? "Free" : `${currency}${deliveryFee}`}</p>
        </div>
        <hr />

        {/* Total */}
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {total.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
