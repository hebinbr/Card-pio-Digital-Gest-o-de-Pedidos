export interface Complement {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  badge?: string; // 'Mais Vendido', 'Novidade', 'Chef', 'Vegano', etc.
  preparationTimeMinutes?: number;
  complements?: Complement[];
  tags?: string[]; // 'vegano', 'sem-gluten', 'destaque', etc.
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  sortOrder: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedComplements: Complement[];
  notes: string;
}

export type OrderStatus = 'recebido' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'pagar_na_mesa';
  createdAt: string; // ISO string
  completedAt?: string;
  notes?: string;
}

export interface RestaurantConfig {
  name: string;
  slogan: string;
  address: string;
  phone: string;
  wifiName: string;
  wifiPassword: string;
  serviceFeePercentage: number;
  currencySymbol: string;
  totalTables: number;
}
