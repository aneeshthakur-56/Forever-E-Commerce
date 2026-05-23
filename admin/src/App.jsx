import MainRoute from "./routes/MainRoute";
import { Toaster } from 'sonner';
import { useAdminContext } from "./context/AdminContext";
import Loading from "./components/Loading";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const App = () => {
  const { isLoading } = useAdminContext();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isLoading) {
    return <Loading message="Loading Admin Panel..." />;
  }

  return (
    <div>
      <MainRoute />
      <Toaster position="top-right" duration={1000} />
    </div>
  );
};

export default App;
