export type UserRole = 'client' | 'vendor' | 'driver' | 'admin' | 'brand';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  salesPointId?: string; // If role === 'vendor'
  brandId?: string; // If role === 'brand'
  defaultAddress?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  headquarters: string;
  supportPhone: string;
}

export type CylinderSize = '6kg' | '12.5kg' | '28kg' | '50kg';

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  weight: CylinderSize;
  gasType: 'Butane' | 'Propane';
  standardPrice: number; // e.g. in FCFA (or EUR)
  tareWeight: number; // kg
  description: string;
  imageUrl: string;
}

export interface SalesPointProduct {
  productId: string;
  product: Product;
  price: number;
  stock: number;
  isAvailable: boolean;
  minStockAlert: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SalesPoint {
  id: string;
  vendorUserId: string;
  name: string;
  legalName: string;
  address: string;
  city: string;
  neighborhood: string;
  coordinates: Coordinates;
  phone: string;
  whatsapp?: string;
  email: string;
  isOpen: boolean;
  openingHours: string;
  isVerified: boolean;
  offersDelivery: boolean;
  deliveryRadiusKm: number;
  deliveryBaseFee: number;
  deliveryFeePerKm: number;
  rating: number;
  reviewCount: number;
  products: SalesPointProduct[];
  image: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED';

export type DeliveryType = 'PICKUP' | 'DELIVERY';
export type PaymentMethod = 'ORANGE_MONEY' | 'MTN_MOMO' | 'WAVE' | 'CARD' | 'CASH_ON_DELIVERY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface CartProductItem {
  productId: string;
  productName: string;
  brandName: string;
  weight: CylinderSize;
  unitPrice: number;
  quantity: number;
}

export interface Cart {
  salesPointId: string | null;
  salesPointName: string | null;
  items: CartProductItem[];
}

export interface CartItem {
  salesPointId: string;
  productId: string;
  product: Product;
  unitPrice: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brandName: string;
  weight: CylinderSize;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  salesPointId: string;
  salesPointName: string;
  salesPointAddress: string;
  salesPointPhone: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  deliveryCoordinates?: Coordinates;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Review {
  id: string;
  orderId: string;
  salesPointId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  level: 'INFO' | 'WARN' | 'ALERT' | 'SUCCESS';
}
