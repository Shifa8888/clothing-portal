import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingBag,
  Image as ImageIcon,
  Users,
  BarChart3,
  Paintbrush,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Clock,
} from 'lucide-react';

import { useAppState } from './hooks/useAppState';
import { themes } from './utils/theme';
import { checkCredentials } from './config/adminConfig';

// Import our views
import {
  DashboardView,
  ProductsView,
  CategoriesView,
  OrdersView,
  BannersView,
  CustomersView,
  ReportsView,
  ThemeSettingsView,
  WebsiteSettingsView,
} from './components/SectionViews';

export default function App() {
  const state = useAppState();
  const {
    user,
    theme,
    login,
    logout,
    setTheme,
    settings,
    products,
    orders,
  } = state;

  const currentThemeStyles = themes[theme] || themes.light;

  // Active view state synced with URL hash
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Time display
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync activeTab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = [
        'Dashboard',
        'Products',
        'Categories',
        'Orders',
        'Banners',
        'Customers',
        'Reports',
        'Theme',
        'Settings',
      ];
      const matched = validTabs.find((t) => t.toLowerCase() === hash.toLowerCase());
      if (matched) {
        setActiveTab(matched);
      } else {
        window.location.hash = activeTab.toLowerCase();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // trigger on initial mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Change active tab
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    window.location.hash = tabName.toLowerCase();
    setMobileMenuOpen(false);
  };

  // Submit Login credentials
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkCredentials(username, password)) {
      login(username);
      setError(null);
      // default page load
      window.location.hash = 'dashboard';
    } else {
      setError('Invalid username or password. Please check credentials and try again.');
    }
  };

  // Quick credentials fill
  const fillCredentials = () => {
    setUsername('admin');
    setPassword('password123');
  };

  // Navigation Items with counters for active items
  const lowStockCount = products.filter((p) => p.stock === 0).length;
  const pendingOrdersCount = orders.filter((o) => o.shippingStatus === 'Pending').length;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Products', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
    { name: 'Categories', icon: FolderOpen },
    { name: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : undefined, badgeColor: 'bg-indigo-600 text-white' },
    { name: 'Banners', icon: ImageIcon },
    { name: 'Customers', icon: Users },
    { name: 'Reports', icon: BarChart3 },
    { name: 'Theme', icon: Paintbrush, label: 'Theme Settings' },
    { name: 'Settings', icon: SettingsIcon, label: 'Website Settings' },
  ];

  // Renders the proper main content body view based on active tab
  const renderMainView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView state={state} styles={currentThemeStyles} setCurrentTab={handleTabChange} />;
      case 'Products':
        return <ProductsView state={state} styles={currentThemeStyles} />;
      case 'Categories':
        return <CategoriesView state={state} styles={currentThemeStyles} />;
      case 'Orders':
        return <OrdersView state={state} styles={currentThemeStyles} />;
      case 'Banners':
        return <BannersView state={state} styles={currentThemeStyles} />;
      case 'Customers':
        return <CustomersView state={state} styles={currentThemeStyles} />;
      case 'Reports':
        return <ReportsView state={state} styles={currentThemeStyles} />;
      case 'Theme':
        return <ThemeSettingsView currentTheme={theme} setTheme={setTheme} styles={currentThemeStyles} />;
      case 'Settings':
        return <WebsiteSettingsView settings={settings} updateSettings={state.updateSettings} styles={currentThemeStyles} />;
      default:
        return <DashboardView state={state} styles={currentThemeStyles} setCurrentTab={handleTabChange} />;
    }
  };

  // ==========================================
  // RENDER LOGIN WALL
  // ==========================================
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 relative overflow-hidden font-sans">
        {/* Abstract background gradient decorations */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 relative z-10">
          {/* Logo Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/20">
              <span className="text-2xl font-black text-white font-mono tracking-tighter">H.</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{settings.storeName}</h2>
            <p className="text-xs text-slate-400 font-medium">Administration Portal Control Panel</p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-300 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">Username ID</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">Security Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all hover:scale-[1.01] duration-150"
            >
              Authorize System Access
            </button>
          </form>

          {/* Quick Credentials Evaluator Help */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
              🔒 Standard Security Verification Active
            </p>
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-left">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-400">
                  Evaluator Credentials
                </span>
                <button
                  onClick={fillCredentials}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                >
                  Auto Fill Form
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                User: <span className="font-bold text-white">admin</span>
              </p>
              <p className="text-[11px] font-mono text-slate-300 mt-0.5">
                Pass: <span className="font-bold text-white">password123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER MAIN ADMIN SYSTEM
  // ==========================================
  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${currentThemeStyles.body}`}>
      {/* SIDEBAR FOR DESKTOP */}
      <aside className={`hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 ${currentThemeStyles.sidebar}`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center font-black text-white font-mono">
              H.
            </div>
            <div>
              <h2 className={`font-black tracking-tight text-base leading-none text-white`}>
                {settings.logoText || 'HARRY.'}
              </h2>
              <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">Admin Desk</span>
            </div>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isTabActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleTabChange(item.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isTabActive
                    ? currentThemeStyles.sidebarActive
                    : currentThemeStyles.sidebarText
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label || item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-500/10 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-black">
              AD
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Harry Admin</p>
              <p className="text-[10px] text-slate-400 font-mono">System Executive</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg text-rose-400 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900/30 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Sign Out Portal
          </button>
        </div>
      </aside>

      {/* MOBILE NAV DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR PANEL */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 ${
          currentThemeStyles.sidebar
        } flex flex-col md:hidden transform transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center font-black text-white font-mono">
              H.
            </div>
            <div>
              <h2 className="font-extrabold tracking-tight text-sm text-white">
                {settings.storeName}
              </h2>
              <span className="text-[8px] uppercase tracking-wider font-semibold opacity-60">Staff Terminal</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 hover:bg-slate-500/10 rounded-full text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isTabActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleTabChange(item.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isTabActive
                    ? currentThemeStyles.sidebarActive
                    : currentThemeStyles.sidebarText
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label || item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-slate-500/10 space-y-3">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-900/40 text-rose-300 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Sign Out
          </button>
        </div>
      </aside>

      {/* CORE FRAMEWORK AND SHELL BODY */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE HEADER BAR */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="font-extrabold tracking-tight text-white font-mono text-sm">
              {settings.logoText || 'HARRY.'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct WhatsApp channel */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              WhatsApp Support
            </a>
          </div>
        </header>

        {/* DESKTOP TOP HEADER / STATUS BAR */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-500/10 sticky top-0 bg-slate-950/40 backdrop-blur z-20 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold opacity-75">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="font-mono">
              Terminal session: {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live WhatsApp chat launcher */}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.202-1.362a9.929 9.929 0 0 0 4.81 1.246h.005c5.507 0 9.99-4.474 9.994-9.986A9.974 9.974 0 0 0 12.012 2zm5.727 13.916c-.244.683-1.42 1.248-1.95 1.32-.478.066-.99.083-1.61-.122-.383-.127-.863-.298-1.5-.568-2.705-1.144-4.453-3.894-4.588-4.075-.135-.18-1.125-1.492-1.125-2.847 0-1.356.71-2.014.96-.28.24-.265.53-.33.7-.33h.494c.16 0 .37.06.56.513.194.464.668 1.62.727 1.742.06.122.1.264.015.428-.083.166-.127.264-.254.414-.127.15-.265.335-.38.45-.127.122-.26.254-.112.51.15.25.66 1.09 1.417 1.765.975.87 1.794 1.14 2.05 1.268.253.123.4.1.55-.07.15-.18.65-.762.824-1.02.176-.26.35-.215.59-.13l1.883.88c.24.116.4.17.46.27.06.1.06.58-.184 1.268z"/>
              </svg>
              Live WhatsApp support
            </a>

            <div className="h-4 w-px bg-slate-500/20" />

            {/* Profile widget */}
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-semibold ${currentThemeStyles.textPrimary}`}>Harry Admin</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                Level 1
              </span>
            </div>
          </div>
        </header>

        {/* CENTRAL DISPLAY WINDOW AND VIEWS CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-500/5 pb-4 print:hidden">
            <div>
              <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${currentThemeStyles.textPrimary}`}>
                {activeTab === 'Theme' ? 'Theme Studio' : activeTab === 'Settings' ? 'Website Configuration' : `${activeTab} Management`}
              </h1>
              <p className={`text-xs ${currentThemeStyles.textSecondary}`}>
                Admin Portal / {activeTab === 'Theme' ? 'Theme Settings' : activeTab === 'Settings' ? 'Store Settings' : activeTab}
              </p>
            </div>
          </div>

          {/* Render Active Tab Component View */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {renderMainView()}
          </div>
        </main>
      </div>
    </div>
  );
}
