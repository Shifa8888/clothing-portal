export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  stock: number;
  image: string;
  sku: string;
  status: 'Active' | 'Draft';
  createdDate: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Stripe' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  shippingAddress: string;
  shippingStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  orderDate: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  active: boolean;
  position: 'Main Hero' | 'Promo Grid' | 'Sidebar';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Suspended';
  totalOrders: number;
  totalSpent: number;
  registeredDate: string;
  avatar: string;
}

export interface WebsiteSettings {
  storeName: string;
  logoText: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // percentage
  shippingFee: number;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
  announcementText: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'product' | 'order' | 'setting' | 'category' | 'customer' | 'banner';
}

// Initial Data
export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Luxury Watches',
    slug: 'luxury-watches',
    description: 'Precision timepieces crafted with elegance and master engineering.',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400',
    productCount: 4,
  },
  {
    id: 'cat-2',
    name: 'Smartphones & Tech',
    slug: 'smartphones-tech',
    description: 'Latest high-end gadgets, smartphones, and accessories.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
    productCount: 4,
  },
  {
    id: 'cat-3',
    name: 'Designer Shoes',
    slug: 'designer-shoes',
    description: 'Step into comfort and premium high-fashion footwear.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400',
    productCount: 3,
  },
  {
    id: 'cat-4',
    name: 'Audio Gear',
    slug: 'audio-gear',
    description: 'Premium headphones, noise-canceling earbuds, and soundbars.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    productCount: 3,
  },
  {
    id: 'cat-5',
    name: 'Apparel & Clothing',
    slug: 'apparel-clothing',
    description: 'Fashionable jackets, streetwear, and premium designer attire.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    productCount: 4,
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Chronograph Rose Gold Edition',
    description: 'The Chronograph Rose Gold Edition is a premium Swiss mechanical watch featuring a stainless steel case plated in 18k rose gold, custom leather strap, and waterproof capability up to 100 meters.',
    price: 1299,
    salePrice: 1099,
    category: 'Luxury Watches',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-CHRO-RG01',
    status: 'Active',
    createdDate: '2026-01-10T14:32:00Z'
  },
  {
    id: 'prod-2',
    name: 'Supreme ANC Headphones',
    description: 'Active Noise Canceling over-ear headphones with custom carbon fiber drivers. Features 45-hour battery life, fast charging, and customizable equalizer via mobile app.',
    price: 349,
    salePrice: 299,
    category: 'Audio Gear',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-SANC-H45',
    status: 'Active',
    createdDate: '2026-01-12T09:15:00Z'
  },
  {
    id: 'prod-3',
    name: 'Nebula Pro Smartphone',
    description: 'An flagship smartphone featuring a 6.9-inch 120Hz AMOLED display, 200MP penta-camera system, ultra-fast charging, and 512GB premium storage.',
    price: 1199,
    category: 'Smartphones & Tech',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-NEB-P512',
    status: 'Active',
    createdDate: '2026-01-15T11:45:00Z'
  },
  {
    id: 'prod-4',
    name: 'Suede Camel Chelsea Boots',
    description: 'Handcrafted premium Italian suede Chelsea boots with custom Crepe rubber soles, memory foam insoles, and elastic side panels for a modern luxury fit.',
    price: 249,
    category: 'Designer Shoes',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-BOOT-SC04',
    status: 'Active',
    createdDate: '2026-01-18T16:20:00Z'
  },
  {
    id: 'prod-5',
    name: 'Aero-Fit Bomber Jacket',
    description: 'Water-resistant luxury bomber jacket. Sleek, windproof exterior fabric with thermal interior insulation and multiple internal pockets.',
    price: 189,
    salePrice: 159,
    category: 'Apparel & Clothing',
    stock: 62,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-BOMB-AF12',
    status: 'Active',
    createdDate: '2026-01-20T10:05:00Z'
  },
  {
    id: 'prod-6',
    name: 'Vintage Aviator Sunglasses',
    description: 'Polarized gold-plated aviator sunglasses with gradient lenses. Excellent UV protection and scratch-resistant treatment.',
    price: 149,
    category: 'Apparel & Clothing',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-SUN-VA02',
    status: 'Active',
    createdDate: '2026-01-22T08:30:00Z'
  },
  {
    id: 'prod-7',
    name: 'Minimalist Titanium Wallet',
    description: 'RF-blocking titanium cardholder holding up to 15 cards with a premium elastic band and spring cash-clip. Sleek, modern, and pocket-friendly.',
    price: 89,
    salePrice: 69,
    category: 'Apparel & Clothing',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-WALL-MT15',
    status: 'Active',
    createdDate: '2026-01-24T15:10:00Z'
  },
  {
    id: 'prod-8',
    name: 'Studio Monitor Soundbar',
    description: 'High-fidelity 120W soundbar with built-in active subwoofers, Optical, HDMI, and wireless Bluetooth connectivity for home theater acoustics.',
    price: 299,
    category: 'Audio Gear',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    sku: 'HS-SND-SB120',
    status: 'Draft',
    createdDate: '2026-01-26T13:40:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-8941',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 234-5678',
    items: [
      {
        productId: 'prod-1',
        name: 'Chronograph Rose Gold Edition',
        quantity: 1,
        price: 1099,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
      }
    ],
    totalAmount: 1109, // + $10 shipping
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    shippingAddress: '482 Maple Ave, Seattle, WA 98101',
    shippingStatus: 'Delivered',
    orderDate: '2026-01-22T14:22:00Z'
  },
  {
    id: 'ORD-8942',
    customerName: 'Michael Chang',
    customerEmail: 'mchang@example.com',
    customerPhone: '+1 (555) 876-5432',
    items: [
      {
        productId: 'prod-2',
        name: 'Supreme ANC Headphones',
        quantity: 1,
        price: 299,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'
      },
      {
        productId: 'prod-7',
        name: 'Minimalist Titanium Wallet',
        quantity: 2,
        price: 69,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
      }
    ],
    totalAmount: 447, // 299 + 138 + shipping
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid',
    shippingAddress: '1290 Pine St, Apt 4C, San Francisco, CA 94109',
    shippingStatus: 'Shipped',
    orderDate: '2026-01-24T10:15:00Z'
  },
  {
    id: 'ORD-8943',
    customerName: 'Emma Watson',
    customerEmail: 'emma@example.com',
    customerPhone: '+1 (555) 432-1098',
    items: [
      {
        productId: 'prod-5',
        name: 'Aero-Fit Bomber Jacket',
        quantity: 1,
        price: 159,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
      }
    ],
    totalAmount: 169, // 159 + shipping
    paymentMethod: 'Stripe',
    paymentStatus: 'Paid',
    shippingAddress: '742 Evergreen Terrace, Springfield, IL 62704',
    shippingStatus: 'Processing',
    orderDate: '2026-01-25T16:45:00Z'
  },
  {
    id: 'ORD-8944',
    customerName: 'Robert Vance',
    customerEmail: 'rvance@vancerefrigeration.com',
    customerPhone: '+1 (555) 901-2345',
    items: [
      {
        productId: 'prod-3',
        name: 'Nebula Pro Smartphone',
        quantity: 1,
        price: 1199,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800'
      },
      {
        productId: 'prod-4',
        name: 'Suede Camel Chelsea Boots',
        quantity: 1,
        price: 249,
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800'
      }
    ],
    totalAmount: 1458, // 1199 + 249 + shipping
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    shippingAddress: '1725 Slough Avenue, Scranton, PA 18505',
    shippingStatus: 'Pending',
    orderDate: '2026-01-26T09:05:00Z'
  },
  {
    id: 'ORD-8945',
    customerName: 'Sophia Loren',
    customerEmail: 'sophia@example.com',
    customerPhone: '+1 (555) 304-9876',
    items: [
      {
        productId: 'prod-4',
        name: 'Suede Camel Chelsea Boots',
        quantity: 1,
        price: 249,
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800'
      }
    ],
    totalAmount: 259, // 249 + shipping
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    shippingAddress: '888 Beverly Hills Blvd, Los Angeles, CA 90210',
    shippingStatus: 'Delivered',
    orderDate: '2026-01-18T11:50:00Z'
  }
];

