import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#0a0a0a] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-display font-bold text-2xl text-gold-gradient mb-4 italic tracking-tighter">
            CleanPress
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Premium garment care services tailored for your lifestyle. We treat your clothes with the precision and care they deserve.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-400/50 transition-all duration-300">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-cream-100 font-semibold mb-6 text-sm uppercase tracking-widest">Quick Links</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            {['Services', 'Pricing', 'Track Order', 'About Us', 'Contact'].map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-gold-400 transition-colors duration-200">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-cream-100 font-semibold mb-6 text-sm uppercase tracking-widest">Contact Us</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-gold-400 shrink-0" />
              <span>123 Laundry Lane, Clean City, IND 110001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-gold-400 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-gold-400 shrink-0" />
              <span>support@cleanpress.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-cream-100 font-semibold mb-6 text-sm uppercase tracking-widest">Newsletter</h4>
          <p className="text-gray-500 text-sm mb-4">Get updates on your order status and special offers.</p>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-cream-100 focus:outline-none focus:border-gold-500/50 transition-all"
            />
            <button className="absolute right-2 top-2 w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-black hover:bg-gold-400 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4">
        <p className="text-gray-600 text-[10px] uppercase tracking-widest">
          © 2026 CleanPress Laundry. All Rights Reserved.
        </p>
        <div className="flex gap-8 text-gray-600 text-[10px] uppercase tracking-widest">
          <a href="#" className="hover:text-gold-400">Privacy Policy</a>
          <a href="#" className="hover:text-gold-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;