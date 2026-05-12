import React, { useState, useMemo } from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Upload,
  TrendingUp,
  MapPin,
  Download,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Product, Category, Order, Banner, Customer, WebsiteSettings, ActivityLog } from '../data/mockData';
import { ThemeStyles } from '../utils/theme';
import { convertFileToBase64 } from '../utils/imageHelper';
import { SalesAreaChart, OrdersBarChart, CategoryShareDonut } from './AnalyticsCharts';

// Helper to format currency
const formatPrice = (amount: number, settings: WebsiteSettings) => {
  return `${settings.currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ==========================================
// 1. DASHBOARD VIEW
// ==========================================
export const DashboardView: React.FC<{
  state: any;
  styles: ThemeStyles;
  setCurrentTab: (tab: string) => void;
}> = ({ state, styles, setCurrentTab }) => {
  const { products, orders, customers, settings, activityLogs } = state;

  // Calculate real-time stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = customers.length;
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o: Order) => o.paymentStatus === 'Paid')
      .reduce((acc: number, curr: Order) => acc + curr.totalAmount, 0);
  }, [orders]);

  // Sales trend data (last 7 days derived from orders or mock date series)
  const salesTrend = useMemo(() => {
    // Generates sales trend for the past 7 days
    // We can map mock values, but let's base it on actual paid orders or standard weighted trend
    return [
      { label: 'Jan 20', value: 850 },
      { label: 'Jan 21', value: 1200 },
      { label: 'Jan 22', value: 1540 },
      { label: 'Jan 23', value: 1100 },
      { label: 'Jan 24', value: 1850 },
      { label: 'Jan 25', value: 2100 },
      { label: 'Jan 26', value: totalRevenue > 0 ? Math.min(totalRevenue, 3500) : 1600 },
    ];
  }, [totalRevenue]);

  const ordersTrend = useMemo(() => {
    return [
      { label: 'Jan 20', value: 4 },
      { label: 'Jan 21', value: 6 },
      { label: 'Jan 22', value: 9 },
      { label: 'Jan 23', value: 5 },
      { label: 'Jan 24', value: 12 },
      { label: 'Jan 25', value: 15 },
      { label: 'Jan 26', value: totalOrders },
    ];
  }, [totalOrders]);

  // Category distribution data calculated from current products
  const categoryShare = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p: Product) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const colors = [
      'bg-indigo-500',
      'bg-violet-500',
      'bg-amber-500',
      'bg-emerald-500',
      'bg-rose-500',
      'bg-cyan-500',
    ];

    return Object.keys(counts).map((catName, index) => ({
      category: catName,
      count: counts[catName],
      color: colors[index % colors.length],
    }));
  }, [products]);

  // Quick stats card data
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue, settings),
      change: '+14.2% from last month',
      isPositive: true,
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-500/10',
      tab: 'Reports',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: '+8.4% from last week',
      isPositive: true,
      icon: ShoppingBag,
      color: 'text-indigo-500 bg-indigo-500/10',
      tab: 'Orders',
    },
    {
      title: 'Products Stock',
      value: totalProducts.toString(),
      change: `${products.filter((p: Product) => p.stock === 0).length} Out of stock`,
      isPositive: false,
      icon: Package,
      color: 'text-amber-500 bg-amber-500/10',
      tab: 'Products',
    },
    {
      title: 'Active Customers',
      value: totalUsers.toString(),
      change: '+12.5% registration rate',
      isPositive: true,
      icon: Users,
      color: 'text-violet-500 bg-violet-500/10',
      tab: 'Customers',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Announcement Banner Display */}
      {settings.announcementText && (
        <div className="bg-gradient-to-r from-amber-500/20 via-yellow-600/10 to-amber-500/20 border border-amber-500/30 text-amber-500 px-4 py-3 rounded-xl flex items-center gap-3 text-xs md:text-sm font-medium">
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span className="truncate">{settings.announcementText}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentTab(card.tab)}
            className={`${styles.card} p-5 cursor-pointer flex items-center justify-between group`}
          >
            <div className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-wider ${styles.textSecondary}`}>
                {card.title}
              </span>
              <div className={`text-2xl md:text-3xl font-bold font-mono tracking-tight ${styles.textPrimary}`}>
                {card.value}
              </div>
              <p
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  card.isPositive ? 'text-emerald-500' : 'text-amber-500'
                }`}
              >
                {card.change}
              </p>
            </div>
            <div className={`p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${styles.card} p-5 lg:col-span-2`}>
          <SalesAreaChart
            data={salesTrend}
            color={styles.accentColor}
            title="Weekly Sales Revenue Trends"
            suffix={settings.currencySymbol}
          />
        </div>
        <div className={`${styles.card} p-5`}>
          <CategoryShareDonut data={categoryShare} title="Store Inventory Breakdown" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${styles.card} p-5`}>
          <OrdersBarChart data={ordersTrend} color={styles.accentColor} title="Weekly Order Fulfillments" />
        </div>

        {/* Recent Activity Log */}
        <div className={`${styles.card} p-5 lg:col-span-2 flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase opacity-80">Recent Store Activities</h4>
            <span className="text-xs font-mono font-bold opacity-60">System Logs</span>
          </div>
          <div className="space-y-3.5 flex-1 max-h-[160px] overflow-y-auto pr-1">
            {activityLogs.map((log: ActivityLog) => {
              const colorsMap = {
                product: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5',
                order: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
                setting: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
                category: 'border-violet-500/30 text-violet-400 bg-violet-500/5',
                customer: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
                banner: 'border-rose-500/30 text-rose-400 bg-rose-500/5',
              };
              const badgeClass = colorsMap[log.type] || 'border-slate-500/30 text-slate-400 bg-slate-500/5';

              return (
                <div key={log.id} className="flex items-start gap-3 text-xs border-b border-dashed border-slate-500/10 pb-2">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-mono tracking-wider uppercase ${badgeClass}`}>
                    {log.type}
                  </span>
                  <div className="flex-1">
                    <p className={`font-semibold ${styles.textPrimary}`}>{log.action}</p>
                    <p className={`text-[11px] mt-0.5 ${styles.textSecondary}`}>{log.details}</p>
                  </div>
                  <span className={`text-[10px] font-mono shrink-0 ${styles.textSecondary}`}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Orders List */}
      <div className={styles.card}>
        <div className={`${styles.cardHeader} flex justify-between items-center`}>
          <h3 className={`font-semibold tracking-wide ${styles.textPrimary}`}>Recent Orders List</h3>
          <button
            onClick={() => setCurrentTab('Orders')}
            className={`text-xs font-semibold flex items-center gap-1 hover:underline text-${styles.accentColor}-500`}
          >
            View All Orders <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Shipping</th>
                <th className="px-6 py-3 font-semibold">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10 text-xs">
              {orders.slice(0, 3).map((order: Order) => (
                <tr key={order.id} className={styles.tableRowHover}>
                  <td className="px-6 py-4 font-mono font-semibold">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{order.customerName}</div>
                    <div className={`text-[10px] ${styles.textSecondary}`}>{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {new Date(order.orderDate).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold">{formatPrice(order.totalAmount, settings)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        order.shippingStatus === 'Delivered'
                          ? styles.badgeSuccess
                          : order.shippingStatus === 'Shipped'
                          ? styles.badgeInfo
                          : order.shippingStatus === 'Processing'
                          ? styles.badgeWarning
                          : styles.badgeDanger
                      }
                    >
                      {order.shippingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={order.paymentStatus === 'Paid' ? styles.badgeSuccess : styles.badgeDanger}>
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. PRODUCTS SECTION
// ==========================================
export const ProductsView: React.FC<{
  state: any;
  styles: ThemeStyles;
}> = ({ state, styles }) => {
  const { products, categories, settings, addProduct, editProduct, deleteProduct } = state;

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStock, setFormStock] = useState(0);
  const [formSku, setFormSku] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Draft'>('Active');
  const [formImage, setFormImage] = useState('');

  // Handle Form open for Add
  const handleOpenAdd = () => {
    setEditId(null);
    setFormName('');
    setFormDesc('');
    setFormPrice(0);
    setFormSalePrice('');
    setFormCategory(categories[0]?.name || '');
    setFormStock(10);
    setFormSku(`HS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
    setFormStatus('Active');
    setFormImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400');
    setIsModalOpen(true);
  };

  // Handle Form open for Edit
  const handleOpenEdit = (p: Product) => {
    setEditId(p.id);
    setFormName(p.name);
    setFormDesc(p.description);
    setFormPrice(p.price);
    setFormSalePrice(p.salePrice?.toString() || '');
    setFormCategory(p.category);
    setFormStock(p.stock);
    setFormSku(p.sku);
    setFormStatus(p.status);
    setFormImage(p.image);
    setIsModalOpen(true);
  };

  // File Upload base64 simulation
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormImage(base64);
      } catch (err) {
        console.error('Image upload simulation error:', err);
      }
    }
  };

  // Save/Submit Product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name: formName,
      description: formDesc,
      price: Number(formPrice),
      salePrice: formSalePrice ? Number(formSalePrice) : undefined,
      category: formCategory,
      stock: Number(formStock),
      sku: formSku,
      status: formStatus,
      image: formImage,
    };

    if (editId) {
      editProduct(editId, productPayload);
    } else {
      addProduct(productPayload);
    }
    setIsModalOpen(false);
  };

  // Filter & Search Products
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter ? p.category === catFilter : true;
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, catFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filters bar */}
      <div className={`${styles.card} p-4 flex flex-col md:flex-row gap-4 items-center justify-between`}>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products, SKUs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${styles.input} pl-9 w-full py-1.5 text-xs`}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className={`${styles.input} text-xs py-1.5 pr-8`}
            >
              <option value="">All Categories</option>
              {categories.map((c: Category) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${styles.input} text-xs py-1.5 pr-8`}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <button onClick={handleOpenAdd} className={`${styles.buttonPrimary} text-xs py-2 px-4 flex items-center gap-1.5`}>
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Products Table Card */}
      <div className={`${styles.card} overflow-hidden`}>
        {/* Mobile-First Products Card view (Block layout for small viewports) */}
        <div className="block md:hidden divide-y divide-slate-500/10 text-xs">
          {filteredProducts.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 font-semibold font-mono">
              No products found matching filters.
            </div>
          ) : (
            filteredProducts.map((p: Product) => (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-500/10 flex items-center justify-center">
                    <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">{p.sku}</span>
                      <span className={p.status === 'Active' ? styles.badgeSuccess : styles.badgeWarning}>
                        {p.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm truncate mt-1">{p.name}</h4>
                    <p className={`text-[10px] ${styles.textSecondary} line-clamp-1 mt-0.5`}>{p.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-black/10 p-2.5 rounded-lg border border-slate-500/5 text-[11px]">
                  <div>
                    <span className="opacity-60 block">Price:</span>
                    {p.salePrice ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-500">{formatPrice(p.salePrice, settings)}</span>
                        <span className="line-through text-[10px] opacity-50">{formatPrice(p.price, settings)}</span>
                      </div>
                    ) : (
                      <span className="font-bold">{formatPrice(p.price, settings)}</span>
                    )}
                  </div>
                  <div>
                    <span className="opacity-60 block">Inventory:</span>
                    {p.stock > 0 ? (
                      <span className={`font-bold ${p.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.stock} units</span>
                    ) : (
                      <span className="text-rose-500 font-black uppercase text-[10px] tracking-wider">Sold Out</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg text-amber-500 font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Product
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                        deleteProduct(p.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-500 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop-only Products Table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">SKU / Code</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400 font-semibold font-mono">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p: Product) => (
                  <tr key={p.id} className={styles.tableRowHover}>
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-500/10 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                      </div>
                    </td>
                    <td className="px-6 py-3 max-w-[200px]">
                      <div className="font-bold truncate">{p.name}</div>
                      <div className={`text-[10px] line-clamp-1 mt-0.5 ${styles.textSecondary}`}>
                        {p.description}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-[10px] tracking-wider uppercase">{p.sku}</td>
                    <td className="px-6 py-3 font-semibold">{p.category}</td>
                    <td className="px-6 py-3 font-mono">
                      {p.salePrice ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-emerald-500">{formatPrice(p.salePrice, settings)}</span>
                          <span className={`text-[10px] line-through ${styles.textSecondary}`}>
                            {formatPrice(p.price, settings)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold">{formatPrice(p.price, settings)}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 font-mono font-bold">
                      {p.stock > 0 ? (
                        <span className={p.stock <= 5 ? 'text-amber-500' : 'text-emerald-500'}>{p.stock} units</span>
                      ) : (
                        <span className="text-rose-500 uppercase tracking-wider text-[10px] font-extrabold">
                          Sold Out
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className={p.status === 'Active' ? styles.badgeSuccess : styles.badgeWarning}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Product"
                          className="p-1.5 hover:bg-slate-500/10 rounded-lg text-amber-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          title="Delete Product"
                          className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`${styles.card} w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150`}
          >
            {/* Header */}
            <div className={`${styles.cardHeader} flex justify-between items-center sticky top-0 bg-opacity-95 z-10`}>
              <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                {editId ? 'Modify Store Product' : 'Create New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-500/10 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={styles.input}
                    placeholder="Rose Gold Chronograph Watch"
                  />
                </div>

                {/* SKU Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className={styles.input}
                    placeholder="HS-CHRO-RG01"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={styles.input}
                  >
                    {categories.map((c: Category) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Draft')}
                    className={styles.input}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Retail Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                    Retail Price ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className={styles.input}
                    placeholder="299"
                  />
                </div>

                {/* Sale Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">
                    Sale Price (Optional, {settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(e.target.value)}
                    className={styles.input}
                    placeholder="249"
                  />
                </div>

                {/* Initial Stock */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Inventory Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className={styles.input}
                    placeholder="15"
                  />
                </div>

                {/* Image Upload simulation */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Product Image File</label>
                  <div className="flex items-center gap-2">
                    <label className={`${styles.buttonSecondary} cursor-pointer text-xs py-2 px-3 flex items-center gap-1.5`}>
                      <Upload className="w-3.5 h-3.5" /> Simulated Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                      {formImage.startsWith('data:') ? 'Custom Base64 Active' : 'Default Preset URL'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Product Description</label>
                <textarea
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className={`${styles.input} resize-none`}
                  placeholder="Enter high-end description detail..."
                />
              </div>

              {/* Image Preview block */}
              {formImage && (
                <div className="mt-2 border border-slate-500/10 rounded-lg p-2 bg-black/10 flex items-center gap-3">
                  <img src={formImage} alt="Preview" className="w-14 h-14 rounded object-cover" />
                  <div>
                    <p className="text-[11px] font-bold">Image Preview</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 max-w-[400px] truncate">{formImage}</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-500/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.buttonSecondary}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.buttonPrimary}>
                  Save Product Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. CATEGORIES SECTION
// ==========================================
export const CategoriesView: React.FC<{
  state: any;
  styles: ThemeStyles;
}> = ({ state, styles }) => {
  const { categories, addCategory, editCategory, deleteCategory } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formImage, setFormImage] = useState('');

  const handleOpenAdd = () => {
    setEditId(null);
    setFormName('');
    setFormDesc('');
    setFormSlug('');
    setFormImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditId(c.id);
    setFormName(c.name);
    setFormDesc(c.description);
    setFormSlug(c.slug);
    setFormImage(c.image);
    setIsModalOpen(true);
  };

  // Auto Generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormName(val);
    setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // File Upload base64 simulation
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormImage(base64);
      } catch (err) {
        console.error('Category image simulation error:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catPayload = {
      name: formName,
      slug: formSlug,
      description: formDesc,
      image: formImage,
    };

    if (editId) {
      editCategory(editId, catPayload);
    } else {
      addCategory(catPayload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Create Trigger block */}
      <div className={`${styles.card} p-4 flex justify-between items-center`}>
        <div>
          <h3 className={`text-sm font-bold ${styles.textPrimary}`}>Category Catalog</h3>
          <p className={`text-xs ${styles.textSecondary}`}>Manage store departments and custom categories.</p>
        </div>
        <button onClick={handleOpenAdd} className={`${styles.buttonPrimary} text-xs py-2 px-4 flex items-center gap-1.5`}>
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {/* Categories Grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c: Category) => (
          <div key={c.id} className={`${styles.card} overflow-hidden flex flex-col group`}>
            <div className="h-44 relative overflow-hidden bg-slate-900 border-b border-slate-500/10">
              <img src={c.image} alt={c.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white font-mono font-bold text-xs px-2.5 py-1 rounded-full border border-white/10">
                {c.productCount} Products
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className={`text-base font-bold tracking-wide ${styles.textPrimary}`}>{c.name}</h4>
                <p className="font-mono text-[10px] tracking-wider text-slate-400 mt-0.5">/{c.slug}</p>
                <p className={`text-xs line-clamp-2 mt-2 ${styles.textSecondary}`}>{c.description}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-500/10">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-500/5 hover:bg-slate-500/15 rounded-lg border border-slate-500/10 flex items-center gap-1 text-amber-500 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete Category "${c.name}"? Active products in this category will be reassigned.`)) {
                      deleteCategory(c.id);
                    }
                  }}
                  className="text-xs font-semibold px-3 py-1.5 bg-rose-500/5 hover:bg-rose-500/15 rounded-lg border border-rose-500/10 flex items-center gap-1 text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`${styles.card} w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150`}
          >
            {/* Header */}
            <div className={`${styles.cardHeader} flex justify-between items-center sticky top-0 bg-opacity-95 z-10`}>
              <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                {editId ? 'Edit Category settings' : 'Create Store Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-500/10 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Category Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={handleNameChange}
                  className={styles.input}
                  placeholder="Apparel & Accessories"
                />
              </div>

              {/* Slug (Auto Generated) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">URL Slug (Auto)</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className={styles.input}
                  placeholder="apparel-accessories"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Category Description</label>
                <textarea
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className={`${styles.input} resize-none`}
                  placeholder="Department overview detail..."
                />
              </div>

              {/* Image Upload simulation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Category Cover Image</label>
                <div className="flex items-center gap-2">
                  <label className={`${styles.buttonSecondary} cursor-pointer text-xs py-2 px-3 flex items-center gap-1.5`}>
                    <Upload className="w-3.5 h-3.5" /> Cover Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                    {formImage.startsWith('data:') ? 'Custom Image Loaded' : 'Using default'}
                  </span>
                </div>
              </div>

              {/* Image Preview block */}
              {formImage && (
                <div className="mt-2 border border-slate-500/10 rounded-lg p-2 bg-black/10 flex items-center gap-3">
                  <img src={formImage} alt="Preview" className="w-14 h-14 rounded object-cover" />
                  <div>
                    <p className="text-[11px] font-bold font-mono">Image Preview</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 max-w-[300px] truncate">{formImage}</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-500/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.buttonSecondary}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.buttonPrimary}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. ORDERS SECTION
// ==========================================
export const OrdersView: React.FC<{
  state: any;
  styles: ThemeStyles;
}> = ({ state, styles }) => {
  const { orders, settings, updateOrderStatus } = state;

  const [search, setSearch] = useState('');
  const [shippingFilter, setShippingFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o: Order) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchShipping = shippingFilter ? o.shippingStatus === shippingFilter : true;
      return matchSearch && matchShipping;
    });
  }, [orders, search, shippingFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className={`${styles.card} p-4 flex flex-col sm:flex-row gap-4 items-center justify-between`}>
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by Order ID, Client Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${styles.input} pl-9 w-full py-1.5 text-xs`}
          />
        </div>

        <select
          value={shippingFilter}
          onChange={(e) => setShippingFilter(e.target.value)}
          className={`${styles.input} text-xs py-1.5 w-full sm:w-56`}
        >
          <option value="">All Shipping Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className={`${styles.card} overflow-hidden`}>
        {/* Mobile card block for small screens */}
        <div className="block md:hidden divide-y divide-slate-500/10 text-xs">
          {filteredOrders.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 font-mono font-bold">
              No matching orders found.
            </div>
          ) : (
            filteredOrders.map((o: Order) => (
              <div key={o.id} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-sm text-indigo-400">{o.id}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(o.orderDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-sm">{o.customerName}</p>
                  <p className={`text-[10px] ${styles.textSecondary}`}>{o.customerEmail}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-black/10 p-2.5 rounded-lg border border-slate-500/5 text-[11px] font-mono">
                  <div>
                    <span className="opacity-60 block font-sans">Payment:</span>
                    <span className={o.paymentStatus === 'Paid' ? styles.badgeSuccess : styles.badgeDanger}>
                      {o.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-60 block font-sans">Shipping:</span>
                    <span
                      className={
                        o.shippingStatus === 'Delivered'
                          ? styles.badgeSuccess
                          : o.shippingStatus === 'Shipped'
                          ? styles.badgeInfo
                          : o.shippingStatus === 'Processing'
                          ? styles.badgeWarning
                          : styles.badgeDanger
                      }
                    >
                      {o.shippingStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-sm font-mono text-emerald-500">
                    {formatPrice(o.totalAmount, settings)}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-3 py-1.5 bg-slate-500/5 hover:bg-slate-500/15 border border-slate-500/10 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details & Manage
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop-only orders table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Order Date</th>
                <th className="px-6 py-4 font-semibold">Purchased Items</th>
                <th className="px-6 py-4 font-semibold">Total Cost</th>
                <th className="px-6 py-4 font-semibold">Payment Status</th>
                <th className="px-6 py-4 font-semibold">Shipping Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400 font-mono font-bold">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o: Order) => (
                  <tr key={o.id} className={styles.tableRowHover}>
                    <td className="px-6 py-4 font-mono font-extrabold tracking-wider">{o.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{o.customerName}</div>
                      <div className={`text-[10px] ${styles.textSecondary}`}>{o.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {new Date(o.orderDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">{formatPrice(o.totalAmount, settings)}</td>
                    <td className="px-6 py-4">
                      <span className={o.paymentStatus === 'Paid' ? styles.badgeSuccess : styles.badgeDanger}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          o.shippingStatus === 'Delivered'
                            ? styles.badgeSuccess
                            : o.shippingStatus === 'Shipped'
                            ? styles.badgeInfo
                            : o.shippingStatus === 'Processing'
                            ? styles.badgeWarning
                            : styles.badgeDanger
                        }
                      >
                        {o.shippingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1.5 bg-slate-500/5 hover:bg-slate-500/15 border border-slate-500/10 hover:border-slate-500/20 rounded-lg font-semibold flex items-center gap-1 ml-auto text-[11px] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end">
          <div
            className={`${styles.card} w-full max-w-lg h-full overflow-y-auto flex flex-col shadow-2xl relative rounded-l-2xl animate-in slide-in-from-right duration-200`}
          >
            {/* Header */}
            <div className={`${styles.cardHeader} flex justify-between items-center bg-opacity-95 z-10`}>
              <div>
                <h3 className={`text-base font-bold ${styles.textPrimary}`}>Order Details {selectedOrder.id}</h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Date: {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-slate-500/10 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 flex-1 space-y-6">
              {/* Customer summary */}
              <div className="space-y-2 pb-4 border-b border-slate-500/10">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Customer Information</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="opacity-70">Client:</span>
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="opacity-70">Email Address:</span>
                    <p className="font-semibold truncate">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <span className="opacity-70">Phone:</span>
                    <p className="font-semibold">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <span className="opacity-70">Payment Channel:</span>
                    <p className="font-semibold font-mono">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Shipping address details */}
              <div className="space-y-2 pb-4 border-b border-slate-500/10 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Delivery Address</h4>
                <p className="font-medium p-2.5 bg-black/10 rounded-lg flex items-center gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 shrink-0 text-rose-500" />
                  {selectedOrder.shippingAddress}
                </p>
              </div>

              {/* Order Items */}
              <div className="space-y-3 pb-4 border-b border-slate-500/10">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Ordered Merchandise</h4>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-black/5 p-2 rounded-lg border border-slate-500/5">
                      <div className="w-12 h-12 rounded overflow-hidden bg-slate-900 border border-slate-500/10">
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 text-xs min-w-0">
                        <p className="font-bold truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.quantity} x {formatPrice(item.price, settings)}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold shrink-0">
                        {formatPrice(item.price * item.quantity, settings)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Modifiers */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Manage Order Operations</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Shipping Status Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold opacity-75">Update Shipping Status</label>
                    <select
                      value={selectedOrder.shippingStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value as Order['shippingStatus'];
                        updateOrderStatus(selectedOrder.id, newStatus, selectedOrder.paymentStatus);
                        setSelectedOrder({ ...selectedOrder, shippingStatus: newStatus });
                      }}
                      className={`${styles.input} text-xs py-2`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  {/* Payment Status Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold opacity-75">Update Payment Status</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value as Order['paymentStatus'];
                        updateOrderStatus(selectedOrder.id, selectedOrder.shippingStatus, newStatus);
                        setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
                      }}
                      className={`${styles.input} text-xs py-2`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Footer bar */}
            <div className="p-6 bg-black/20 border-t border-slate-500/10 space-y-2">
              <div className="flex justify-between text-xs opacity-70">
                <span>Shipping surcharge:</span>
                <span className="font-mono">{formatPrice(settings.shippingFee, settings)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold">Grand Order Total:</span>
                <span className={`text-lg font-mono font-extrabold text-${styles.accentColor}-500`}>
                  {formatPrice(selectedOrder.totalAmount, settings)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. BANNERS SECTION
// ==========================================
export const BannersView: React.FC<{
  state: any;
  styles: ThemeStyles;
}> = ({ state, styles }) => {
  const { banners, addBanner, editBanner, deleteBanner, toggleBannerStatus } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formPosition, setFormPosition] = useState<Banner['position']>('Main Hero');
  const [formActive, setFormActive] = useState(true);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormImage('https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800');
    setFormLink('');
    setFormPosition('Main Hero');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditId(b.id);
    setFormTitle(b.title);
    setFormSubtitle(b.subtitle);
    setFormImage(b.imageUrl);
    setFormLink(b.link);
    setFormPosition(b.position);
    setFormActive(b.active);
    setIsModalOpen(true);
  };

  // Upload simulation
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFormImage(base64);
      } catch (err) {
        console.error('Banner upload error:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bannerPayload = {
      title: formTitle,
      subtitle: formSubtitle,
      imageUrl: formImage,
      link: formLink,
      active: formActive,
      position: formPosition,
    };

    if (editId) {
      editBanner(editId, bannerPayload);
    } else {
      addBanner(bannerPayload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Create Trigger block */}
      <div className={`${styles.card} p-4 flex justify-between items-center`}>
        <div>
          <h3 className={`text-sm font-bold ${styles.textPrimary}`}>Homepage Promos & Banners</h3>
          <p className={`text-xs ${styles.textSecondary}`}>Coordinate marketing graphics and promotional grids.</p>
        </div>
        <button onClick={handleOpenAdd} className={`${styles.buttonPrimary} text-xs py-2 px-4 flex items-center gap-1.5`}>
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Banners Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map((b: Banner) => (
          <div key={b.id} className={`${styles.card} overflow-hidden flex flex-col justify-between group`}>
            <div className="h-52 relative overflow-hidden bg-slate-900 border-b border-slate-500/10">
              <img src={b.imageUrl} alt={b.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-102" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full w-max mb-2">
                  {b.position}
                </span>
                <h4 className="text-base font-extrabold text-white leading-snug">{b.title}</h4>
                <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-1">{b.subtitle}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold">Link destination:</span>
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{b.link || '/'}</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={b.active}
                    onChange={() => toggleBannerStatus(b.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:width-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className={`ml-2 text-xs font-semibold ${b.active ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {b.active ? 'Active' : 'Inactive'}
                  </span>
                </label>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 hover:bg-slate-500/10 rounded-lg text-amber-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete banner "${b.title}"?`)) {
                        deleteBanner(b.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`${styles.card} w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150`}
          >
            {/* Header */}
            <div className={`${styles.cardHeader} flex justify-between items-center sticky top-0 bg-opacity-95 z-10`}>
              <h3 className={`text-base font-bold ${styles.textPrimary}`}>
                {editId ? 'Modify Store Banner' : 'Create Homepage Banner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-500/10 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Banner Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Marketing Headline</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Winter Season Grand Sale"
                />
              </div>

              {/* Banner Subtitle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Sub-headline Description</label>
                <input
                  type="text"
                  required
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className={styles.input}
                  placeholder="Get up to 40% discount across all leather apparel."
                />
              </div>

              {/* Promo Link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Destination Link</label>
                <input
                  type="text"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  className={styles.input}
                  placeholder="/category/apparel-clothing"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Position */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Layout Block</label>
                  <select
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value as Banner['position'])}
                    className={styles.input}
                  >
                    <option value="Main Hero">Main Hero Slider</option>
                    <option value="Promo Grid">Promo Grid Card</option>
                    <option value="Sidebar">Sidebar Graphic</option>
                  </select>
                </div>

                {/* Active Toggle */}
                <div className="flex flex-col gap-1.5 justify-end pb-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={() => setFormActive(!formActive)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-3 text-xs font-semibold">Publish Active</span>
                  </label>
                </div>
              </div>

              {/* Image Upload simulation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Banner Cover Graphic</label>
                <div className="flex items-center gap-2">
                  <label className={`${styles.buttonSecondary} cursor-pointer text-xs py-2 px-3 flex items-center gap-1.5`}>
                    <Upload className="w-3.5 h-3.5" /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                    {formImage.startsWith('data:') ? 'Custom Upload Active' : 'Default Preset'}
                  </span>
                </div>
              </div>

              {/* Image Preview */}
              {formImage && (
                <div className="mt-2 border border-slate-500/10 rounded-lg p-2 bg-black/10 flex items-center gap-3">
                  <img src={formImage} alt="Preview" className="w-16 h-10 rounded object-cover" />
                  <div>
                    <p className="text-[11px] font-bold">Image Preview</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 max-w-[300px] truncate">{formImage}</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-500/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.buttonSecondary}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.buttonPrimary}>
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. CUSTOMERS SECTION
// ==========================================
export const CustomersView: React.FC<{
  state: any;
  styles: ThemeStyles;
}> = ({ state, styles }) => {
  const { customers, settings, updateCustomerStatus } = state;

  const [search, setSearch] = useState('');

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c: Customer) => {
      return (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [customers, search]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className={`${styles.card} p-4 flex flex-col sm:flex-row gap-4 items-center justify-between`}>
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search clients by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${styles.input} pl-9 w-full py-1.5 text-xs`}
          />
        </div>

        <div className="text-xs font-mono font-bold opacity-75">
          Registered Clients database: {filteredCustomers.length} accounts
        </div>
      </div>

      {/* Customers Table */}
      <div className={styles.card}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Contact Email</th>
                <th className="px-6 py-4 font-semibold">Phone Number</th>
                <th className="px-6 py-4 font-semibold font-mono">Join Date</th>
                <th className="px-6 py-4 font-semibold">Total Orders</th>
                <th className="px-6 py-4 font-semibold">Total Spent</th>
                <th className="px-6 py-4 font-semibold">Account Status</th>
                <th className="px-6 py-4 font-semibold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400 font-mono">
                    No clients found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c: Customer) => (
                  <tr key={c.id} className={styles.tableRowHover}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                        <span className="font-bold">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">{c.email}</td>
                    <td className="px-6 py-4 font-mono">{c.phone}</td>
                    <td className="px-6 py-4 font-mono">
                      {new Date(c.registeredDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">{c.totalOrders} transactions</td>
                    <td className="px-6 py-4 font-mono font-extrabold text-emerald-500">
                      {formatPrice(c.totalSpent, settings)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={c.status === 'Active' ? styles.badgeSuccess : styles.badgeDanger}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status === 'Active' ? (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to suspend account "${c.name}"?`)) {
                              updateCustomerStatus(c.id, 'Suspended');
                            }
                          }}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold border border-rose-500/30 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded transition-colors"
                        >
                          Suspend Client
                        </button>
                      ) : (
                        <button
                          onClick={() => updateCustomerStatus(c.id, 'Active')}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold border border-emerald-500/30 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 rounded transition-colors"
                        >
                          Activate Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. REPORTS SECTION
// ==========================================
export const ReportsView: React.FC<{
  state: any;
  styles: ThemeStyles;
}> = ({ state, styles }) => {
  const { products, orders, customers, settings } = state;

  // Calculators
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o: Order) => o.paymentStatus === 'Paid')
      .reduce((acc: number, curr: Order) => acc + curr.totalAmount, 0);
  }, [orders]);

  const totalSalesCount = useMemo(() => {
    return orders.filter((o: Order) => o.paymentStatus === 'Paid').length;
  }, [orders]);

  const averageOrderValue = useMemo(() => {
    if (totalSalesCount === 0) return 0;
    return totalRevenue / totalSalesCount;
  }, [totalRevenue, totalSalesCount]);

  // Derive products list sorted by stock
  const lowStockCount = products.filter((p: Product) => p.stock <= 5).length;

  // Simulate downloading a CSV report
  const downloadCSVReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Store Report,Harry Store Admin Portal,Date:' + new Date().toLocaleDateString() + '\n\n';
    csvContent += 'Product Catalog Size,' + products.length + '\n';
    csvContent += 'Registered CustomersCount,' + customers.length + '\n';
    csvContent += 'Fully Paid Orders,' + totalSalesCount + '\n';
    csvContent += 'Aggregated Paid Revenue,' + totalRevenue + '\n';
    csvContent += 'Average Purchase Value,' + averageOrderValue + '\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Harry_Store_Business_Summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate print report trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className={`${styles.card} p-5 flex flex-col sm:flex-row gap-4 items-center justify-between print:hidden`}>
        <div>
          <h3 className={`text-base font-bold ${styles.textPrimary}`}>Performance reports & Analytics</h3>
          <p className={`text-xs ${styles.textSecondary}`}>Download complete spreadsheets and view transaction parameters.</p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button
            onClick={downloadCSVReport}
            className={`${styles.buttonSecondary} text-xs py-2 px-3 flex items-center justify-center gap-1.5 w-full sm:w-auto`}
          >
            <Download className="w-4 h-4" /> Download raw CSV
          </button>
          <button
            onClick={handlePrint}
            className={`${styles.buttonPrimary} text-xs py-2 px-3 flex items-center justify-center gap-1.5 w-full sm:w-auto`}
          >
            <Printer className="w-4 h-4" /> Print PDF invoice
          </button>
        </div>
      </div>

      {/* Analytics Summary block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`${styles.card} p-5 flex flex-col justify-between h-32`}>
          <span className={`text-xs font-semibold uppercase tracking-wider opacity-60`}>Gross Store Revenue</span>
          <h2 className="text-3xl font-extrabold font-mono text-emerald-500">{formatPrice(totalRevenue, settings)}</h2>
          <span className="text-[10px] text-slate-400 font-mono">Paid order transactions</span>
        </div>

        <div className={`${styles.card} p-5 flex flex-col justify-between h-32`}>
          <span className={`text-xs font-semibold uppercase tracking-wider opacity-60`}>Average Order Spend</span>
          <h2 className="text-3xl font-extrabold font-mono text-indigo-400">
            {formatPrice(averageOrderValue, settings)}
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">Gross Revenue / Paid orders count</span>
        </div>

        <div className={`${styles.card} p-5 flex flex-col justify-between h-32`}>
          <span className={`text-xs font-semibold uppercase tracking-wider opacity-60`}>Restocking Warnings</span>
          <h2 className={`text-3xl font-extrabold font-mono ${lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {lowStockCount} Products
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">Stock level equal or lower than 5 units</span>
        </div>
      </div>

      {/* Reports details table */}
      <div className={styles.card}>
        <div className={`${styles.cardHeader}`}>
          <h3 className={`font-bold ${styles.textPrimary}`}>Inventory Health Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={styles.tableHeader}>
                <th className="px-6 py-3.5 font-semibold">Product Name</th>
                <th className="px-6 py-3.5 font-semibold">SKU Code</th>
                <th className="px-6 py-3.5 font-semibold">Base Price</th>
                <th className="px-6 py-3.5 font-semibold">Current Stock</th>
                <th className="px-6 py-3.5 font-semibold">Stock Status</th>
                <th className="px-6 py-3.5 font-semibold">Performance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10 text-xs font-mono">
              {products.map((p: Product) => {
                const stockRatio = p.stock > 10 ? 'Healthy' : p.stock > 0 ? 'Low Stock' : 'Out of Stock';
                const statusBadge =
                  p.stock > 10 ? styles.badgeSuccess : p.stock > 0 ? styles.badgeWarning : styles.badgeDanger;

                return (
                  <tr key={p.id} className={styles.tableRowHover}>
                    <td className="px-6 py-3.5 font-sans font-bold text-slate-100">{p.name}</td>
                    <td className="px-6 py-3.5 text-slate-400">{p.sku}</td>
                    <td className="px-6 py-3.5 text-slate-200">{formatPrice(p.price, settings)}</td>
                    <td className="px-6 py-3.5 text-slate-200">{p.stock} units</td>
                    <td className="px-6 py-3.5">
                      <span className={statusBadge}>{stockRatio}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1 text-amber-400 font-sans font-extrabold text-[11px]">
                        ★ ★ ★ ★ {p.stock > 15 ? '★' : '☆'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. THEME SETTINGS SECTION
// ==========================================
export const ThemeSettingsView: React.FC<{
  currentTheme: string;
  setTheme: (t: any) => void;
  styles: ThemeStyles;
}> = ({ currentTheme, setTheme, styles }) => {
  const themeOptions = [
    {
      id: 'light',
      title: 'Light Minimalist',
      description: 'Crisp layout, white backgrounds with soft shadows and high accessibility ratios.',
      previewClass: 'bg-white border-slate-200 text-slate-900',
      tagline: 'Standard Professional',
      accentColor: 'bg-indigo-600',
    },
    {
      id: 'dark',
      title: 'Obsidian Midnight',
      description: 'Stunning high-density charcoal theme designed to keep eyes stress-free during nights.',
      previewClass: 'bg-slate-900 border-slate-800 text-slate-100',
      tagline: 'Developer Friendly',
      accentColor: 'bg-violet-600',
    },
    {
      id: 'minimal',
      title: 'Monochromatic Serif',
      description: 'Clean typographic aesthetic featuring stark black-and-white accents, zero shadows.',
      previewClass: 'bg-white border-zinc-300 text-zinc-900 font-mono',
      tagline: 'High Contrast Stark',
      accentColor: 'bg-zinc-950',
    },
    {
      id: 'luxury',
      title: 'Premium Brass & Gold',
      description: 'Prestige look featuring rich golden highlights and a high-end velvet/champagne palette.',
      previewClass: 'bg-stone-900 border-amber-600 text-amber-400',
      tagline: 'Elite Boutique Branding',
      accentColor: 'bg-amber-600',
    },
    {
      id: 'gradient',
      title: 'Neon Cosmic Gradient',
      description: 'Semi-transparent visual glassmorphism cards supported by colorful purple background grids.',
      previewClass: 'bg-slate-950/80 border-purple-500/30 text-white',
      tagline: 'Next-Generation Design',
      accentColor: 'bg-gradient-to-r from-violet-600 to-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-base font-bold ${styles.textPrimary}`}>Executive Theme Studio</h3>
        <p className={`text-xs ${styles.textSecondary}`}>
          Switch between Light, Dark, Minimal, Luxury, and Gradient styling models for your staff portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeOptions.map((opt) => {
          const isActive = opt.id === currentTheme;
          return (
            <div
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`${styles.card} overflow-hidden cursor-pointer group relative ${
                isActive ? 'ring-2 ring-indigo-500/80 border-transparent shadow-lg' : 'hover:scale-[1.01]'
              } flex flex-col justify-between`}
            >
              {/* Active Badge indicator */}
              {isActive && (
                <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1 rounded-full shadow-md">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Preview block mimicking a dashboard card */}
              <div className={`p-4 border-b ${opt.previewClass} font-sans`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-60">
                    {opt.tagline}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${opt.accentColor}`} />
                </div>
                <h4 className="text-xs font-bold leading-none">Dashboard Metric Card</h4>
                <div className="text-lg font-mono font-bold mt-1.5">$48,250</div>
                <div className="w-full h-1.5 bg-slate-500/20 rounded mt-3 overflow-hidden">
                  <div className={`w-3/5 h-full ${opt.accentColor}`} />
                </div>
              </div>

              {/* Description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-black/10">
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${styles.textPrimary}`}>{opt.title}</h4>
                  <p className={`text-[11px] ${styles.textSecondary} leading-relaxed`}>{opt.description}</p>
                </div>
                <button
                  className={`w-full py-2 text-xs font-semibold rounded-lg border ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/30'
                      : 'bg-transparent text-slate-300 border-slate-500/25 group-hover:border-slate-500/40'
                  } transition-all`}
                >
                  {isActive ? 'Theme Active' : 'Apply Theme'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 9. WEBSITE SETTINGS SECTION
// ==========================================
export const WebsiteSettingsView: React.FC<{
  settings: WebsiteSettings;
  updateSettings: (s: Partial<WebsiteSettings>) => void;
  styles: ThemeStyles;
}> = ({ settings, updateSettings, styles }) => {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [logoText, setLogoText] = useState(settings.logoText);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [shippingFee, setShippingFee] = useState(settings.shippingFee);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);

  // Social Links
  const [socialFacebook, setSocialFacebook] = useState(settings.socialFacebook);
  const [socialInstagram, setSocialInstagram] = useState(settings.socialInstagram);
  const [socialTwitter, setSocialTwitter] = useState(settings.socialTwitter);
  const [socialYoutube, setSocialYoutube] = useState(settings.socialYoutube);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      logoText,
      contactEmail,
      contactPhone,
      whatsappNumber,
      address,
      currency,
      currencySymbol,
      taxRate: Number(taxRate),
      shippingFee: Number(shippingFee),
      announcementText,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      socialYoutube,
    });
    setToastMessage('Global website parameters successfully synchronized!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Settings alert toast */}
      {toastMessage && (
        <div className="bg-emerald-600 border border-emerald-500 text-white px-4 py-3 rounded-xl flex items-center justify-between text-xs md:text-sm font-semibold shadow-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="opacity-85 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Store Settings Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={`font-bold ${styles.textPrimary}`}>Core Store Parameters</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Store Title / Brand</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Text Logo</label>
              <input
                type="text"
                required
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Store Announcement Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className={styles.input}
                placeholder="Discounts text banner..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Currency Code</label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={styles.input}
                placeholder="USD"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Currency symbol</label>
              <input
                type="text"
                required
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className={styles.input}
                placeholder="$"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">VAT Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Flat Shipping Surcharge</label>
              <input
                type="number"
                required
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Support & Contacts Info Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={`font-bold ${styles.textPrimary}`}>Support & Transaction Channels</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Contact Email Address</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">Phone Helpline</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">WhatsApp Contact Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs font-mono">
                  +
                </span>
                <input
                  type="text"
                  required
                  value={whatsappNumber.replace('+', '')}
                  onChange={(e) => setWhatsappNumber('+' + e.target.value)}
                  className={`${styles.input} pl-6 w-full`}
                  placeholder="15552345678"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                Must include country code, e.g. 15552345678. Used for immediate direct WhatsApp chat integration.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75">HQ Physical Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Social Channels Config Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={`font-bold ${styles.textPrimary}`}>Social Marketing Connections</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
                Facebook Profile Link
              </label>
              <input
                type="url"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-pink-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                Instagram Username
              </label>
              <input
                type="url"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-400 fill-current" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
                Twitter Account
              </label>
              <input
                type="url"
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-rose-500 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.002 3.002 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube Channel
              </label>
              <input
                type="url"
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Form Submit bar */}
        <div className="flex justify-end gap-3">
          <button type="submit" className={`${styles.buttonPrimary} py-2.5 px-6 font-bold`}>
            Apply Global Changes
          </button>
        </div>
      </form>
    </div>
  );
};
