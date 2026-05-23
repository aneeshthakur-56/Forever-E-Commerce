import { useEffect, useState } from "react";
import Title from "../components/Title";
import { useShopContext } from "../context/ShopContext";
import { makeApiRequest } from "../utils/apiService";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const STATUS_STEPS = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

function statusColor(status) {
  switch (status) {
    case "Delivered":       return "bg-green-500";
    case "Shipped":
    case "Out For Delivery": return "bg-blue-500";
    case "Packing":
    case "Order Placed":    return "bg-yellow-500";
    case "Cancelled":       return "bg-red-500";
    default:                return "bg-gray-400";
  }
}

const TrackModal = ({ item, onClose }) => {
  const currentStep = STATUS_STEPS.indexOf(item.status);
  const isCancelled = item.status === "Cancelled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors text-xl font-light">✕</button>
        
        <h3 className="text-lg font-semibold mb-1">Order Tracking</h3>
        <p className="text-sm text-gray-500 mb-5">Order ID: <span className="font-mono text-xs text-gray-400">{item.orderId}</span></p>

        <div className="flex items-start gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
          <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-md border border-gray-100" />
          <div>
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
            <p className="text-xs text-gray-500">Payment: {item.paymentMethod}</p>
          </div>
        </div>

        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="w-3 h-3 rounded-full bg-red-500 shrink-0"></div>
            <p className="text-red-600 font-medium text-sm">This order has been cancelled.</p>
          </div>
        ) : (
          <div className="relative">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isActive = index === currentStep;
              return (
                <div key={step} className="flex items-start gap-4 mb-4 last:mb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${isCompleted ? "bg-black border-black" : "bg-white border-gray-300"} ${isActive ? "ring-2 ring-black ring-offset-2" : ""}`}></div>
                    {index < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 h-7 mt-1 transition-all ${isCompleted && index < currentStep ? "bg-black" : "bg-gray-200"}`}></div>
                    )}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-medium ${isActive ? "text-black" : isCompleted ? "text-gray-700" : "text-gray-400"}`}>{step}</p>
                    {isActive && <p className="text-xs text-gray-400 mt-0.5">Current Status</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={onClose} className="mt-6 w-full bg-black text-white py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

const Order = () => {
  const { currency, isAuth } = useShopContext();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackedItem, setTrackedItem] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuth) {
        setOrderData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await makeApiRequest("/api/order/user");
        if (res.success) {
          const allOrderItems = [];
          res.data.forEach((order) => {
            order.items.forEach((item) => {
              allOrderItems.push({
                ...item,
                orderId: order._id,
                status: order.status,
                date: new Date(order.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                paymentMethod: order.paymentMethod,
                paymentStatus: order.payment,
              });
            });
          });
          setOrderData(allOrderItems.reverse());
        }
      } catch (error) {
        if (!error.message?.includes("404")) {
          toast.error("Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuth, location.key]);

  return (
    <div className="border-t pt-16">
      {trackedItem && <TrackModal item={trackedItem} onClose={() => setTrackedItem(null)} />}

      <div className="text-2xl">
        <Title text1={"MY "} text2={"ORDERS"} />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <p>Loading orders...</p>
          </div>
        ) : orderData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xl font-semibold mb-2 text-gray-700">No orders found</p>
            <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
          </div>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Left — Image + Info */}
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20 object-contain" src={item.image} alt={item.name} />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>Date: <span className="text-gray-400">{item.date}</span></p>
                    <p>Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
                  </div>
                </div>
              </div>

              {/* Right — Status + Button */}
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`min-w-2 h-2 rounded-full ${statusColor(item.status)}`}></div>
                  <p className="text-sm md:text-base font-medium">{item.status}</p>
                </div>
                <button
                  onClick={() => setTrackedItem(item)}
                  className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;


