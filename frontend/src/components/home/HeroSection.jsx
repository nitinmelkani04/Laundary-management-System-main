import { Link } from "react-router-dom";
import { ArrowRight, Package, Phone, LayoutDashboard } from "lucide-react";

const STATS = [
  { label: "Orders Managed", value: "10K+" },
  { label: "Happy Stores",   value: "200+" },
  { label: "Garment Types",  value: "12+"  },
];

const HeroSection = ({ isAuthenticated, user, isCustomer }) => (
  <section className="relative top-16 min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background orbs + grid */}
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #f0c040, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
      />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,192,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(240,192,64,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>

    <div className="relative text-center max-w-4xl mx-auto px-6">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/25 text-gold-400 text-xs font-mono px-4 py-2 rounded-full mb-8 animate-fade-in">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
        AI-First Laundry Management System
      </div>

      {/* Headline */}
      <h1
        className="font-display font-black mb-6 opacity-0 animate-fade-up"
        style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1.05, animationFillMode: "forwards" }}
      >
        Manage Your <span className="text-gold-gradient">Dry Cleaning</span>
        <br />
        Orders Effortlessly
      </h1>

      {/* Subheading */}
      <p
        className="font-body text-gray-400 text-lg max-w-xl mx-auto mb-10 opacity-0 animate-fade-up stagger-2"
        style={{ animationFillMode: "forwards" }}
      >
        From order creation to delivery — track every garment, calculate bills
        instantly, and keep customers happy with real-time status updates.
      </p>

      {/* CTAs */}
      <div
        className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-up stagger-3"
        style={{ animationFillMode: "forwards" }}
      >
        {!isAuthenticated ? (
          <>
            <Link
              to="/customer-login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all font-semibold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              <Phone size={18} /> Track My Order
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gold-400/30 text-gold-400 hover:bg-gold-400/10 transition-all text-base font-medium"
            >
              Staff Login <ArrowRight size={18} />
            </Link>
          </>
        ) : isCustomer ? (
          <Link
            to="/my-orders"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
          >
            <Package size={18} /> My Orders
          </Link>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              to="/orders/new"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gold-400/30 text-gold-400 hover:bg-gold-400/10 transition-all text-base font-medium"
            >
              New Order <ArrowRight size={18} />
            </Link>
          </>
        )}
      </div>

      {/* Welcome card (when logged in) */}
      {isAuthenticated && (
        <div
          className="mt-10 inline-flex items-center gap-3 glass-card px-5 py-3 opacity-0 animate-fade-up stagger-4"
          style={{ animationFillMode: "forwards" }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isCustomer ? "bg-emerald-400/20 text-emerald-400" : "bg-gold-400/20 text-gold-400"
            }`}
          >
            {user.name[0].toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-600">Welcome back</p>
            <p className="text-sm font-medium text-cream-100">
              {user.name}
              <span
                className={`ml-2 text-xs font-mono px-1.5 py-0.5 rounded ${
                  isCustomer
                    ? "text-emerald-400 bg-emerald-400/10"
                    : user.role === "admin"
                      ? "text-gold-400 bg-gold-400/10"
                      : "text-blue-400 bg-blue-400/10"
                }`}
              >
                {user.role}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div
        className="mt-16 flex flex-wrap justify-center gap-6 opacity-0 animate-fade-up stagger-4"
        style={{ animationFillMode: "forwards" }}
      >
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display font-bold text-2xl text-gold-gradient">{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;