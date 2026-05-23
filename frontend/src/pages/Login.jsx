import { useEffect, useState } from "react";
import { makeApiRequest } from "../utils/apiService";
import { toast } from "sonner";
import { useShopContext } from "../context/ShopContext";
import Loading from "../components/Loading";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuth, setIsAuth, navigate, isLoading } = useShopContext();

  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  // Redirect if already logged in — wait for verify to complete
  useEffect(() => {
    if (!isLoading && isAuth) navigate("/");
  }, [isAuth, isLoading, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentState === "Sign Up") {
        const res = await makeApiRequest(
          "/api/auth/register",
          "POST",
          { name, email, password }
        );
        if (res.success) {
          toast.success(res.message || "Registered successfully");
          setIsAuth(true);
          resetForm();
        }
      } else {
        const res = await makeApiRequest(
          "/api/auth/login",
          "POST",
          { email, password }
        );
        if (res.success) {
          toast.success(res.message || "Logged in successfully");
          setIsAuth(true);
          resetForm();
        }
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
      console.error("Auth Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md m-auto">
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm mt-14">
          <Loading message="Authenticating..." />
        </div>
      )}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        {/* Header */}
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        {/* Name — Sign Up only */}
        {currentState === "Sign Up" && (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
            required
            className="w-full px-3 py-2 border border-gray-800 outline-none"
          />
        )}

        {/* Email */}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
          className="w-full px-3 py-2 border border-gray-800 outline-none"
        />

        {/* Password */}
        <div className="relative w-full">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full px-3 py-2 pr-10 border border-gray-800 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
          <p
            className="cursor-pointer"
            onClick={() => {
              setCurrentState(currentState === "Login" ? "Sign Up" : "Login");
              resetForm();
            }}
          >
            {currentState === "Login" ? "Create account" : "Login instead"}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white font-light px-8 py-2 mt-4 transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Please wait..."
            : currentState === "Login"
              ? "Sign In"
              : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;