export const initialBanners: Banner[] = [
  {
    id: 'ban-1',
    title: 'Unleash Next-Gen Sound Quality',
    subtitle: 'Get up to 30% off on premium audio gears & studio headphones',
    imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1200',
    link: '/category/audio-gear',
    active: true,
    position: 'Main Hero'
  },
  {
    id: 'ban-2',
    title: 'The Golden Standard Chronographs',
    subtitle: 'Precision timing meets breathtaking luxury and 18k gold details',
    imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=1200',
    link: '/category/luxury-watches',
    active: true,
    position: 'Main Hero'
  },
  {
    id: 'ban-3',
    title: 'Step in Comfort: Premium Boots',
    subtitle: 'Classic Italian styling crafted in luxury suede leather',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800',
    link: '/category/designer-shoes',
    active: true,
    position: 'Promo Grid'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    totalOrders: 4,
    totalSpent: 2840,
    registeredDate: '2025-05-14T09:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'cust-2',
    name: 'Michael Chang',
    email: 'mchang@example.com',
    phone: '+1 (555) 876-5432',
    status: 'Active',
    totalOrders: 2,
    totalSpent: 447,
    registeredDate: '2025-08-22T14:35:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'cust-3',
    name: 'Emma Watson',
    email: 'emma@example.com',
    phone: '+1 (555) 432-1098',
    status: 'Active',
    totalOrders: 3,
    totalSpent: 890,
    registeredDate: '2025-10-11T16:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'cust-4',
    name: 'Robert Vance',
    email: 'rvance@vancerefrigeration.com',
    phone: '+1 (555) 901-2345',
    status: 'Active',
    totalOrders: 1,
    totalSpent: 1458,
    registeredDate: '2025-11-03T11:22:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'cust-5',
    name: 'Sophia Loren',
    email: 'sophia@example.com',
    phone: '+1 (555) 304-9876',
    status: 'Active',
    totalOrders: 8,
    totalSpent: 4230,
    registeredDate: '2025-02-18T10:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'cust-6',
    name: 'David Beckham',
    email: 'david@example.com',
    phone: '+1 (555) 789-0123',
    status: 'Suspended',
    totalOrders: 0,
    totalSpent: 0,
    registeredDate: '2025-12-19T15:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100'
  }
];

