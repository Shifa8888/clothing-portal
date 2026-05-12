import { useState, useEffect } from 'react';
import {
  Product,
  Category,
  Order,
  Banner,
  Customer,
  WebsiteSettings,
  ActivityLog,
  initialProducts,
  initialCategories,
  initialOrders,
  initialBanners,
  initialCustomers,
  initialSettings,
  initialActivityLogs,
} from '../data/mockData';
import { ThemeType } from '../utils/theme';

export const useAppState = () => {
  // Load or initialize state from localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('harry_store_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('harry_store_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('harry_store_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('harry_store_banners');
    return saved ? JSON.parse(saved) : initialBanners;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('harry_store_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('harry_store_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Force update the WhatsApp number if it is the old placeholder
      if (parsed.whatsappNumber === '+15552345678') {
        parsed.whatsappNumber = '+923286503324';
        parsed.contactPhone = '+92 328 6503324';
      }
      return parsed;
    }
    return initialSettings;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('harry_store_activity_logs');
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('harry_store_theme');
    return (saved as ThemeType) || 'light';
  });

  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('harry_store_admin_user');
  });

  // Sync state to localStorage when changes occur
  useEffect(() => {
    localStorage.setItem('harry_store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('harry_store_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('harry_store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('harry_store_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('harry_store_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('harry_store_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('harry_store_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('harry_store_theme', theme);
  }, [theme]);

  // Log activity helper
  const addLog = (action: string, details: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      user: user || 'Harry Admin',
      timestamp: new Date().toISOString(),
      details,
      type,
    };
    setActivityLogs((prev) => [newLog, ...prev].slice(0, 50)); // keep last 50 logs
  };

  // Auth operations
  const login = (username: string) => {
    setUser(username);
    localStorage.setItem('harry_store_admin_user', username);
    addLog('Admin Login', 'Administrator logged in successfully', 'setting');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('harry_store_admin_user');
    addLog('Admin Logout', 'Administrator logged out', 'setting');
  };

  // Products operations
  const addProduct = (product: Omit<Product, 'id' | 'createdDate'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdDate: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Update category count
    setCategories((prevCat) =>
      prevCat.map((cat) =>
        cat.name.toLowerCase() === product.category.toLowerCase()
          ? { ...cat, productCount: cat.productCount + 1 }
          : cat
      )
    );

    addLog('Product Created', `Added product "${product.name}" with SKU ${product.sku}`, 'product');
  };

  const editProduct = (id: string, updatedFields: Partial<Product>) => {
    const oldProd = products.find((p) => p.id === id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } as Product : p))
    );

    // If category changed, adjust counts
    if (oldProd && updatedFields.category && oldProd.category !== updatedFields.category) {
      setCategories((prevCat) =>
        prevCat.map((cat) => {
          if (cat.name.toLowerCase() === oldProd.category.toLowerCase()) {
            return { ...cat, productCount: Math.max(0, cat.productCount - 1) };
          }
          if (cat.name.toLowerCase() === updatedFields.category?.toLowerCase()) {
            return { ...cat, productCount: cat.productCount + 1 };
          }
          return cat;
        })
      );
    }

    addLog('Product Updated', `Updated product "${updatedFields.name || oldProd?.name}"`, 'product');
  };

  const deleteProduct = (id: string) => {
    const prodToDelete = products.find((p) => p.id === id);
    if (!prodToDelete) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));

    // Decrement category count
    setCategories((prevCat) =>
      prevCat.map((cat) =>
        cat.name.toLowerCase() === prodToDelete.category.toLowerCase()
          ? { ...cat, productCount: Math.max(0, cat.productCount - 1) }
          : cat
      )
    );

    addLog('Product Deleted', `Deleted product "${prodToDelete.name}"`, 'product');
  };

  // Categories operations
  const addCategory = (category: Omit<Category, 'id' | 'productCount'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    addLog('Category Created', `Created category "${category.name}"`, 'category');
  };

  const editCategory = (id: string, updatedFields: Partial<Category>) => {
    const oldCat = categories.find((c) => c.id === id);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } as Category : c))
    );

    // If category name changed, update the product references
    if (oldCat && updatedFields.name && oldCat.name !== updatedFields.name) {
      setProducts((prevProds) =>
        prevProds.map((p) =>
          p.category === oldCat.name ? { ...p, category: updatedFields.name! } : p
        )
      );
    }

    addLog('Category Updated', `Updated category "${updatedFields.name || oldCat?.name}"`, 'category');
  };

  const deleteCategory = (id: string) => {
    const catToDelete = categories.find((c) => c.id === id);
    if (!catToDelete) return;

    // Delete category
    setCategories((prev) => prev.filter((c) => c.id !== id));

    // Reassign products of deleted category to "Uncategorized" or empty
    setProducts((prevProds) =>
      prevProds.map((p) =>
        p.category === catToDelete.name ? { ...p, category: 'Uncategorized' } : p
      )
    );

    addLog('Category Deleted', `Deleted category "${catToDelete.name}"`, 'category');
  };

  // Orders operations
  const updateOrderStatus = (
    id: string,
    status: Order['shippingStatus'],
    paymentStatus?: Order['paymentStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              shippingStatus: status,
              paymentStatus: paymentStatus || o.paymentStatus,
            }
          : o
      )
    );
    addLog(
      'Order Status Updated',
      `Order ${id} shipping updated to ${status}${
        paymentStatus ? `, payment updated to ${paymentStatus}` : ''
      }`,
      'order'
    );
  };

  // Banners operations
  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...banner,
      id: `ban-${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);
    addLog('Banner Created', `Added homepage banner "${banner.title}"`, 'banner');
  };

  const editBanner = (id: string, updatedFields: Partial<Banner>) => {
    const oldBanner = banners.find((b) => b.id === id);
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } as Banner : b))
    );
    addLog('Banner Updated', `Updated banner "${updatedFields.title || oldBanner?.title}"`, 'banner');
  };

  const deleteBanner = (id: string) => {
    const bannerToDelete = banners.find((b) => b.id === id);
    if (!bannerToDelete) return;

    setBanners((prev) => prev.filter((b) => b.id !== id));
    addLog('Banner Deleted', `Deleted banner "${bannerToDelete.title}"`, 'banner');
  };

  const toggleBannerStatus = (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;

    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
    addLog('Banner Status Toggled', `Toggled banner "${banner.title}" active status`, 'banner');
  };

  // Customers operations
  const updateCustomerStatus = (id: string, status: Customer['status']) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;

    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    addLog('Customer Status Updated', `Set status of customer "${customer.name}" to ${status}`, 'customer');
  };

  // Settings operations
  const updateSettings = (updatedFields: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updatedFields }));
    addLog('Website Settings Updated', 'Modified store configuration', 'setting');
  };

  return {
    products,
    categories,
    orders,
    banners,
    customers,
    settings,
    activityLogs,
    theme,
    user,
    setTheme,
    login,
    logout,
    addProduct,
    editProduct,
    deleteProduct,
    addCategory,
    editCategory,
    deleteCategory,
    updateOrderStatus,
    addBanner,
    editBanner,
    deleteBanner,
    toggleBannerStatus,
    updateCustomerStatus,
    updateSettings,
  };
};
