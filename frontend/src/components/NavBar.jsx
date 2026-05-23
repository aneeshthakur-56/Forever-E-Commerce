import { useState, useEffect } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { NavLink, Link } from "react-router";
import { useShopContext } from "../context/ShopContext";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setShowSearch, showSearch, cartCount, logOut, setIsAuth, navigate, isAuth } =
    useShopContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-4" : "bg-transparent py-6"} -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]`}>
      <div className="flex items-center justify-between font-medium">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
          <img src={assets.logo} alt="logo" className="h-8 md:h-10 object-contain" />
        </Link>

        {/* Main Pages */}
        <ul className="hidden sm:flex items-center gap-8 text-sm text-gray-700 font-medium">
          {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((item) => (
            <NavLink
              key={item}
              to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `relative group py-1 transition-colors ${
                  isActive ? "text-black" : "text-gray-500 hover:text-black"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <p className="tracking-wide">{item}</p>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-black transition-all duration-300 ${
                      isActive ? "w-1/2" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Right Nav */}
        <div className="flex items-center gap-5 sm:gap-7">
          <img
            onClick={() => setShowSearch(!showSearch)}
            src={assets.search_icon}
            alt="Search"
            className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform opacity-70 hover:opacity-100"
          />

          <div className="group relative">
            <Link to="/login">
              <img
                className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform opacity-70 hover:opacity-100"
                src={assets.profile_icon}
                alt="Profile"
              />
            </Link>
            {isAuth && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
                <div className="flex flex-col w-40 py-2 bg-white text-sm text-gray-600 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <p className="cursor-pointer px-4 py-2.5 hover:bg-gray-50 hover:text-black transition-colors" onClick={() => navigate("/profile")}>
                    My Profile
                  </p>
                  <p className="cursor-pointer px-4 py-2.5 hover:bg-gray-50 hover:text-black transition-colors" onClick={() => navigate("/orders")}>
                    Orders
                  </p>
                  <div className="h-[1px] bg-gray-100 my-1"></div>
                  <p
                    className="cursor-pointer px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors font-medium"
                    onClick={() => {
                      setIsAuth(false);
                      logOut();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative group hover:scale-110 transition-transform">
            <img src={assets.cart_icon} alt="Cart" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[10px] font-bold shadow-md">
              {cartCount}
            </p>
          </Link>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="Menu"
            className="w-5 h-5 cursor-pointer sm:hidden opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Sidebar menu for smaller screen */}
        <div
          className={`fixed top-0 right-0 bottom-0 z-50 bg-white transition-all duration-300 shadow-2xl ${
            visible ? "w-full sm:w-[350px] translate-x-0" : "w-0 translate-x-full"
          } overflow-hidden`}
        >
          <div className="flex flex-col h-full bg-white">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <img className="h-4 rotate-180 opacity-60" src={assets.dropdown_icon} alt="Back" />
              <p className="font-medium text-gray-600">Back</p>
            </div>
            <div className="flex flex-col mt-4">
              {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((item) => (
                <NavLink
                  key={item}
                  onClick={() => setVisible(false)}
                  className={({ isActive }) =>
                    `px-8 py-4 border-b border-gray-50 text-lg transition-colors ${
                      isActive ? "font-bold text-black bg-gray-50" : "text-gray-600 hover:text-black hover:bg-gray-50"
                    }`
                  }
                  to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile backdrop */}
        {visible && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden transition-opacity"
            onClick={() => setVisible(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
