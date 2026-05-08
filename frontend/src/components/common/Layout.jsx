import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
      <footer className="border-t border-white/5 py-5 text-center">
        <p className="text-xs text-gray-700 font-body">
          CleanPress © {new Date().getFullYear()} — Laundry Order Management System
        </p>
      </footer>
    </div>
  );
};

export default Layout;
