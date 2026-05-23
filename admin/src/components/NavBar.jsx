import { assets } from "../assets/admin_assets/assets.js";
import { useAdminContext } from "../context/AdminContext.jsx";

const NavBar = () => {
  const { logOut } = useAdminContext();
  return (
    <div className="sticky top-0 z-50 flex items-center px-6 sm:px-10 py-3.5 justify-between bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <img className="h-8 object-contain" src={assets.logo} alt="Admin Logo" />
        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full tracking-wide uppercase">
          Admin Panel
        </span>
      </div>
      <button
        onClick={logOut}
        className="flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default NavBar;
