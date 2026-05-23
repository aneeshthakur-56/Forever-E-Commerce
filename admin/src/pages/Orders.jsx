import { useEffect, useState, useCallback } from "react";
import { makeApiRequest } from "../utils/apiService";
import { toast } from "sonner";
import Title from "../components/Title";
import Loading from "../components/Loading";

const STATUS_FLOW = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

const ALL_STATUSES = [...STATUS_FLOW, "Cancelled"];

const STATUS_META = {
  "Order Placed":     { color: "blue",   icon: "📋" },
  "Packing":          { color: "yellow", icon: "📦" },
  "Shipped":          { color: "purple", icon: "🚚" },
  "Out For Delivery": { color: "orange", icon: "🏍️" },
  "Delivered":        { color: "green",  icon: "✅" },
  "Cancelled":        { color: "red",    icon: "❌" },
};

const COLOR = {
  blue:   { bg: "bg-blue-50",   ring: "ring-blue-400",   text: "text-blue-700",   dot: "bg-blue-500",   bar: "bg-blue-500"   },
  yellow: { bg: "bg-yellow-50", ring: "ring-yellow-400", text: "text-yellow-700", dot: "bg-yellow-500", bar: "bg-yellow-500" },
  purple: { bg: "bg-purple-50", ring: "ring-purple-400", text: "text-purple-700", dot: "bg-purple-500", bar: "bg-purple-500" },
  orange: { bg: "bg-orange-50", ring: "ring-orange-400", text: "text-orange-700", dot: "bg-orange-500", bar: "bg-orange-500" },
  green:  { bg: "bg-green-50",  ring: "ring-green-400",  text: "text-green-700",  dot: "bg-green-500",  bar: "bg-green-500"  },
  red:    { bg: "bg-red-50",    ring: "ring-red-400",    text: "text-red-700",    dot: "bg-red-500",    bar: "bg-red-500"    },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

// ── Status Stepper Component ──────────────────────────────────────────────────
const StatusStepper = ({ order, onUpdate, isUpdating }) => {
  const isCancelled = order.status === "Cancelled";
  const currentIdx = STATUS_FLOW.indexOf(order.status);

  const handleStep = async (newStatus) => {
    if (newStatus === order.status || isUpdating) return;
    await onUpdate(order._id, newStatus);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Progress Track */}
      {!isCancelled && (
        <div className="relative flex items-center justify-between px-2">
          {/* Background line */}
          <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-200 z-0" />
          {/* Filled line */}
          <div
            className="absolute left-4 top-4 h-0.5 bg-black z-0 transition-all duration-500"
            style={{
              width: `calc(${(currentIdx / (STATUS_FLOW.length - 1)) * 100}% - 2rem)`,
            }}
          />

          {STATUS_FLOW.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isNext = idx === currentIdx + 1;

            return (
              <button
                key={step}
                onClick={() => isNext && handleStep(step)}
                disabled={isUpdating || (!isNext && !isCurrent)}
                title={isNext ? `Advance to "${step}"` : step}
                className={`relative z-10 flex flex-col items-center gap-1.5 group transition-all ${
                  isNext && !isUpdating ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                    isDone
                      ? "bg-black border-black text-white"
                      : isCurrent
                      ? "bg-black border-black text-white ring-4 ring-black/10 scale-110"
                      : isNext
                      ? "bg-white border-gray-300 text-gray-400 group-hover:border-black group-hover:text-black"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight whitespace-nowrap ${
                    isCurrent ? "text-gray-900" : isDone ? "text-gray-500" : "text-gray-300"
                  }`}
                >
                  {step.replace("Order Placed", "Placed").replace("Out For Delivery", "Out for\nDelivery")}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Next step button */}
        {!isCancelled && currentIdx < STATUS_FLOW.length - 1 && (
          <button
            onClick={() => handleStep(STATUS_FLOW[currentIdx + 1])}
            disabled={isUpdating}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <span>→</span>
            )}
            {STATUS_META[STATUS_FLOW[currentIdx + 1]]?.icon} {STATUS_FLOW[currentIdx + 1]}
          </button>
        )}

        {/* Jump to any status via select */}
        {order.status !== "Delivered" && (
          <select
            value={order.status}
            disabled={isUpdating}
            onChange={(e) => handleStep(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 outline-none focus:ring-1 focus:ring-black cursor-pointer disabled:opacity-50 transition-all"
          >
            <option value="" disabled>Change status…</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        {order.status === "Delivered" && (
          <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
            ✅ Order Complete
          </span>
        )}
        {order.status === "Cancelled" && (
          <button
            onClick={() => handleStep("Order Placed")}
            disabled={isUpdating}
            className="text-xs font-medium px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:border-black hover:text-black transition-all disabled:opacity-50"
          >
            Reopen Order
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main Orders Component ─────────────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // admin makeApiRequest returns full axios response; body is at res.data
      const res = await makeApiRequest("/api/order/list", "GET");
      const body = res?.data;          // { statusCode, message, data: [...orders] }
      const data = body?.data;         // the orders array
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        toast.error(body?.message || "Failed to load orders");
      }
    } catch (err) {
      toast.error("Error fetching orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await makeApiRequest(`/api/order/status/${orderId}`, "PATCH", { status: newStatus });
      const body = res?.data;   // unwrap axios response
      if (res?.status === 200 || body?.statusCode === 200 || body?.success) {
        toast.success(`Status updated → ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating order status");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };

  // Stats
  const stats = ALL_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {}
  );
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  // Filtered list
  const visible = orders.filter((o) => {
    const statusMatch = filterStatus === "All" || o.status === filterStatus;
    const term = search.toLowerCase();
    const nameMatch =
      !search ||
      o.userId?.name?.toLowerCase().includes(term) ||
      o.userId?.email?.toLowerCase().includes(term) ||
      o._id.toLowerCase().includes(term) ||
      o.address?.firstName?.toLowerCase().includes(term) ||
      o.address?.lastName?.toLowerCase().includes(term);
    return statusMatch && nameMatch;
  });

  return (
    <div className="flex flex-col w-full gap-6">

      {/* ── Header Card ── */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              <Title text1={"Orders "} text2={"Management"} />
            </h2>
            {!isLoading && (
              <p className="text-sm text-gray-400 mt-1">
                {orders.length} total · ₹{totalRevenue.toLocaleString("en-IN")} revenue
              </p>
            )}
          </div>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <svg className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {!isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6">
            {ALL_STATUSES.map((s) => {
              const meta = STATUS_META[s];
              const c = COLOR[meta.color];
              const isActive = filterStatus === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(isActive ? "All" : s)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${
                    isActive
                      ? `${c.bg} border-current ${c.text}`
                      : "bg-gray-50 border-transparent hover:border-gray-200"
                  }`}
                >
                  <span className="text-xl">{meta.icon}</span>
                  <span className={`text-xl font-bold ${isActive ? c.text : "text-gray-800"}`}>
                    {stats[s] || 0}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-tight font-medium">{s}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Filter Pills + Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {["All", ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                filterStatus === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {s}
              {s !== "All" && <span className="ml-1.5 opacity-60">{stats[s] || 0}</span>}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 sm:ml-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Name, email, order ID…"
            className="border border-gray-200 text-sm px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-black w-52 bg-gray-50"
          />
          <button type="submit" className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* ── Orders List ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <Loading />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <span className="text-5xl">📋</span>
            <p className="text-lg font-medium text-gray-600">No orders found</p>
            <p className="text-sm">
              {filterStatus !== "All" || search
                ? "Try changing your filters."
                : "Orders will appear here once customers start placing them."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {visible.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META["Order Placed"];
              const c = COLOR[meta.color];
              const isExpanded = expandedId === order._id;
              const isUpdating = updatingId === order._id;
              const customerName =
                order.userId?.name ||
                `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() ||
                "Guest";

              return (
                <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                  {/* ── Order Row ── */}
                  <div className="px-5 lg:px-6 py-5">
                    {/* Top row: customer + meta */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-start gap-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    >
                      {/* Customer info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${c.bg}`}>
                          {meta.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{customerName}</p>
                          {order.userId?.email && (
                            <p className="text-xs text-gray-400 truncate">{order.userId.email}</p>
                          )}
                          <p className="text-xs text-gray-300 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      {/* Item thumbnails */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((it, i) => (
                            <img
                              key={i} src={it.image} alt={it.name}
                              className="w-9 h-9 rounded-lg border-2 border-white object-cover shadow-sm"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <span className="w-9 h-9 rounded-lg border-2 border-white bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium">
                              +{order.items.length - 3}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                      </div>

                      {/* Amount + payment */}
                      <div className="flex flex-col gap-1 shrink-0 text-right sm:text-left">
                        <p className="font-bold text-gray-900">₹{order.amount?.toLocaleString("en-IN")}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          order.payment ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {order.paymentMethod} · {order.payment ? "Paid" : "Pending"}
                        </span>
                        <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
                      </div>

                      {/* Expand chevron */}
                      <div className="hidden sm:flex items-center shrink-0">
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* ── Status Stepper (always visible below row) ── */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <StatusStepper
                        order={order}
                        onUpdate={updateStatus}
                        isUpdating={isUpdating}
                      />
                    </div>
                  </div>

                  {/* ── Expanded Details ── */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100 px-5 lg:px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items Ordered</p>
                        <div className="flex flex-col gap-3">
                          {order.items.map((it, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                              <img src={it.image} alt={it.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{it.name}</p>
                                <p className="text-xs text-gray-400">Size: {it.size} · Qty: {it.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-gray-700 shrink-0">
                                ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address + Summary */}
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</p>
                          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-sm text-gray-700 space-y-1">
                            <p className="font-semibold text-gray-900">{order.address?.firstName} {order.address?.lastName}</p>
                            <p>{order.address?.street}</p>
                            <p>{order.address?.city}{order.address?.state ? `, ${order.address.state}` : ""} {order.address?.zipcode}</p>
                            <p className="text-gray-400">{order.address?.country}</p>
                            {order.address?.phone && <p className="text-gray-500">📞 {order.address.phone}</p>}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-sm">
                          <div className="flex justify-between text-gray-500 mb-1">
                            <span>Subtotal</span>
                            <span>₹{order.items.reduce((s, it) => s + it.price * it.quantity, 0).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between text-gray-500 mb-2">
                            <span>Delivery</span>
                            <span>₹{Math.max(0, order.amount - order.items.reduce((s, it) => s + it.price * it.quantity, 0)).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                            <span>Total</span>
                            <span>₹{order.amount?.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;