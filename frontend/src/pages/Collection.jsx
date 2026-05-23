import { useEffect, useState } from "react";
import { useShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import Pagination from "../components/Pagination";
import { makeApiRequest } from "../utils/apiService";
import Loading from "../components/Loading";

const Collection = () => {
  const { search, showSearch } = useShopContext();
  const [filterProducts, setFilterProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const sortOptions = [
    { value: "relevant", label: "Sort by: Relevant" },
    { value: "low-high", label: "Sort by: Low to High" },
    { value: "high-low", label: "Sort by: High to Low" }
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPaginatedProducts = async () => {
    setIsLoading(true);
    try {
      const res = await makeApiRequest("/api/product/search", "POST", {
        page: currentPage,
        limit: 12,
        search: showSearch ? search : "",
        category,
        subCategory,
        sortType,
        isBestSeller,
      });

      if (res.success) {
        setFilterProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, subCategory, sortType, search, showSearch, currentPage, isBestSeller]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subCategory, sortType, search, showSearch, isBestSeller]);

  function toggleCategory(e) {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  }

  function toggleSubCategory(e) {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* {Filter Options} */}
      <div className="min-w-60">
        <p
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? " " : "hidden"}  sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2 cursor-pointer hover:text-black">
              <input
                className="w-3 accent-black"
                type="checkbox"
                value={"Men"}
                checked={category.includes("Men")}
                onChange={toggleCategory}
              />
              Men
            </label>
            <label className="flex gap-2 cursor-pointer hover:text-black">
              <input
                className="w-3 accent-black"
                type="checkbox"
                value={"Women"}
                checked={category.includes("Women")}
                onChange={toggleCategory}
              />
              Women
            </label>
            <label className="flex gap-2 cursor-pointer hover:text-black">
              <input
                className="w-3 accent-black"
                type="checkbox"
                value={"Kids"}
                checked={category.includes("Kids")}
                onChange={toggleCategory}
              />
              Kids
            </label>
          </div>
        </div>
        {/* Subcategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? " " : "hidden"}  sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2 cursor-pointer hover:text-black">
              <input
                className="w-3 accent-black"
                type="checkbox"
                value={"Topwear"}
                checked={subCategory.includes("Topwear")}
                onChange={toggleSubCategory}
              />
              Topwear
            </label>
            <label className="flex gap-2 cursor-pointer hover:text-black">
              <input
                className="w-3 accent-black"
                type="checkbox"
                value={"Bottomwear"}
                checked={subCategory.includes("Bottomwear")}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </label>
            <label className="flex gap-2 cursor-pointer hover:text-black">
              <input
                className="w-3 accent-black"
                type="checkbox"
                value={"Winterwear"}
                checked={subCategory.includes("Winterwear")}
                onChange={toggleSubCategory}
              />
              Winterwear
            </label>
          </div>
        </div>
        
        {/* Bestseller Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? " " : "hidden"}  sm:block`}
        >
          <p className="mb-3 text-sm font-medium text-amber-600">SPECIAL</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2 cursor-pointer items-center hover:text-black transition-colors">
              <input
                className="w-3.5 h-3.5 accent-black"
                type="checkbox"
                checked={isBestSeller}
                onChange={() => setIsBestSeller(!isBestSeller)}
              />
              <span className="font-medium">Bestsellers Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 min-h-[50vh] relative">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4 relative">
          <Title text1={"ALL "} text2={"COLLECTIONS"} />
          
          {/* Custom Product Sort Dropdown */}
          <div className="relative z-20">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 border border-gray-200 text-sm px-4 py-2 cursor-pointer bg-white rounded-full shadow-sm hover:shadow transition-all min-w-[190px]"
            >
              <span className="font-medium text-gray-700 tracking-wide">
                {sortOptions.find(o => o.value === sortType)?.label}
              </span>
              <img 
                src={assets.dropdown_icon} 
                alt="arrow" 
                className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? '-rotate-90' : 'rotate-90'}`}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in origin-top-right">
                {sortOptions.map((option) => (
                  <div 
                    key={option.value}
                    onClick={() => {
                      setSortType(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-5 py-3 text-sm cursor-pointer transition-colors ${sortType === option.value ? 'bg-gray-50 font-bold text-black border-l-2 border-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black border-l-2 border-transparent'}`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-6">
          {filterProducts.map((product) => {
            return <ProductItem product={product} key={product._id} />;
          })}
        </div>
        
        {/* Empty State */}
        {!isLoading && filterProducts.length === 0 && (
          <div className="w-full text-center py-20 text-gray-500">
            No products match your filters.
          </div>
        )}

        {/* Pagination */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default Collection;
