import { useState, useEffect, useRef } from "react";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import { useShopContext } from "../context/ShopContext";
import { toast } from "sonner";
import { makeApiRequest } from "../utils/apiService";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlaceOrder = () => {
  const { clearCart, cartItems, cartTotal, deliveryFee, userData, isAuth, navigate, cartCount, isLoading } = useShopContext();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState("new");
  // Prevents the cartCount === 0 guard from redirecting to /cart after a successful order
  const paymentSucceeded = useRef(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuth) {
        toast.error("Please login to place an order");
        navigate("/login");
      } else if (cartCount === 0 && !paymentSucceeded.current) {
        toast.error("Your cart is empty");
        navigate("/cart");
      }
    }
  }, [isAuth, cartCount, isLoading, navigate]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let finalAddress;
    
    if (selectedAddressId !== "new") {
      finalAddress = userData.addresses.find(a => a._id === selectedAddressId);
    } else {
      const isEmpty = Object.values(formData).some((v) => String(v).trim() === "");
      if (isEmpty) {
        toast.error("Please fill in all delivery details.");
        return;
      }
      finalAddress = formData;
    }
    
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.itemId,
        name: item.product.name,
        image: item.product.image[0],
        price: item.product.price,
        quantity: item.quantity,
        size: item.size
      }));

      const amount = cartTotal + deliveryFee;

      if (paymentMethod === "cod") {
        const response = await makeApiRequest("/api/order/place", "POST", {
          items: orderItems,
          amount: amount,
          address: finalAddress
        });

        if (response?.success) {
          paymentSucceeded.current = true;
          clearCart();
          toast.success("Order placed successfully!");
          navigate("/orders");
        } else {
          toast.error(response?.message || "Failed to place order.");
        }
      } else if (paymentMethod === "razorpay") {
        const response = await makeApiRequest("/api/order/razor", "POST", {
          items: orderItems,
          amount: amount,
          address: finalAddress
        });

        if (response?.success && response.data?.razorpayOrder) {
          const isScriptLoaded = await loadRazorpayScript();
          if (!isScriptLoaded) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
          }

          const dbOrderId = response.data.orderId;

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
            amount: response.data.razorpayOrder.amount,
            currency: response.data.razorpayOrder.currency,
            name: "Forever E-Commerce",
            description: "Order Payment",
            order_id: response.data.razorpayOrder.id,
            handler: async function (rzpResponse) {
              try {
                // Verify payment signature on the backend — this sets payment: true
                const verifyRes = await makeApiRequest("/api/order/verify-razorpay", "POST", {
                  orderId: dbOrderId,
                  razorpay_order_id: rzpResponse.razorpay_order_id,
                  razorpay_payment_id: rzpResponse.razorpay_payment_id,
                  razorpay_signature: rzpResponse.razorpay_signature,
                });
                if (verifyRes?.success) {
                  paymentSucceeded.current = true;
                  clearCart();
                  toast.success("Payment successful! Order placed.");
                  navigate("/orders");
                } else {
                  toast.error(verifyRes?.message || "Payment verification failed.");
                }
              } catch (err) {
                toast.error("Payment verification error. Contact support.");
                console.error(err);
              }
            },
            prefill: {
              name: `${finalAddress.firstName} ${finalAddress.lastName}`,
              email: finalAddress.email,
              contact: finalAddress.phone
            },
            theme: { color: "#000000" }
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", function () {
            toast.error("Payment failed. Please try again.");
          });
          rzp.open();
        } else {
          toast.error(response?.message || "Failed to initialize Razorpay checkout.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while placing the order.");
    }
  }

  const savedAddresses = userData?.addresses || [];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side — Delivery Info */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />
        </div>

        {/* Saved Addresses Selection */}
        {isAuth && savedAddresses.length > 0 && (
          <div className="flex flex-col gap-3 mb-4">
            <h3 className="font-semibold text-gray-700">Select a Saved Address</h3>
            <div className="flex flex-col gap-3">
              {savedAddresses.map(addr => (
                <div 
                  key={addr._id} 
                  onClick={() => setSelectedAddressId(addr._id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddressId === addr._id ? 'border-green-500' : 'border-gray-300'}`}>
                      {selectedAddressId === addr._id && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                    </div>
                    <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                  <p className="text-sm text-gray-600 ml-7">{addr.phone}</p>
                </div>
              ))}
              
              <div 
                onClick={() => setSelectedAddressId("new")}
                className={`border rounded-lg p-4 cursor-pointer transition-all flex items-center gap-3 ${selectedAddressId === "new" ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddressId === "new" ? 'border-green-500' : 'border-gray-300'}`}>
                  {selectedAddressId === "new" && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                </div>
                <p className="font-medium">Use a New Address</p>
              </div>
            </div>
          </div>
        )}

        {/* New Address Form */}
        {selectedAddressId === "new" && (
          <div className="flex flex-col gap-4 animate-fade-in mt-2">
            {isAuth && savedAddresses.length > 0 && <h3 className="font-semibold text-gray-700 border-t pt-4">Enter New Address</h3>}
            <div className="flex gap-3">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
                type="text"
                placeholder="First Name"
                required={selectedAddressId === "new"}
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
                type="text"
                placeholder="Last Name"
                required={selectedAddressId === "new"}
              />
            </div>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
              type="email"
              placeholder="Email Address"
              required={selectedAddressId === "new"}
            />

            <input
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
              type="text"
              placeholder="Street"
              required={selectedAddressId === "new"}
            />

            <div className="flex gap-3">
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
                type="text"
                placeholder="City"
                required={selectedAddressId === "new"}
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
                type="text"
                placeholder="State"
                required={selectedAddressId === "new"}
              />
            </div>

            <div className="flex gap-3">
              <input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
                type="text"
                placeholder="Zip Code"
                required={selectedAddressId === "new"}
              />
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
                type="text"
                placeholder="Country"
                required={selectedAddressId === "new"}
              />
            </div>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md"
              type="tel"
              placeholder="Phone"
              required={selectedAddressId === "new"}
            />
          </div>
        )}
      </div>

      {/* Right Side — Cart Total + Payment */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT "} text2={"METHODS"} />

          {/* Payment Method Selection */}
          <div className="flex gap-4 flex-col sm:flex-row sm:flex-wrap mt-5">
            {/* Razorpay */}
            <div
              onClick={() => setPaymentMethod("razorpay")}
              className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-sm flex-1 sm:flex-none ${
                paymentMethod === "razorpay" ? "border-green-400 bg-green-50/50" : "hover:border-gray-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 border rounded-full shrink-0 ${
                  paymentMethod === "razorpay" ? "bg-green-400 border-green-400" : "border-gray-300"
                }`}
              ></div>
              <img
                src={assets.razorpay_logo}
                alt="Razorpay"
                className="h-5 shrink-0 object-contain mx-2"
              />
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-sm flex-1 sm:flex-none ${
                paymentMethod === "cod" ? "border-green-400 bg-green-50/50" : "hover:border-gray-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 border rounded-full shrink-0 ${
                  paymentMethod === "cod" ? "bg-green-400 border-green-400" : "border-gray-300"
                }`}
              ></div>
              <p className="text-gray-600 text-sm font-medium mx-2 whitespace-nowrap">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm active:bg-gray-700"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
