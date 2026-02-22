import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLoginModal from "./AdminLoginModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="bg-neutral text-white px-6 py-4 shadow-lg border-b-4 border-brand relative z-40">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter hover:text-brand transition-colors z-50 relative">
            RATE<span className="text-brand">IT</span>.
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 relative text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 font-medium text-sm">
            <NavLinks user={user} logout={logout} setShowAdminLogin={setShowAdminLogin} />
          </div>
        </div>

        {/* Mobile Navigation details */}
        <div className={`md:hidden fixed inset-0 bg-neutral/95 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col items-center gap-8 text-xl font-bold" onClick={() => setIsMenuOpen(false)}>
            <NavLinks user={user} logout={logout} setShowAdminLogin={setShowAdminLogin} mobile />
          </div>
        </div>
      </nav>
      {showAdminLogin && <AdminLoginModal onClose={() => setShowAdminLogin(false)} />}
    </>
  );
}

// Reusable Nav Links Component
function NavLinks({ user, logout, setShowAdminLogin, mobile }) {
  return (
    <>
      {!user ? (
        <>
          <button
            onClick={() => setShowAdminLogin(true)}
            className={`text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider ${mobile ? 'text-sm' : 'text-xs'}`}
          >
            Admin Login
          </button>
          {!mobile && <div className="h-4 w-px bg-gray-700 mx-2"></div>}
          <Link to="/" className="hover:text-brand transition-colors">Login</Link>
          <Link to="/signup" className={`bg-brand rounded-full hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 ${mobile ? 'px-8 py-3' : 'px-5 py-2'}`}>
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <span className={`${mobile ? 'block text-center' : 'hidden md:block'} text-gray-400`}>
            Welcome, <span className="text-white font-bold">{user.name}</span>
          </span>
          <Link to="/dashboard" className="hover:text-brand transition-colors uppercase tracking-wider font-bold">
            Dashboard
          </Link>
          <button
            onClick={logout}
            className={`bg-gray-800 border border-gray-700 rounded-lg hover:bg-brand hover:border-brand transition-all uppercase font-bold ${mobile ? 'px-8 py-3 w-full' : 'px-4 py-2 text-xs'}`}
          >
            Logout
          </button>
        </>
      )}
    </>
  );
}
