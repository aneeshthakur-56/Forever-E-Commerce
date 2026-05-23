const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">

      {/* Logo / Brand mark */}
      <div className="mb-8 flex items-center gap-2">
        <span className="text-2xl font-light tracking-[0.3em] text-black uppercase">
          Forever
        </span>
      </div>

      {/* Animated bars */}
      <div className="flex items-end gap-1 h-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 bg-black rounded-full animate-bounce"
            style={{
              height: `${20 + i * 6}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
        {[3, 2, 1, 0].map((i, idx) => (
          <div
            key={`r-${i}`}
            className="w-1 bg-black rounded-full animate-bounce"
            style={{
              height: `${20 + i * 6}px`,
              animationDelay: `${(5 + idx) * 0.1}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>

      {/* Indeterminate loading bar */}
      <div className="mt-8 w-48 h-[2px] bg-gray-200 overflow-hidden rounded-full relative">
        <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-orange-500 rounded-full loading-bar-animation" />
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .loading-bar-animation {
          animation: loadingBar 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* Message */}
      <p className="mt-4 text-xs tracking-widest text-gray-500 uppercase font-medium">
        {message}
      </p>
    </div>
  );
};

export default Loading;
