import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center font-bold text-xl">
            <span>💪 Gym Manager</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`hover:bg-blue-700 px-3 py-2 rounded ${
                router.pathname === '/dashboard' ? 'bg-blue-700' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/customers"
              className={`hover:bg-blue-700 px-3 py-2 rounded ${
                router.pathname === '/customers' ? 'bg-blue-700' : ''
              }`}
            >
              Customers
            </Link>
            <Link
              href="/payments"
              className={`hover:bg-blue-700 px-3 py-2 rounded ${
                router.pathname === '/payments' ? 'bg-blue-700' : ''
              }`}
            >
              Payments
            </Link>
            <div className="flex items-center space-x-4 border-l border-blue-400 pl-6">
              <span className="text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center hover:bg-blue-700 px-3 py-2 rounded transition"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-blue-700"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block hover:bg-blue-700 px-3 py-2 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/customers"
              className="block hover:bg-blue-700 px-3 py-2 rounded"
            >
              Customers
            </Link>
            <Link
              href="/payments"
              className="block hover:bg-blue-700 px-3 py-2 rounded"
            >
              Payments
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left hover:bg-blue-700 px-3 py-2 rounded transition flex items-center"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
