import { Link } from "react-router-dom";
import { ArrowRight, LogOut } from "lucide-react";

const ROLE_CONFIG = {
  admin: {
    label: "Administrator",
    color: "from-gold-400/20 to-gold-600/10",
    border: "border-gold-400/25",
    text: "text-gold-400",
    cta: "/dashboard",
    ctaLabel: "Open Dashboard",
  },
  staff: {
    label: "Staff Member",
    color: "from-blue-400/15 to-blue-600/10",
    border: "border-blue-400/25",
    text: "text-blue-400",
    cta: "/dashboard",
    ctaLabel: "Go to Dashboard",
  },
  customer: {
    label: "Customer",
    color: "from-emerald-400/15 to-emerald-600/10",
    border: "border-emerald-400/25",
    text: "text-emerald-400",
    cta: "/my-orders",
    ctaLabel: "Track My Orders",
  },
};

const LoggedInBanner = ({ user, logout }) => {
  const cfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.customer;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r ${cfg.color} border-b ${cfg.border} backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
        {/* Left — user info */}
        <div className="flex items-center gap-2.5 text-sm">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${cfg.text}`}
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {user.name[0].toUpperCase()}
          </div>
          <span className="text-gray-400">
            Logged in as{" "}
            <span className={`font-semibold ${cfg.text}`}>{user.name}</span>
            <span className="text-gray-600 ml-1.5">({cfg.label})</span>
          </span>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-3">
          <Link
            to={cfg.cta}
            className={`text-xs font-medium ${cfg.text} hover:underline flex items-center gap-1`}
          >
            {cfg.ctaLabel} <ArrowRight size={12} />
          </Link>
          <button
            onClick={logout}
            className="text-xs text-gray-600 hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoggedInBanner;