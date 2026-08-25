import { Brand, Product, SalesPoint, User, Order, Review, SystemLog, Cart, CartItem, OrderStatus } from '../types';
import {
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_SALES_POINTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_LOGS,
} from '../data/initialData';

const STORAGE_KEYS = {
  BRANDS: 'pleingas_brands_v1',
  PRODUCTS: 'pleingas_products_v1',
  SALES_POINTS: 'pleingas_sales_points_v1',
  USERS: 'pleingas_users_v1',
  CURRENT_USER_ID: 'pleingas_current_user_id_v1',
  ORDERS: 'pleingas_orders_v1',
  REVIEWS: 'pleingas_reviews_v1',
  LOGS: 'pleingas_logs_v1',
  CART: 'pleingas_cart_v1',
  COMMISSION_RATE: 'pleingas_commission_rate_v1',
};

export class AppStorage {
  static getBrands(): Brand[] {
    const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
    if (!data) {
      this.saveBrands(INITIAL_BRANDS);
      return INITIAL_BRANDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BRANDS;
    }
  }

  static saveBrands(brands: Brand[]): void {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
  }

  static getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      this.saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  static getSalesPoints(): SalesPoint[] {
    const data = localStorage.getItem(STORAGE_KEYS.SALES_POINTS);
    if (!data) {
      this.saveSalesPoints(INITIAL_SALES_POINTS);
      return INITIAL_SALES_POINTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SALES_POINTS;
    }
  }

  static saveSalesPoints(points: SalesPoint[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES_POINTS, JSON.stringify(points));
  }

  static getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      this.saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-client-1';
    const found = users.find((u) => u.id === currentId);
    return found || users[0];
  }

  static setCurrentUser(userOrId: string | User): void {
    const id = typeof userOrId === 'string' ? userOrId : userOrId.id;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  }

  static getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      this.saveOrders(INITIAL_ORDERS);
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  static saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static getReviews(): Review[] {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) {
      this.saveReviews(INITIAL_REVIEWS);
      return INITIAL_REVIEWS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  static saveReviews(reviews: Review[]): void {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }

  static addReview(reviewData: { salesPointId: string; orderId?: string; clientName: string; rating: number; comment: string }): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      orderId: reviewData.orderId || 'ord-review',
      salesPointId: reviewData.salesPointId,
      clientName: reviewData.clientName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
    };
    const updatedReviews = [newReview, ...reviews];
    this.saveReviews(updatedReviews);

    // Update salesPoint rating
    const salesPoints = this.getSalesPoints();
    const spIndex = salesPoints.findIndex((sp) => sp.id === reviewData.salesPointId);
    if (spIndex > -1) {
      const spReviews = updatedReviews.filter((r) => r.salesPointId === reviewData.salesPointId);
      const avg = spReviews.reduce((sum, r) => sum + r.rating, 0) / spReviews.length;
      salesPoints[spIndex].rating = Math.round(avg * 10) / 10;
      salesPoints[spIndex].reviewCount = spReviews.length;
      this.saveSalesPoints(salesPoints);
    }

    return newReview;
  }

  static getLogs(): SystemLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) {
      this.saveLogs(INITIAL_LOGS);
      return INITIAL_LOGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_LOGS;
    }
  }

  static saveLogs(logs: SystemLog[]): void {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }

  static logAction(action: string, actor: string, details: string, level: 'INFO' | 'WARN' | 'ALERT' | 'SUCCESS' = 'INFO'): void {
    const logs = this.getLogs();
    const newLog: SystemLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      actor,
      details,
      level,
    };
    this.saveLogs([newLog, ...logs.slice(0, 99)]);
  }

  static getCart(): Cart {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return { salesPointId: null, salesPointName: null, items: [] };
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return { salesPointId: null, salesPointName: null, items: [] };
      }
      return parsed;
    } catch {
      return { salesPointId: null, salesPointName: null, items: [] };
    }
  }

  static saveCart(cart: Cart): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  static clearCart(): void {
    this.saveCart({ salesPointId: null, salesPointName: null, items: [] });
  }

  static getCommissionRate(): number {
    const val = localStorage.getItem(STORAGE_KEYS.COMMISSION_RATE);
    return val ? parseFloat(val) : 3.5; // 3.5%
  }

  static saveCommissionRate(rate: number): void {
    localStorage.setItem(STORAGE_KEYS.COMMISSION_RATE, rate.toString());
  }

  /**
   * Safe stock reservation and deduction with transaction logic
   * Emulates Django's select_for_update() + transaction.atomic()
   */
  static placeOrder(order: Order): { success: boolean; error?: string } {
    const salesPoints = this.getSalesPoints();
    const spIndex = salesPoints.findIndex((sp) => sp.id === order.salesPointId);

    if (spIndex === -1) {
      return { success: false, error: 'Point de vente introuvable' };
    }

    const sp = salesPoints[spIndex];

    // Verify stock availability for each order item
    for (const item of order.items) {
      const pIndex = sp.products.findIndex((p) => p.productId === item.productId);
      if (pIndex === -1) {
        return { success: false, error: `Produit "${item.productName}" non commercialisé par ce point de vente.` };
      }
      if (sp.products[pIndex].stock < item.quantity) {
        return {
          success: false,
          error: `Rupture de stock : seulement ${sp.products[pIndex].stock} unité(s) disponible(s) pour "${item.productName}".`,
        };
      }
    }

    // Deduct stock atomically
    for (const item of order.items) {
      const pIndex = sp.products.findIndex((p) => p.productId === item.productId);
      sp.products[pIndex].stock -= item.quantity;
      if (sp.products[pIndex].stock === 0) {
        sp.products[pIndex].isAvailable = false;
      }
    }

    salesPoints[spIndex] = sp;
    this.saveSalesPoints(salesPoints);

    // Save order
    const orders = this.getOrders();
    this.saveOrders([order, ...orders]);

    // Clear cart
    this.clearCart();

    // Log action
    this.logAction(
      'ORDER_CREATED',
      order.clientName,
      `Nouvelle commande #${order.reference} de ${order.totalAmount} FCFA (${order.deliveryType})`,
      'SUCCESS'
    );

    return { success: true };
  }

  /**
   * Update order status with timeline tracking
   */
  static updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    actorName: string,
    note?: string,
    driverId?: string,
    driverName?: string,
    driverPhone?: string
  ): Order | null {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return null;

    const order = orders[orderIndex];
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (driverId) {
      order.driverId = driverId;
      order.driverName = driverName;
      order.driverPhone = driverPhone;
    }

    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Statut mis à jour vers ${newStatus} par ${actorName}`,
    });

    orders[orderIndex] = order;
    this.saveOrders(orders);

    this.logAction(
      'ORDER_STATUS_UPDATE',
      actorName,
      `Commande #${order.reference} passée au statut ${newStatus}`,
      'INFO'
    );

    return order;
  }

  static resetToDefault(): void {
    localStorage.clear();
    this.saveBrands(INITIAL_BRANDS);
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveSalesPoints(INITIAL_SALES_POINTS);
    this.saveUsers(INITIAL_USERS);
    this.saveOrders(INITIAL_ORDERS);
    this.saveReviews(INITIAL_REVIEWS);
    this.saveLogs(INITIAL_LOGS);
    this.setCurrentUser('user-client-1');
  }
}
