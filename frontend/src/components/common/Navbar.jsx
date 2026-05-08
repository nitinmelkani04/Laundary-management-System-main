

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, PlusCircle,
  LogOut, Menu, X, Package, Users,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { pathname } = useLocation();
  
  const { user, logout, isCustomer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Different nav links per role
  const navLinks = isCustomer
    ? [
        { to: '/my-orders', label: 'My Orders', icon: Package },
      ]
    : isAdmin
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/orders', label: 'Orders', icon: ShoppingBag },
        { to: '/orders/new', label: 'New Order', icon: PlusCircle },
        { to: '/staff', label: 'Staff', icon: Users },  // Admin only
      ]
    : [
        // Staff links — no /staff page
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/orders', label: 'Orders', icon: ShoppingBag },
        { to: '/orders/new', label: 'New Order', icon: PlusCircle },
      ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate(isCustomer ? '/customer-login' : '/');
    setMenuOpen(false);
  };

  const logoGradient = isCustomer
    ? 'from-emerald-400 to-emerald-600'
    : 'from-gold-400 to-gold-600';

  const activeLinkClass = isCustomer
    ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
    : 'bg-gold-500/10 text-gold-400 border border-gold-500/20';

  const roleColor = isCustomer
    ? 'text-emerald-400 bg-emerald-400/10'
    : isAdmin
    ? 'text-gold-400 bg-gold-400/10'
    : 'text-blue-400 bg-blue-400/10';

  const avatarColor = isCustomer
    ? 'bg-emerald-400/15 border-emerald-400/25 text-emerald-400'
    : isAdmin
    ? 'bg-gold-400/15 border-gold-400/25 text-gold-400'
    : 'bg-blue-400/15 border-blue-400/25 text-blue-400';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-charcoal-900/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to={user ? (isCustomer ? '/my-orders' : '/dashboard') : '/'}
          className="flex items-center gap-2.5 group"
        >
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${logoGradient} flex items-center justify-center shadow-lg`}>
            <span className="text-charcoal-900 font-display font-black text-sm">C</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-cream-100 group-hover:text-gold-400 transition-colors">
              CleanPress
            </span>
            {user && (
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded-md hidden sm:inline ${roleColor}`}>
                {user.role}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop nav */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === to 
                    ? activeLinkClass
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Desktop user info */}
              <div className="hidden md:flex items-center gap-2.5">
                <div className="text-right">
                  <p className="text-xs text-gray-600 leading-none mb-0.5 capitalize">
                    {user.role}
                  </p>
                  <p className="text-sm font-medium text-cream-100 leading-none">
                    {user.name}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-sm font-bold flex-shrink-0 ${avatarColor}`}>
                  {user.name[0].toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-gray-500 hover:text-rose-400 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
                >
                  <LogOut size={15} />
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-gray-400 hover:text-gold-400 transition-colors p-1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            /* Not logged in */
            <div className="flex items-center gap-2">
              <Link
                to="/customer-login"
                className="text-sm text-emerald-400 hover:underline px-3 py-1.5 hidden sm:block"
              >
                Track Order
              </Link>
              <Link
                to="/login"
                className="text-sm bg-gold-400/10 border border-gold-400/25 text-gold-400 hover:bg-gold-400/20 transition-all px-3.5 py-1.5 rounded-lg font-medium"
              >
                Staff Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-charcoal-900/97 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
          {/* User info */}
          <div className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl bg-white/3 border border-white/5`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border text-sm font-bold flex-shrink-0 ${avatarColor}`}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-cream-100">{user.name}</p>
              <p className={`text-xs font-mono ${roleColor.split(' ')[0]}`}>{user.role}</p>
            </div>
          </div>

          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === to ? activeLinkClass : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all mt-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
