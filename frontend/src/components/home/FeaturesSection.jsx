import { Zap, BarChart2, Shield, Smartphone, Clock, IndianRupee } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Order Creation",
    desc: "Create a complete order with itemized billing in under 30 seconds. Auto-calculated totals, no math required.",
    accent: "gold",
  },
  {
    icon: BarChart2,
    title: "Live Dashboard",
    desc: "Real-time revenue tracking, status breakdown charts, and top-garment analytics at a glance.",
    accent: "blue",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "3 roles: Admin (full access), Staff (operations), Customer (own orders only). Secure and organized.",
    accent: "emerald",
  },
  {
    icon: Smartphone,
    title: "Customer OTP Login",
    desc: "Customers login with phone + real SMS OTP. No passwords to remember — just track your clothes.",
    accent: "violet",
  },
  {
    icon: Clock,
    title: "Status Tracking",
    desc: "Four-stage workflow: Received → Processing → Ready → Delivered. Full history logged per order.",
    accent: "amber",
  },
  {
    icon: IndianRupee,
    title: "Smart Billing",
    desc: "Pre-configured Indian garment prices. Instantly compute bills with live quantity multipliers.",
    accent: "rose",
  },
];

const ACCENT_CLASSES = {
  gold:    "text-gold-400 bg-gold-400/10 border-gold-400/20",
  blue:    "text-blue-400 bg-blue-400/10 border-blue-400/20",
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  violet:  "text-violet-400 bg-violet-400/10 border-violet-400/20",
  amber:   "text-amber-400 bg-amber-400/10 border-amber-400/20",
  rose:    "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const FeaturesSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="font-mono text-gold-400 text-xs tracking-widest uppercase mb-3">
          Everything You Need
        </p>
        <h2 className="font-display font-bold text-4xl text-cream-100">
          Built for the Dry Cleaning Business
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="glass-card p-6 hover:border-white/20 transition-all duration-300 opacity-0 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
          >
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${ACCENT_CLASSES[f.accent]}`}
            >
              <f.icon size={20} />
            </div>
            <h3 className="font-display font-semibold text-base text-cream-100 mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;