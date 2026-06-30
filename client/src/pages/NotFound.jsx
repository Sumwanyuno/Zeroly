import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass, ArrowLeft, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="text-center max-w-2xl mx-auto">
        {/* Animated 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-6"
        >
          <span
            className="text-[10rem] md:text-[14rem] font-extrabold leading-none tracking-tighter select-none"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, #10b981 50%, hsl(var(--primary)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>

          {/* Floating leaf icon */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 right-8 md:right-24 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-lg backdrop-blur-sm"
          >
            <Leaf className="w-8 h-8" />
          </motion.div>
        </motion.div>

        {/* Glassmorphic card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Looks like this page has gone zero-waste — it no longer exists! Let's
            get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 shadow-xl shadow-primary/20 h-14 text-base font-bold hover:scale-105 transition-transform"
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl px-8 h-14 text-base font-bold hover:scale-105 transition-transform border-border/60 backdrop-blur-sm"
            >
              <Link to="/explore" className="flex items-center gap-2">
                <Compass className="w-5 h-5" />
                Explore Items
              </Link>
            </Button>
          </div>

          {/* Quick navigation links */}
          <div className="mt-10 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">
              Quick Links
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { to: "/login", label: "Login" },
                { to: "/register", label: "Register" },
                { to: "/leaderboard", label: "Leaderboard" },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/40 transition-all duration-200 hover:border-primary/30"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors mx-auto group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Go back to previous page
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
