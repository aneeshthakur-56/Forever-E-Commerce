import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

const links = [
  { to: "/add",    icon: assets.add_icon,   label: "Add Product" },
  { to: "/list",   icon: assets.order_icon, label: "Products"    },
  { to: "/orders", icon: assets.order_icon, label: "Orders"      },
];

const Sidebar = () => {
  return (
    <div className="w-[60px] sm:w-[200px] lg:w-[220px] min-h-screen bg-white border-r border-gray-100 pt-6 flex-shrink-0">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? "bg-black text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  className={`w-4 h-4 shrink-0 ${isActive ? "brightness-0 invert" : "opacity-60 group-hover:opacity-100"}`}
                  src={icon}
                  alt={label}
                />
                <p className="hidden sm:block text-sm font-medium">{label}</p>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;