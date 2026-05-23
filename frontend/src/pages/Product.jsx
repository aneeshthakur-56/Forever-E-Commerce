import { useParams } from "react-router";
import { useShopContext } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import DisplayReleatedProduct from "../components/DisplayReleatedProduct";
import ReviewForm from "../components/ReviewForm";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, isAuth } = useShopContext();

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    async function fetchData() {
      const product = products.find((product) => product._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
        setSelectedSize("");
        setActiveTab("description");
      }
    }
    fetchData();
  }, [productId, products]);

  const handleReviewAdded = (newReview) => {
    setProductData(prev => ({
      ...prev,
      reviews: [...(prev.reviews || []), newReview]
    }));
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in-out duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((img) => (
              <img
                key={img}
                src={img}
                onClick={() => setImage(img)}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 ${
                  image === img ? "border-orange-500" : "border-transparent"
                }`}
                alt=""
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img src={image} alt={productData.name} className="w-full h-auto" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">({productData.reviews?.length ?? 0} reviews)</p>
          </div>

          {/* Price */}
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          {/* Description */}
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Size Selector */}
          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    selectedSize === size
                      ? "border-orange-500"
                      : "border-transparent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              addToCart(productData._id, selectedSize);
            }}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          {/* Divider */}
          <hr className="mt-8 sm:w-4/5" />

          {/* Extra Info */}
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews Section */}
      <div className="mt-20">
        {/* Tabs */}
        <div className="flex">
          <p
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-sm cursor-pointer ${
              activeTab === "description"
                ? "font-bold border-b-white"
                : "text-gray-500"
            }`}
          >
            Description
          </p>
          <p
            onClick={() => setActiveTab("reviews")}
            className={`border px-5 py-3 text-sm cursor-pointer ${
              activeTab === "reviews"
                ? "font-bold border-b-white"
                : "text-gray-500"
            }`}
          >
            Reviews ({productData.reviews?.length ?? 0})
          </p>
        </div>

        {/* Tab Content */}
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          {/* Description Tab */}
          {activeTab === "description" && <p>{productData.description}</p>}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left Side: Existing Reviews */}
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Customer Reviews</h3>
                {productData.reviews && productData.reviews.length > 0 ? (
                  <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {productData.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 border p-4 rounded bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                            {review.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-black">{review.name}</p>
                            <p className="text-yellow-400 text-lg leading-none">
                              {"★".repeat(review.rating)}
                              <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                            </p>
                          </div>
                        </div>
                        {review.comment && <p className="mt-1 text-gray-600">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No reviews yet for this product. Be the first to review!</p>
                )}
              </div>

              {/* Right Side: Review Form */}
              <div className="w-full md:w-[40%] flex-shrink-0">
                {isAuth ? (
                  <div className="sticky top-24">
                    <ReviewForm productId={productData._id} onReviewAdded={handleReviewAdded} />
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded border text-center flex flex-col items-center gap-2">
                    <p className="text-gray-600 font-medium">Want to share your thoughts?</p>
                    <p className="text-sm text-gray-500">Please log in to leave a review.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <DisplayReleatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
        currentId={productData._id}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
