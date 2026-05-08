import { CheckCircle, ShieldCheck, Users, UserCircle } from "lucide-react";

const ROLES = [
  {
    role: "Admin",
    icon: ShieldCheck,
    cardClass: "border-gold-400/25 bg-gold-400/5",
    iconClass: "text-gold-400",
    badgeClass: "text-gold-400 bg-gold-400/10",
    perms: [
      "Full dashboard & revenue",
      "Create & delete orders",
      "Manage staff accounts",
      "All analytics & charts",
    ],
  },
  {
    role: "Staff",
    icon: Users,
    cardClass: "border-blue-400/25 bg-blue-400/5",
    iconClass: "text-blue-400",
    badgeClass: "text-blue-400 bg-blue-400/10",
    perms: [
      "Create new orders",
      "Update order status",
      "View all orders",
      "No revenue data",
    ],
  },
  {
    role: "Customer",
    icon: UserCircle,
    cardClass: "border-emerald-400/25 bg-emerald-400/5",
    iconClass: "text-emerald-400",
    badgeClass: "text-emerald-400 bg-emerald-400/10",
    perms: [
      "OTP phone login",
      "Track own orders only",
      "See delivery dates",
      "No staff features",
    ],
  },
];

const RolesSection = () => (
  <section className="py-24 px-6 relative">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="font-mono text-gold-400 text-xs tracking-widest uppercase mb-3">
          Role-Based Access
        </p>
        <h2 className="font-display font-bold text-4xl text-cream-100">
          The Right Access for Everyone
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROLES.map(({ role, icon: Icon, cardClass, iconClass, badgeClass, perms }) => (
          <div
            key={role}
            className={`glass-card p-8 border rounded-3xl transition-all duration-300 hover:-translate-y-1 ${cardClass}`}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 ${iconClass}`}
            >
              <Icon size={24} strokeWidth={1.5} />
            </div>

            {/* Title + badge */}
            <h3 className="text-xl font-display font-bold text-cream-100 mb-2">{role}</h3>
            <span
              className={`text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full border border-current/20 ${badgeClass}`}
            >
              Access Level
            </span>

            {/* Permissions list */}
            <ul className="mt-8 space-y-4">
              {perms.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-gray-400 leading-tight">
                  <CheckCircle size={14} className={`${iconClass} mt-0.5 flex-shrink-0 opacity-70`} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RolesSection;