import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Collection from "../pages/Collection";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Login from "../pages/Login";
import Cart from "../pages/Cart";
import PlaceOrder from "../pages/PlaceOrder";
import NotFound from "../pages/NotFound";
import Product from "../pages/Product";
import Order from "../pages/Order";
import Profile from "../pages/Profile";
import Layout from "../layout/Layout";

const MainRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="collection" element={<Collection />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="product/:productId" element={<Product />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="place-order" element={<PlaceOrder />} />
          <Route path="orders" element={<Order />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoute;
