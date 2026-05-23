import { useShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    cartItems,
    currency,
    updateQuantity,
    removeFromCart,
    navigate,
    cartCount,
  } = useShopContext();

  return (
    <div className="border-t pt-14">
      {/* Title */}
      <div className="text-2xl mb-3">
        <Title text1={"YOUR "} text2={"CART"} />
      </div>

      {/* Cart Items */}
      <div>
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">
            Your cart is empty.
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.itemId}_${item.size}`}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img
                  src={item.product.image[0]}
                  className="w-16 sm:w-20"
                  alt={item.product.name}
                />
                <div>
                  <p className="text-sm sm:text-lg font-medium">
                    {item.product.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="text-sm font-medium">
                      {currency}
                      {item.product.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-sm">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-1 sm:gap-2 border w-max px-1 sm:px-2 py-1 rounded border-gray-300">
                <button
                  onClick={() =>
                    updateQuantity(item.itemId, item.size, item.quantity - 1)
                  }
                  className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center font-medium text-gray-500 hover:bg-gray-100 hover:text-black rounded transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 sm:w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.itemId, item.size, item.quantity + 1)
                  }
                  className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center font-medium text-gray-500 hover:bg-gray-100 hover:text-black rounded transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <img
                src={assets.bin_icon}
                onClick={() => removeFromCart(item.itemId, item.size)}
                className="w-4 sm:w-5 cursor-pointer"
                alt="remove"
              />
            </div>
          ))
        )}
      </div>
      {cartCount !== 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                className="bg-black text-white text-sm my-8 px-8 py-3"
                onClick={() => navigate("/place-order")}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
