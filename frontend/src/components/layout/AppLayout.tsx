import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Map, CalendarCheck, LogOut, Bot, Menu, X, UserCircle, Briefcase } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Navigation Items
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/roadmap', icon: Map, label: t('roadmap') },
    { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { to: '/weekly-reviews', icon: CalendarCheck, label: t('weeklyReviews') },
    { to: '/profile', icon: UserCircle, label: t('profile') },
  ];

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Handle Theme application
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'dimmed');
    if (user?.theme === 'dark') {
      root.classList.add('dark');
    } else if (user?.theme === 'dimmed') {
      root.classList.add('dimmed');
    }
  }, [user?.theme]);

  return (
    <div className="flex h-screen bg-surface-alt overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-surface border-r border-border flex flex-col transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[80px]' : 'w-72 lg:w-64'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'lg:w-full lg:justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className={`transition-opacity duration-300 ${isCollapsed ? 'lg:hidden lg:opacity-0' : 'block opacity-100'}`}>
              <h1 className="text-sm font-bold text-text whitespace-nowrap">Siberbot</h1>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button 
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:bg-surface-alt transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-primary-50 text-primary border border-primary-light shadow-sm'
                  : 'text-text-secondary hover:bg-surface-alt hover:text-text'
                }
                ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`
              }
              title={isCollapsed ? label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isCollapsed ? 'lg:mx-auto' : ''}`} />
              <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'lg:hidden lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-border mt-auto">
          <div className={`flex items-center ${isCollapsed ? 'lg:flex-col lg:gap-3 lg:px-0 lg:py-1' : 'gap-3 px-2 py-2'} rounded-xl`}>
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-light flex items-center justify-center text-primary text-sm font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:hidden lg:opacity-0 lg:h-0' : 'opacity-100'}`}>
              <p className="text-sm font-medium text-text truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
            
            <button
              onClick={logout}
              className={`p-2 rounded-lg text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors shrink-0
                ${isCollapsed ? 'lg:w-full lg:flex lg:justify-center' : 'block'}
              `}
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header Bar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 -ml-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Desktop collapse toggle */}
            <button
              className="hidden lg:flex items-center justify-center w-8 h-8 -ml-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-border mx-2 hidden lg:block"></div>
            
            <p className="text-sm font-medium text-text hidden sm:block">
              {t('welcomeBack')}, <span className="font-bold text-primary">{user?.name?.split(' ')[0] || 'User'}</span>!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-lg border flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('online')}
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-surface-alt custom-scrollbar">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
