import { useShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useEffect, useState } from "react";

const LatestCollection = () => {
  const { products } = useShopContext();
  const [latestProducts, setLatestProducts] = useState([]);
  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);
  return (
    <div className="my-10">
      <div className="text-center  py-8 text-3xl">
        <Title text1={"LATEST "} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-500">
          Discover our newest arrivals crafted with modern style, premium
          quality, and everyday comfort. Explore the latest trends and refresh
          your wardrobe with pieces designed to make you stand out.
        </p>
      </div>
      {/* {Rendering Products} */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((product) => {
          return <ProductItem product={product} key={product._id} />;
        })}
      </div>
    </div>
  );
};

export default LatestCollection;
