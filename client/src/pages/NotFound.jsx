import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_60%)]" />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[140px]" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        {/* 404 */}
        <h1 className="select-none text-[140px] font-black leading-none text-transparent bg-gradient-to-b from-white to-gray-500 bg-clip-text sm:text-[180px]">
          404
        </h1>

        {/* Badge */}
        <div className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400 backdrop-blur">
          Page Not Found
        </div>

        {/* Heading */}
        <h2 className="mb-4 text-4xl font-bold">
          Looks like this page has been
          <span className="text-emerald-400"> recycled.</span>
        </h2>

        {/* Description */}
        <p className="max-w-2xl text-lg leading-relaxed text-gray-400">
          The page you're looking for doesn't exist, may have been moved,
          or was never here in the first place. Let's get you back to
          discovering and sharing sustainably.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            <Home size={20} />
            Back Home
          </Link>

          <Link
            to="/explore"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/10"
          >
            <Search size={20} />
            Explore Items
          </Link>
        </div>

        {/* Bottom Card */}
        <div className="mt-16 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center justify-center gap-3">
            <ArrowLeft className="text-emerald-400" size={22} />
            <p className="text-gray-300">
              Lost? Use the navigation menu above or return to the homepage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}