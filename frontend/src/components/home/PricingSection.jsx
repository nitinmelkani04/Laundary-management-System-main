import { kurta, lehenga, blanket } from "../../assets/clothesImages";

const GARMENTS = [
  {
    name: "Shirt",
    price: 50,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Pants",
    price: 70,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Saree",
    price: 150,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Suit",
    price: 250,
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Jacket",
    price: 200,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400",
  },
  { name: "Kurta",   price: 80,  image: kurta   },
  { name: "Lehenga", price: 300, image: lehenga },
  { name: "Blanket", price: 200, image: blanket },
];

const PricingSection = () => (
  <section className="py-24 px-6 relative">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="font-mono text-gold-400 text-xs tracking-widest uppercase mb-3">
          Transparent Pricing
        </p>
        <h2 className="font-display font-bold text-4xl text-cream-100">
          Pre-configured Garment Rates
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {GARMENTS.map((item, i) => (
          <div
            key={item.name}
            className="group glass-card overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-900">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            {/* Label + price */}
            <div className="p-5 text-center">
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 group-hover:text-gold-400 transition-colors">
                {item.name}
              </p>
              <p className="font-display font-bold text-2xl text-gold-gradient">
                ₹{item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;