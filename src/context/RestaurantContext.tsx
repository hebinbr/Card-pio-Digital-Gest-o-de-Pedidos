import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, OrderStatus, RestaurantConfig, Complement } from '../types';
import { initialCategories, initialProducts, initialOrders, initialConfig } from '../data/mockData';

interface SalesReportData {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  averageTicket: number;
  topSellingProducts: { product: Product; totalQty: number; totalSales: number }[];
  categorySales: { categoryId: string; categoryName: string; count: number; total: number; percentage: number }[];
  hourlySales: { hourLabel: string; ordersCount: number; totalRevenue: number }[];
  statusBreakdown: Record<OrderStatus, number>;
  paymentBreakdown: { method: string; count: number; total: number }[];
}

interface RestaurantContextType {
  // Config & View
  config: RestaurantConfig;
  updateConfig: (updates: Partial<RestaurantConfig>) => void;
  currentView: 'menu' | 'admin';
  setCurrentView: (view: 'menu' | 'admin') => void;
  adminTab: 'orders' | 'menu_editor' | 'reports' | 'qrcodes' | 'settings';
  setAdminTab: (tab: 'orders' | 'menu_editor' | 'reports' | 'qrcodes' | 'settings') => void;

  // Table
  activeTable: string;
  setActiveTable: (table: string) => void;

  // Catalog
  categories: Category[];
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  addCategory: (name: string, iconName?: string) => Category;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, complements: Complement[], notes: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartSubtotal: number;
  cartServiceFee: number;
  cartTotal: number;
  cartItemCount: number;

  // Orders
  orders: Order[];
  createOrder: (data: {
    customerName?: string;
    customerPhone?: string;
    paymentMethod: Order['paymentMethod'];
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  pendingOrdersCount: number;

  // Reporting
  salesReport: SalesReportData;
  resetAllToDefault: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'cardapio_produtos_v2',
  CATEGORIES: 'cardapio_categorias_v2',
  ORDERS: 'cardapio_pedidos_v2',
  CONFIG: 'cardapio_config_v2',
  CART: 'cardapio_carrinho_v2',
  TABLE: 'cardapio_mesa_v2'
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read table from URL params if present (e.g. ?mesa=4 or ?table=4)
  const getInitialTable = (): string => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramTable = urlParams.get('mesa') || urlParams.get('table');
      if (paramTable) {
        localStorage.setItem(STORAGE_KEYS.TABLE, paramTable);
        return paramTable;
      }
      const saved = localStorage.getItem(STORAGE_KEYS.TABLE);
      return saved || '1';
    } catch {
      return '1';
    }
  };

