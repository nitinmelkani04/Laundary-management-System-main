import { Link } from "react-router-dom";
import { ArrowRight, Phone, Star } from "lucide-react";

const CtaSection = ({ isAuthenticated, isCustomer }) => (
  <section className="py-24 px-6">
    <div className="max-w-3xl mx-auto text-center">
      <div className="glass-card p-12 gold-glow relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, #f0c040, transparent 60%)" }}
        />

        <div className="relative">
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-gold-400 fill-gold-400" />
            ))}
          </div>

          <h2 className="font-display font-bold text-4xl text-cream-100 mb-4">
            Ready to Streamline Your Store?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            CleanPress manages your entire laundry workflow — from counter to customer.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/customer-login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all text-sm"
                >
                  <Phone size={16} /> Track My Order
                </Link>
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
                >
                  Staff Login <ArrowRight size={16} />
                </Link>
              </>
            ) : isCustomer ? (
              <Link
                to="/my-orders"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
              >
                My Orders <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
              >
                Open Dashboard <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;