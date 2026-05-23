import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { makeApiRequest } from "../utils/apiService";

const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const currency = "$";
  const deliveryFee = 10;

  // 1. Verify auth & fetch profile on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await makeApiRequest("/api/user/profile");
        if (res.success) {
          setIsAuth(true);
          setUserData(res.data);
        }
      } catch {
        setIsAuth(false);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // 2. Fetch products on mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await makeApiRequest("/api/product/list-products", "GET");
        console.log(res);
        if (res.success) {
          setProducts(res.data);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch products");
      }
    };
    getProducts();
  }, []);

  // 3. Fetch cart from backend when auth confirmed
  useEffect(() => {
    const getCart = async () => {
      if (!isAuth) return;
      try {
        const res = await makeApiRequest("/api/cart/get");
        if (res.success) setCart(res.data || {});
      } catch (error) {
        console.error("Cart fetch failed:", error);
      }
    };
    getCart();
  }, [isAuth]);

  // 4. Logout
  async function logOut() {
    try {
      await makeApiRequest("/api/auth/logout", "POST", {});
      toast.success("Logged out successfully");
      setIsAuth(false);
      setCart({});
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Logout failed");
    }
  }

  // 5. Add to cart
  async function addToCart(itemId, size) {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    setCart((prev) => {
      const productSizes = prev[itemId] ? { ...prev[itemId] } : {};
      productSizes[size] = (productSizes[size] || 0) + 1;
      return { ...prev, [itemId]: productSizes };
    });

    toast.success("Product added to cart");

    try {
      if (isAuth) {
        await makeApiRequest("/api/cart/add", "POST", { itemId, size });
      }
    } catch (error) {
      setCart((prev) => {
        const productSizes = { ...prev[itemId] };
        productSizes[size] = (productSizes[size] || 1) - 1;
        if (productSizes[size] === 0) delete productSizes[size];
        if (Object.keys(productSizes).length === 0) {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        }
        return { ...prev, [itemId]: productSizes };
      });
      toast.error(error.message || "Failed to add to cart");
    }
  }

  // 6. Remove from cart
  async function removeFromCart(itemId, size) {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      const productSizes = { ...prev[itemId] };
      delete productSizes[size];
      if (Object.keys(productSizes).length === 0) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return { ...prev, [itemId]: productSizes };
    });

    toast.success("Product removed from cart");

    try {
      if (isAuth) {
        await makeApiRequest("/api/cart/update", "POST", {
          itemId,
          size,
          quantity: 0, 
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove from cart");
    }
  }

  // 7. Update quantity
  async function updateQuantity(itemId, size, quantity) {
    if (quantity <= 0) {
      removeFromCart(itemId, size);
      return;
    }

    setCart((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [size]: quantity },
    }));

    toast.success("Cart updated");

    try {
      if (isAuth) {
        await makeApiRequest("/api/cart/update", "POST", { itemId, size, quantity });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update cart");
    }
  }


  function clearCart() {
    setCart({});
  }


  const cartCount = Object.values(cart).reduce(
    (sum, sizes) => sum + Object.values(sizes).reduce((s, qty) => s + qty, 0),
    0,
  );

  const cartTotal = Object.entries(cart).reduce((sum, [itemId, sizes]) => {
    const product = products.find((p) => p._id === itemId);
    if (!product) return sum;
    const itemTotal = Object.values(sizes).reduce((s, qty) => s + qty, 0);
    return sum + product.price * itemTotal;
  }, 0);

  const cartItems = Object.entries(cart).flatMap(([itemId, sizes]) => {
    const product = products.find((p) => p._id === itemId);
    return Object.entries(sizes).map(([size, quantity]) => ({
      itemId,
      size,
      quantity,
      product,
    }));
  });

  const value = {
    // Products
    products,
    currency,
    deliveryFee,

    // Search
    search,
    setSearch,
    showSearch,
    setShowSearch,

    // Cart
    cart,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Auth & User
    isAuth,
    setIsAuth,
    userData,
    setUserData,
    isLoading,
    logOut,

    // Navigation
    navigate,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

function useShopContext() {
  const context = useContext(ShopContext);
  if (!context)
    throw new Error("useShopContext must be used within ShopContextProvider");
  return context;
}

export { useShopContext, ShopContextProvider };