  const [activeTable, setActiveTableState] = useState<string>(getInitialTable);
  const [currentView, setCurrentView] = useState<'menu' | 'admin'>('menu');
  const [adminTab, setAdminTab] = useState<'orders' | 'menu_editor' | 'reports' | 'qrcodes' | 'settings'>('orders');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Config
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : initialConfig;
    } catch {
      return initialConfig;
    }
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Synchronize with LocalStorage & cross-tab events
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const setActiveTable = (table: string) => {
    setActiveTableState(table);
    try {
      localStorage.setItem(STORAGE_KEYS.TABLE, table);
      // Update URL query string without reloading page
      const url = new URL(window.location.href);
      url.searchParams.set('mesa', table);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  const updateConfig = (updates: Partial<RestaurantConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  // Category Actions
  const addCategory = (name: string, iconName = 'Utensils'): Category => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      iconName,
      sortOrder: categories.length + 1
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Cart Actions
  const addToCart = (product: Product, quantity: number, complements: Complement[], notes: string) => {
    const cartItemId = `${product.id}-${complements.map(c => c.id).sort().join('_')}-${notes.trim()}`;
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          quantity,
          selectedComplements: complements,
          notes
        }
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const complementsTotal = item.selectedComplements.reduce((cSum, comp) => cSum + comp.price, 0);
    return sum + (item.product.price + complementsTotal) * item.quantity;
  }, 0);

  const cartServiceFee = config.serviceFeePercentage > 0
    ? (cartSubtotal * config.serviceFeePercentage) / 100
    : 0;

  const cartTotal = cartSubtotal + cartServiceFee;

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders Actions
  const createOrder = (data: {
    customerName?: string;
    customerPhone?: string;
    paymentMethod: Order['paymentMethod'];
    notes?: string;
  }): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#PED-${randomSuffix}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      tableNumber: activeTable,
      customerName: data.customerName || `Cliente Mesa ${activeTable}`,
      customerPhone: data.customerPhone,
      items: [...cart],
      subtotal: cartSubtotal,
      serviceFee: cartServiceFee,
      total: cartTotal,
      status: 'recebido',
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString(),
      notes: data.notes
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          completedAt: status === 'entregue' ? new Date().toISOString() : order.completedAt
        };
      }
      return order;
    }));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'recebido' || o.status === 'preparando').length;

  // Real-time Sales Analytics calculation
  const calculateSalesReport = (): SalesReportData => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Valid orders are those not cancelled
    const validOrders = orders.filter(o => o.status !== 'cancelado');
    const todayOrdersList = validOrders.filter(o => new Date(o.createdAt).getTime() >= todayStart);

    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    const todayRevenue = todayOrdersList.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = validOrders.length;
    const todayOrders = todayOrdersList.length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top selling products
    const productStatsMap = new Map<string, { product: Product; totalQty: number; totalSales: number }>();
    validOrders.forEach(o => {
      o.items.forEach(item => {
        const pId = item.product.id;
        const compTotal = item.selectedComplements.reduce((acc, c) => acc + c.price, 0);
        const itemRevenue = (item.product.price + compTotal) * item.quantity;

        const existing = productStatsMap.get(pId);
        if (existing) {
          existing.totalQty += item.quantity;
          existing.totalSales += itemRevenue;
        } else {
          productStatsMap.set(pId, {
            product: item.product,
            totalQty: item.quantity,
            totalSales: itemRevenue
          });
        }
      });
    });

    const topSellingProducts = Array.from(productStatsMap.values())
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 5);

    // Sales by Category
    const categoryStatsMap = new Map<string, { count: number; total: number }>();
    validOrders.forEach(o => {
      o.items.forEach(item => {
        const catId = item.product.categoryId || 'sem-categoria';
        const compTotal = item.selectedComplements.reduce((acc, c) => acc + c.price, 0);
        const itemTotal = (item.product.price + compTotal) * item.quantity;

        const curr = categoryStatsMap.get(catId) || { count: 0, total: 0 };
        categoryStatsMap.set(catId, {
          count: curr.count + item.quantity,
          total: curr.total + itemTotal
        });
      });
    });

    const categorySales = categories.map(cat => {
      const stats = categoryStatsMap.get(cat.id) || { count: 0, total: 0 };
      const percentage = totalRevenue > 0 ? (stats.total / totalRevenue) * 100 : 0;
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        count: stats.count,
        total: stats.total,
        percentage: Math.round(percentage * 10) / 10
      };
    }).sort((a, b) => b.total - a.total);

    // Hourly sales (split into 4 convenient periods: Almoço 11-15h, Tarde 15-18h, Happy Hour/Jantar 18-21h, Noite 21-00h)
    const timeBuckets = [
      { hourLabel: 'Almoço (11h - 15h)', start: 11, end: 15, ordersCount: 0, totalRevenue: 0 },
      { hourLabel: 'Tarde (15h - 18h)', start: 15, end: 18, ordersCount: 0, totalRevenue: 0 },
      { hourLabel: 'Happy Hour / Jantar (18h - 21h)', start: 18, end: 21, ordersCount: 0, totalRevenue: 0 },
      { hourLabel: 'Noite (21h - 00h)', start: 21, end: 24, ordersCount: 0, totalRevenue: 0 },
    ];

    validOrders.forEach(o => {
      const date = new Date(o.createdAt);
      const h = date.getHours();
      const bucket = timeBuckets.find(b => h >= b.start && h < b.end) || timeBuckets[0];
      bucket.ordersCount += 1;
      bucket.totalRevenue += o.total;
    });

    // Status breakdown
    const statusBreakdown: Record<OrderStatus, number> = {
      recebido: 0,
      preparando: 0,
      pronto: 0,
      entregue: 0,
      cancelado: 0
    };
    orders.forEach(o => {
      if (statusBreakdown[o.status] !== undefined) {
        statusBreakdown[o.status] += 1;
      }
    });

    // Payment methods breakdown
    const paymentMap = new Map<string, { count: number; total: number }>();
    validOrders.forEach(o => {
      const methodLabels: Record<string, string> = {
        pix: 'PIX Instantâneo',
        cartao_credito: 'Cartão de Crédito',
        cartao_debito: 'Cartão de Débito',
        pagar_na_mesa: 'Pagar na Mesa / Garçom',
        dinheiro: 'Dinheiro Físico'
      };
      const label = methodLabels[o.paymentMethod] || o.paymentMethod;
      const curr = paymentMap.get(label) || { count: 0, total: 0 };
      paymentMap.set(label, {
        count: curr.count + 1,
        total: curr.total + o.total
      });
    });

    const paymentBreakdown = Array.from(paymentMap.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      total: data.total
    })).sort((a, b) => b.total - a.total);

    return {
      totalRevenue,
      todayRevenue,
      totalOrders,
      todayOrders,
      averageTicket,
      topSellingProducts,
      categorySales,
      hourlySales: timeBuckets,
      statusBreakdown,
      paymentBreakdown
    };
  };

  const resetAllToDefault = () => {
    setConfig(initialConfig);
    setCategories(initialCategories);
    setProducts(initialProducts);
    setOrders(initialOrders);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  const salesReport = calculateSalesReport();

  return (
    <RestaurantContext.Provider
      value={{
        config,
        updateConfig,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        activeTable,
        setActiveTable,
        categories,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotal,
        cartServiceFee,
        cartTotal,
        cartItemCount,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        activeOrder,
        setActiveOrder,
        pendingOrdersCount,
        salesReport,
        resetAllToDefault
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
