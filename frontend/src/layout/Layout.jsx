import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
const Layout = () => {
  return (
    <>
      <NavBar />
      <SearchBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
