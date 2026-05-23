import { createContext, useContext, useEffect, useState } from "react";
import { makeApiRequest } from "../utils/apiService";
import { toast } from "sonner";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function logOut() {
    try {
       await makeApiRequest("/api/auth/logout", "POST",{});
       toast.success("Admin Logged Out")
      setIsAuth(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await makeApiRequest("/api/auth/verify");
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setIsLoading(false); // ← always stop loading
      }
    };
    verifyAuth();
  }, []);

  return (
    <AdminContext.Provider value={{ isAuth, setIsAuth, isLoading, logOut }}>
      {children}
    </AdminContext.Provider>
  );
};

function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within AdminProvider");
  }
  return context;
}

export { AdminContext, AdminProvider, useAdminContext };
