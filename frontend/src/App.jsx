import MainRoute from "./routes/MainRoute";
import { Toaster } from "sonner";
import { useShopContext } from "./context/ShopContext";
import Loading from "./components/Loading";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const App = () => {
  const { isLoading } = useShopContext();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isLoading) {
    return <Loading message="Loading Store..." />;
  }

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw]  lg:px-[9vw]">
      <Toaster position="top-right" duration={1000} />
      <MainRoute />
    </div>
  );
};

export default App;
