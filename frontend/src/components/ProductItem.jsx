import { Link } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";

const ProductItem = ({ product }) => {
  const { _id, image, name, price, bestSeller } = product;
  const { currency } = useShopContext();
  return (
    <>
      <Link className="text-gray-700 cursor-pointer relative group" to={`/product/${_id}`}>
        <div className="overflow-hidden relative rounded-md bg-gray-50 aspect-[3/4]">
          {bestSeller && (
            <span className="absolute top-2 left-2 bg-black/90 text-white text-[10px] sm:text-[11px] px-2.5 py-1 z-10 rounded-sm font-bold tracking-widest shadow-md">
              BESTSELLER
            </span>
          )}
          <img
            className="hover:scale-110 transition duration-700 ease-in-out object-cover w-full h-full"
            src={image[0]}
            alt={name}
          />
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <p className="text-sm font-medium line-clamp-1 text-gray-800 group-hover:text-black transition-colors">{name}</p>
          <p className="text-sm font-bold text-gray-900">
            {currency}
            {price}
          </p>
        </div>
      </Link>
    </>
  );
};

export default ProductItem;
