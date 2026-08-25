import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GasSearchMap } from './components/client/GasSearchMap';
import { SalesPointModal } from './components/client/SalesPointModal';
import { CartDrawer } from './components/client/CartDrawer';
import { CheckoutModal } from './components/client/CheckoutModal';
import { OrderTrackingModal } from './components/client/OrderTrackingModal';
import { ClientDashboard } from './components/client/ClientDashboard';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BrandDashboard } from './components/brand/BrandDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { ArchitectureDocsModal } from './components/docs/ArchitectureDocsModal';
import { AppStorage } from './services/storage';
import {
  User,
  SalesPoint,
  Brand,
  Product,
  Cart,
  Order,
  SystemLog,
  Coordinates,
} from './types';
import { Check } from 'lucide-react';

export default function App() {
  // Main Data States
  const [currentUser, setCurrentUser] = useState<User>(AppStorage.getCurrentUser());
  const [users, setUsers] = useState<User[]>(AppStorage.getUsers());
  const [salesPoints, setSalesPoints] = useState<SalesPoint[]>(AppStorage.getSalesPoints());
  const [brands, setBrands] = useState<Brand[]>(AppStorage.getBrands());
  const [products, setProducts] = useState<Product[]>(AppStorage.getProducts());
  const [orders, setOrders] = useState<Order[]>(AppStorage.getOrders());
  const [cart, setCart] = useState<Cart>(AppStorage.getCart());
  const [logs, setLogs] = useState<SystemLog[]>(AppStorage.getLogs());

  // Location & Geolocation state (Akwa Douala default)
  const [userLocation, setUserLocation] = useState<Coordinates>({
    lat: 4.0511,
    lng: 9.7085,
  });
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);

  // View state
  const [activeView, setActiveView] = useState<string>('map');

  // Modal States
  const [selectedSalesPoint, setSelectedSalesPoint] = useState<SalesPoint | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOptions, setCheckoutOptions] = useState<any>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = () => {
    setUsers(AppStorage.getUsers());
    setSalesPoints(AppStorage.getSalesPoints());
    setBrands(AppStorage.getBrands());
    setProducts(AppStorage.getProducts());
    setOrders(AppStorage.getOrders());
    setCart(AppStorage.getCart());
    setLogs(AppStorage.getLogs());
    setCurrentUser(AppStorage.getCurrentUser());
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // GPS Request Handler
  const handleRequestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsGpsActive(true);
          showToast('📍 Position GPS actualisée avec succès !');
        },
        (err) => {
          console.warn('GPS denied or unavailable', err);
          showToast('⚠️ Géolocalisation non autorisée (Position Douala par défaut)');
        }
      );
    }
  };

  // Select City preset
  const handleSelectCity = (city: { name: string; coordinates: Coordinates }) => {
    setUserLocation(city.coordinates);
    setIsGpsActive(false);
    showToast(`📍 Zone définie sur : ${city.name}`);
  };

  // Sync active view based on user role when user changes
  const handleUserChange = (newUser: User) => {
    AppStorage.setCurrentUser(newUser);
    setCurrentUser(newUser);
    if (newUser.role === 'client') {
      setActiveView('map');
    } else if (newUser.role === 'vendor') {
      setActiveView('vendor_dashboard');
    } else if (newUser.role === 'driver') {
      setActiveView('driver_dashboard');
    } else if (newUser.role === 'admin') {
      setActiveView('admin_dashboard');
    } else if (newUser.role === 'brand') {
      setActiveView('brand_dashboard');
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, salesPoint: SalesPoint, quantity: number) => {
    // Check if cart already has items from another sales point
    if (cart.salesPointId && cart.salesPointId !== salesPoint.id && cart.items.length > 0) {
      const confirmChange = window.confirm(
        `Votre panier contient déjà des bouteilles de "${cart.salesPointName}".\nVoulez-vous réinitialiser votre panier pour commander auprès de "${salesPoint.name}" ?`
      );
      if (!confirmChange) return;
    }

    const spProduct = salesPoint.products.find((p) => p.productId === product.id);
    const unitPrice = spProduct ? spProduct.price : product.standardPrice;

    let updatedItems = [...cart.items];
    if (cart.salesPointId !== salesPoint.id) {
      updatedItems = [];
    }

    const existingIndex = updatedItems.findIndex((i) => i.productId === product.id);
    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems.push({
        productId: product.id,
        productName: product.name,
        brandName: product.brandName,
        weight: product.weight,
        unitPrice: unitPrice,
        quantity: quantity,
      });
    }

    const newCart: Cart = {
      salesPointId: salesPoint.id,
      salesPointName: salesPoint.name,
      items: updatedItems,
    };

    AppStorage.saveCart(newCart);
    setCart(newCart);
    showToast(`✓ ${quantity}x ${product.name} ajouté au panier !`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    let updatedItems = [...cart.items];
    if (quantity <= 0) {
      updatedItems = updatedItems.filter((i) => i.productId !== productId);
    } else {
      const idx = updatedItems.findIndex((i) => i.productId === productId);
      if (idx > -1) {
        updatedItems[idx].quantity = quantity;
      }
    }

    const newCart: Cart = {
      salesPointId: updatedItems.length === 0 ? null : cart.salesPointId,
      salesPointName: updatedItems.length === 0 ? null : cart.salesPointName,
      items: updatedItems,
    };

    AppStorage.saveCart(newCart);
    setCart(newCart);
  };

  const handleClearCart = () => {
    AppStorage.clearCart();
    setCart({ salesPointId: null, salesPointName: null, items: [] });
  };

  const handleOrderCreated = (newOrder: Order) => {
    refreshData();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setSelectedSalesPoint(null);
    setTrackedOrder(newOrder);
    showToast(`🎉 Commande #${newOrder.reference} confirmée avec succès !`);
  };

  // Find sales point for active cart
  const cartSalesPoint = salesPoints.find((sp) => sp.id === cart.salesPointId) || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-extrabold border border-slate-800 animate-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={handleUserChange}
        cartCount={cart.items.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDocsModal={() => setIsDocsModalOpen(true)}
        userLocation={userLocation}
        onSelectCity={handleSelectCity}
        onRequestGPS={handleRequestGPS}
        isGpsActive={isGpsActive}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW: Gas Map & Search (Client Home) */}
        {activeView === 'map' && (
          <GasSearchMap
            salesPoints={salesPoints}
            brands={brands}
            products={products}
            userLocation={userLocation}
            isGpsActive={isGpsActive}
            onRequestGPS={handleRequestGPS}
            onSelectSalesPoint={(sp) => setSelectedSalesPoint(sp)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* VIEW: Client Orders Dashboard */}
        {activeView === 'client_dashboard' && (
          <ClientDashboard
            currentUser={currentUser}
            orders={orders}
            onOpenSearch={() => setActiveView('map')}
            onTrackOrder={(order) => setTrackedOrder(order)}
          />
        )}

        {/* VIEW: Vendor / Point of Sale Dashboard */}
        {activeView === 'vendor_dashboard' && (
          <VendorDashboard
            currentUser={currentUser}
            salesPoints={salesPoints}
            products={products}
            orders={orders}
            onDataChanged={refreshData}
          />
        )}

        {/* VIEW: Driver Delivery Dashboard */}
        {activeView === 'driver_dashboard' && (
          <DriverDashboard
            currentUser={currentUser}
            orders={orders}
            onDataChanged={refreshData}
          />
        )}

        {/* VIEW: Super Administrator Governance Dashboard */}
        {activeView === 'admin_dashboard' && (
          <AdminDashboard
            currentUser={currentUser}
            salesPoints={salesPoints}
            brands={brands}
            products={products}
            orders={orders}
            users={users}
            logs={logs}
            onDataChanged={refreshData}
          />
        )}

        {/* VIEW: Brand Partner Distribution Dashboard */}
        {activeView === 'brand_dashboard' && (
          <BrandDashboard
            currentUser={currentUser}
            brands={brands}
            salesPoints={salesPoints}
            orders={orders}
            products={products}
          />
        )}
      </main>

      {/* MODALS */}

      {/* 1. Point of Sale Detail Modal */}
      {selectedSalesPoint && (
        <SalesPointModal
          salesPoint={selectedSalesPoint}
          products={products}
          currentCart={cart}
          onClose={() => setSelectedSalesPoint(null)}
          onAddToCart={(product, quantity) =>
            handleAddToCart(product, selectedSalesPoint, quantity)
          }
        />
      )}

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        salesPoint={cartSalesPoint}
        userLocation={userLocation}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={(options) => {
          setCheckoutOptions(options);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout Modal */}
      {isCheckoutOpen && cartSalesPoint && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          salesPoint={cartSalesPoint}
          currentUser={currentUser}
          orderOptions={checkoutOptions}
          onOrderSuccess={handleOrderCreated}
        />
      )}

      {/* 4. Live Order Tracking Modal */}
      {trackedOrder && (
        <OrderTrackingModal
          order={trackedOrder}
          currentUser={currentUser}
          onClose={() => {
            setTrackedOrder(null);
            refreshData();
          }}
          onDataChanged={refreshData}
        />
      )}

      {/* 5. Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserAuthenticated={(authenticatedUser) => {
          handleUserChange(authenticatedUser);
          setIsAuthModalOpen(false);
          showToast(`Connecté avec succès : ${authenticatedUser.name}`);
        }}
      />

      {/* 6. Architecture & Django Specifications Dossier Modal */}
      <ArchitectureDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
}
