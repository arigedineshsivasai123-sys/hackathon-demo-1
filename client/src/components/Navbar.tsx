import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Advisory', path: '/new-advisory', icon: PlusCircle, highlight: true },
    { name: 'History', path: '/history', icon: History },
    { name: 'Settings & Status', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
                  CropAdvisor
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                  AI
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide">
                Smart Agriculture Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map(link => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    link.highlight
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700'
                      : active
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-200/50 text-[11px] font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Gemini Ready</span>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase() || 'F'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-xl transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  link.highlight
                    ? 'bg-emerald-600 text-white'
                    : active
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-rose-600 font-semibold px-2.5 py-1 bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl"
                >
                  <UserIcon className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
