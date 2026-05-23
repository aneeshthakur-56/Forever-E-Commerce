import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="bg-gray-50 min-h-screen"> {/* ✅ fixed typo */}
      <NavBar />
      <hr />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Layout;