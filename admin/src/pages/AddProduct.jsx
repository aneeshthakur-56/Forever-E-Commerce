import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { assets } from "../assets/admin_assets/assets";
import "../index.css";
import Title from "../components/Title";
import { makeApiRequest } from "../utils/apiService";
import Loading from "../components/Loading";

const AddProduct = () => {
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Image States
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  const imageInputs = [
    { id: "image1", file: image1, setFile: setImage1 },
    { id: "image2", file: image2, setFile: setImage2 },
    { id: "image3", file: image3, setFile: setImage3 },
    { id: "image4", file: image4, setFile: setImage4 },
  ];

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Men");
    setSubCategory("Topwear");
    setBestseller(false);
    setSizes([]);
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // Make API Request
      const res = await makeApiRequest(
        "/api/product/add-product",
        "POST",
        formData,
      );

      toast.success("Product added successfully!");
      resetForm();
      navigate("/list");
    } catch (error) {
      toast.error(error.message || "Failed to add product. Please try again.");
      console.error("Error adding product:", error);
    } finally {
      setIsLoading(false); // Stop loading overlay
    }
  };

  return (
    <div className="relative w-full max-w-3xl">
      {/* --- OVERLAY LOADING COMPONENT --- */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200">
          <Loading />
        </div>
      )}

      {/* --- MAIN FORM --- */}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          <Title text1={"Add "} text2={"New Product"} />
        </h2>

        {/* Image Upload Section */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Images
          </label>
          <div className="flex gap-4 flex-wrap">
            {imageInputs.map((item, index) => (
              <label
                key={item.id}
                htmlFor={item.id}
                className="cursor-pointer group"
              >
                <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 group-hover:bg-gray-100 group-hover:border-blue-400 transition-all overflow-hidden">
                  <img
                    className={
                      item.file
                        ? "w-full h-full object-cover"
                        : "w-8 opacity-60 group-hover:opacity-100 transition-opacity"
                    }
                    src={
                      item.file
                        ? URL.createObjectURL(item.file)
                        : assets.upload_area
                    }
                    alt={`Upload preview ${index + 1}`}
                  />
                </div>
                <input
                  onChange={(e) => item.setFile(e.target.files[0])}
                  type="file"
                  id={item.id}
                  hidden
                />
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The first image will be used as the cover image.
          </p>
        </div>

        {/* Product Name */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            type="text"
            placeholder="e.g., Wireless Bluetooth Headphones"
            required
          />
        </div>

        {/* Product Description */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
            rows="5"
            placeholder="Describe your product in detail..."
            required
          ></textarea>
        </div>

        {/* Category, Sub-Category, and Price Row */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]">
          {/* Product Category */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {/* Product Sub Category */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Category
            </label>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winter">Winter</option>
            </select>
          </div>

          {/* Product Price */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              type="number"
              min="0"
              placeholder="25"
              required
            />
          </div>
        </div>

        {/* Product Sizes */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Sizes
          </label>
          <div className="flex gap-3 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 border rounded-md cursor-pointer transition-all flex items-center justify-center min-w-[3rem] 
                ${
                  sizes.includes(size)
                    ? "bg-blue-100 border-blue-400 text-blue-800"
                    : "bg-gray-50 border-gray-300 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <p className="text-sm font-medium">{size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <div className="flex items-center gap-2 mt-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
          />
          <label
            htmlFor="bestseller"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            Add to Bestseller
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 px-8 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all active:scale-[0.98]"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