export const initialSettings: WebsiteSettings = {
  storeName: 'Harry Store',
  logoText: 'HARRY.',
  logoUrl: '',
  contactEmail: 'support@harrystore.com',
  contactPhone: '+92 328 6503324',
  whatsappNumber: '+923286503324',
  address: '100 Luxury Avenue, Suite 500, New York, NY 10001',
  currency: 'USD',
  currencySymbol: '$',
  taxRate: 8.5,
  shippingFee: 10,
  socialFacebook: 'https://facebook.com/harrystore',
  socialInstagram: 'https://instagram.com/harrystore',
  socialTwitter: 'https://twitter.com/harrystore',
  socialYoutube: 'https://youtube.com/harrystore',
  announcementText: '✨ Winter Premium Sale: Up to 40% Off Storewide. Free Worldwide Shipping on Orders Over $250! ✨'
};

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    action: 'Product Updated',
    user: 'Harry Admin',
    timestamp: '2026-01-26T16:10:00Z',
    details: 'Changed price of "Chronograph Rose Gold Edition" to $1299 and sale price to $1099',
    type: 'product'
  },
  {
    id: 'log-2',
    action: 'New Order Received',
    user: 'System',
    timestamp: '2026-01-26T09:05:00Z',
    details: 'Order ORD-8944 placed by Robert Vance for $1458',
    type: 'order'
  },
  {
    id: 'log-3',
    action: 'Category Added',
    user: 'Harry Admin',
    timestamp: '2026-01-25T11:20:00Z',
    details: 'Created new category "Apparel & Clothing"',
    type: 'category'
  },
  {
    id: 'log-4',
    action: 'Website Settings Edited',
    user: 'Harry Admin',
    timestamp: '2026-01-24T14:30:00Z',
    details: 'Updated store WhatsApp support number to +15552345678',
    type: 'setting'
  }
];
