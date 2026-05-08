const STEPS = [
  {
    num: "01",
    title: "Create an Order",
    desc: "Staff enters customer name, phone, and garments. Bill is auto-calculated instantly.",
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400",
  },
  {
    num: "02",
    title: "Track Progress",
    desc: "Update status as clothes move through Received → Processing → Ready → Delivered.",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=400",
  },
  {
    num: "03",
    title: "Customer Tracks Too",
    desc: "Customer logs in with phone OTP and sees their order status in real-time.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=400",
  },
];

const HowItWorksSection = () => (
  <section className="py-24 px-6 relative overflow-hidden">
    {/* Background glow */}
    <div
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at 50% 50%, #f0c040, transparent 70%)" }}
    />

    <div className="relative max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="font-mono text-gold-400 text-xs tracking-widest uppercase mb-3">
          Simple Workflow
        </p>
        <h2 className="font-display font-bold text-4xl text-cream-100">
          How CleanPress Works
        </h2>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {STEPS.map((step) => (
          <div key={step.num} className="flex flex-col items-center text-center group">
            {/* Image with step badge */}
            <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden glass-card border border-gold-500/25 gold-glow transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                <span className="font-display font-black text-sm text-gold-gradient">
                  {step.num}
                </span>
              </div>
            </div>

            <h3 className="font-display font-semibold text-xl text-cream-100 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;