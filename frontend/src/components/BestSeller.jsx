import { useEffect, useState } from "react";
import { useShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const BestSeller = () => {
  const { products } = useShopContext();
  const [bestSeller, setBestSeller] = useState([]);
  useEffect(()=>{
    const bestSellerProducts = products.filter((product) => product.bestseller);
    setBestSeller(bestSellerProducts.slice(0,5))
  },[products])
  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST "} text2={"SELLER"} />
        <p className="w-3/4  m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our most loved and top-rated products chosen by customers for
          their quality, style, and comfort. These best sellers are trending now
          and perfect for upgrading your collection.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((product) => {
          return <ProductItem key={product._id} product={product} />;
        })}
      </div>
    </div>
  );
};

export default BestSeller;
