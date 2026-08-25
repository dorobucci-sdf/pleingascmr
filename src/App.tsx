import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/home/LandingPage';
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
import { ActorSimulatorModal } from './components/simulator/ActorSimulatorModal';
import { AppStorage } from './services/storage';
import {
  User,
  UserRole,
  SalesPoint,
  Brand,
  Product,
  Cart,
  Order,
  SystemLog,
  Coordinates,
} from './types';
import { Check, Sparkles, Layers, ArrowRight, UserPlus, Info, LogOut, Home } from 'lucide-react';

export default function App() {
  // Main Data States (currentUser is null by default if not logged in = Visitor mode)
  const [currentUser, setCurrentUser] = useState<User | null>(AppStorage.getCurrentUser());
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

  // View state (defaults depending on user role or 'landing' for visitor)
  const getInitialViewForRole = (role?: UserRole) => {
    if (!role) return 'landing';
    switch (role) {
      case 'vendor':
        return 'vendor_dashboard';
      case 'driver':
        return 'driver_dashboard';
      case 'brand':
        return 'brand_dashboard';
      case 'admin':
        return 'admin_dashboard';
      default:
        return 'map';
    }
  };

  const [activeView, setActiveView] = useState<string>(
    currentUser ? getInitialViewForRole(currentUser.role) : 'landing'
  );

  // Modal States
  const [selectedSalesPoint, setSelectedSalesPoint] = useState<SalesPoint | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOptions, setCheckoutOptions] = useState<any>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'LOGIN' | 'REGISTER' | 'PRESETS';
    role: UserRole;
  }>({
    isOpen: false,
    mode: 'REGISTER',
    role: 'client',
  });
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  // Welcome notice banner for logged in actors
  const [showRoleWelcomeBanner, setShowRoleWelcomeBanner] = useState<boolean>(true);

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

  // Open Auth Modal with specific mode and pre-selected role
  const handleOpenAuthModal = (
    mode: 'LOGIN' | 'REGISTER' | 'PRESETS' = 'REGISTER',
    role: UserRole = 'client'
  ) => {
    setAuthModalConfig({
      isOpen: true,
      mode,
      role,
    });
  };

  // Sync view whenever currentUser changes (Login / Registration / Switch)
  const handleUserChange = (newUser: User, isNewRegistration = false) => {
    AppStorage.setCurrentUser(newUser);
    setCurrentUser(newUser);
    refreshData();
    setShowRoleWelcomeBanner(true);

    // Direct redirection according to the actor role:
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

    if (isNewRegistration) {
      const roleLabel =
        newUser.role === 'client'
          ? 'Client / Consommateur'
          : newUser.role === 'vendor'
          ? 'Distributeur / Dépôt de Gaz'
          : newUser.role.toUpperCase();
      showToast(`🎉 Compte créé avec succès ! Bienvenue dans votre interface ${roleLabel}.`);
    } else {
      showToast(`✓ Connecté en tant que ${newUser.name} (${newUser.role.toUpperCase()})`);
    }
  };

  // Logout handler: resets to visitor state & shows landing page
  const handleLogout = () => {
    AppStorage.logout();
    setCurrentUser(null);
    setActiveView('landing');
    setSelectedSalesPoint(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    showToast("👋 Déconnexion réussie. Bienvenue sur la page d'accueil pleinGas.");
  };

  // Safe navigation handler that strictly enforces role boundaries
  const handleNavigate = (view: string) => {
    if (view === 'landing') {
      setActiveView('landing');
      return;
    }

    if (!currentUser) {
      setActiveView('landing');
      return;
    }

    if (currentUser.role === 'client') {
      if (view === 'map' || view === 'client_dashboard') {
        setActiveView(view);
      } else {
        setActiveView('map');
      }
    } else if (currentUser.role === 'vendor') {
      setActiveView('vendor_dashboard');
    } else if (currentUser.role === 'driver') {
      setActiveView('driver_dashboard');
    } else if (currentUser.role === 'admin') {
      setActiveView('admin_dashboard');
    } else if (currentUser.role === 'brand') {
      setActiveView('brand_dashboard');
    }
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white pb-16 lg:pb-0">
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
        onSelectUser={(u) => handleUserChange(u, false)}
        cartCount={cart.items.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
        onLogout={handleLogout}
        userLocation={userLocation}
        onSelectCity={handleSelectCity}
        onRequestGPS={handleRequestGPS}
        isGpsActive={isGpsActive}
      />

      {/* Dynamic Actor Context Bar / Active Role Ribbon (Only when logged in) */}
      {currentUser && showRoleWelcomeBanner && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 border-b border-slate-700/50 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>

              <span className="font-extrabold text-orange-400 uppercase tracking-wider text-[10px]">
                {currentUser.role === 'client' && 'Espace Consommateur / Client Actif'}
                {currentUser.role === 'vendor' && 'Espace Distributeur / Dépôt de Gaz Actif'}
                {currentUser.role === 'driver' && 'Espace Livreur / Transporteur Actif'}
                {currentUser.role === 'brand' && 'Espace Fournisseur Marque Actif'}
                {currentUser.role === 'admin' && 'Espace Super Administrateur Actif'}
              </span>

              <span className="text-slate-400 hidden sm:inline">•</span>

              <span className="text-slate-300 font-medium truncate">
                Connecté : <strong>{currentUser.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsSimulatorModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 border border-slate-700 transition-colors"
              >
                <Layers className="w-3 h-3 text-orange-400" />
                <span>Profils Acteur</span>
              </button>

              <button
                onClick={() => handleOpenAuthModal('REGISTER')}
                className="px-2.5 py-1 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 text-[11px] font-bold flex items-center gap-1 border border-orange-500/30 transition-colors"
              >
                <UserPlus className="w-3 h-3 text-orange-400" />
                <span>Changer d'Acteur</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 text-[11px] font-bold flex items-center gap-1 border border-red-800/40 transition-colors"
                title="Quitter la session et revenir à l'accueil visiteur"
              >
                <LogOut className="w-3 h-3 text-red-400" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* CASE 0: VISITOR (Unauthenticated) -> Show Landing Page with Services */}
        {!currentUser && (
          <LandingPage
            onOpenAuth={(mode, role) => handleOpenAuthModal(mode, role || 'client')}
          />
        )}

        {/* CASE 1: ACTOR CLIENT -> Gas Search Map & Catalog */}
        {currentUser?.role === 'client' && activeView === 'map' && (
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

        {/* CASE 1b: ACTOR CLIENT -> Orders & Tracking Dashboard */}
        {currentUser?.role === 'client' && activeView === 'client_dashboard' && (
          <ClientDashboard
            currentUser={currentUser}
            orders={orders}
            onOpenSearch={() => setActiveView('map')}
            onTrackOrder={(order) => setTrackedOrder(order)}
          />
        )}

        {/* CASE 2: ACTOR VENDOR / DISTRIBUTEUR -> Point of Sale, Stocks & Orders Dashboard */}
        {currentUser?.role === 'vendor' && (
          <VendorDashboard
            currentUser={currentUser}
            salesPoints={salesPoints}
            products={products}
            orders={orders}
            onDataChanged={refreshData}
          />
        )}

        {/* CASE 3: ACTOR DRIVER -> Deliveries & Route */}
        {currentUser?.role === 'driver' && (
          <DriverDashboard
            currentUser={currentUser}
            orders={orders}
            onDataChanged={refreshData}
          />
        )}

        {/* CASE 4: ACTOR SUPER ADMIN -> Governance & Regulation */}
        {currentUser?.role === 'admin' && (
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

        {/* CASE 5: ACTOR BRAND -> Brand Portal */}
        {currentUser?.role === 'brand' && (
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
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={(options) => {
          setCheckoutOptions(options);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout Modal */}
      {isCheckoutOpen && cartSalesPoint && currentUser && (
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
          currentUser={currentUser || undefined}
          onClose={() => {
            setTrackedOrder(null);
            refreshData();
          }}
          onDataChanged={refreshData}
        />
      )}

      {/* 5. Authentication & Registration Modal */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
        currentUser={currentUser}
        initialMode={authModalConfig.mode}
        initialRole={authModalConfig.role}
        onUserAuthenticated={(authenticatedUser, isNewRegistration) => {
          handleUserChange(authenticatedUser, isNewRegistration);
          setAuthModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
      />

      {/* 6. Actor Simulator Hub Modal with dedicated sections */}
      <ActorSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        currentUser={currentUser}
        allUsers={users}
        salesPoints={salesPoints}
        brands={brands}
        onSelectUser={(u) => handleUserChange(u, false)}
        onOpenAuthModal={() => {
          setIsSimulatorModalOpen(false);
          handleOpenAuthModal('REGISTER');
        }}
      />
    </div>
  );
}
