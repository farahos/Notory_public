import { Link, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / User */}
          <Link to="/" className="flex items-center space-x-2">
            <FaUserCircle className="text-blue-600 text-2xl" />
            <span className="font-semibold text-gray-800 uppercase">
              {user ? user.username : "notorySys"}
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
      

            {!user && (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium pb-1 ${
                    isActive("/login")
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Gal Hadda
                </Link>

              
              </>
            )}

            {user && (
              <button
                onClick={logout}
                className="text-sm font-medium text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
              >
                Kabax
              </button>
            )}
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div ref={menuRef} className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              

              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium ${
                      isActive("/login") ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    Gal Hadda
                  </Link>

                 
                </>
              )}

              {user && (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-sm font-medium text-white bg-red-600 px-4 py-2 rounded-md w-fit"
                >
                  Kabax
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
