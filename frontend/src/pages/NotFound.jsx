import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fade-in">
      <h1 className="text-8xl md:text-9xl font-bold text-gray-200 mb-4 tracking-tighter select-none">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md text-sm md:text-base leading-relaxed">
        We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place.
      </p>
      <Link 
        to="/" 
        className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;