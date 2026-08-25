import React, { useState } from 'react';
import {
  Flame,
  MapPin,
  ShoppingCart,
  User as UserIcon,
  Shield,
  Store,
  Bike,
  Building2,
  FileCode2,
  ChevronDown,
  Navigation,
  CheckCircle2,
  Layers,
  Search,
  Package,
  Menu,
  X,
} from 'lucide-react';
import { User, UserRole, Coordinates } from '../types';
import { CITY_PRESETS } from '../services/geo';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuthModal?: () => void;
  onOpenDocsModal: () => void;
  userLocation?: Coordinates;
  onSelectCity?: (city: { name: string; coordinates: Coordinates }) => void;
  onRequestGPS?: () => void;
  isGpsActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers = [],
  onSelectUser,
  cartCount,
  onOpenCart,
  activeView,
  onNavigate,
  onOpenDocsModal,
  userLocation,
  onSelectCity,
  onRequestGPS,
  isGpsActive = false,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Super Admin', icon: Shield, bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'vendor':
        return { label: 'Point de Vente', icon: Store, bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'driver':
        return { label: 'Livreur', icon: Bike, bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'brand':
        return { label: 'Fournisseur Marque', icon: Building2, bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'Client', icon: UserIcon, bg: 'bg-orange-100 text-orange-800 border-orange-200' };
    }
  };

  const currentRoleBadge = getRoleBadge(currentUser.role);
  const RoleIcon = currentRoleBadge.icon;

  const handleRoleSelect = (u: User) => {
    onSelectUser(u);
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => onNavigate('map')}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden"
                id="brand-logo-btn"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <Flame className="w-6 h-6 fill-white stroke-orange-600 stroke-1" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
                    plein<span className="text-orange-600">Gas</span>
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 -mt-1 uppercase tracking-wider">
                    Gaz & Livraison Géoloc
                  </span>
                </div>
              </button>

              {/* City & Geolocation Picker Dropdown (Desktop & Tablet) */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowLocationMenu(!showLocationMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
                  id="location-picker-btn"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isGpsActive ? 'text-emerald-600' : 'text-orange-600'}`} />
                  <span className="max-w-[130px] truncate">Douala / Akwa</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showLocationMenu && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Zone de recherche
                      </span>
                      {isGpsActive && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> GPS actif
                        </span>
                      )}
                    </div>

                    {onRequestGPS && (
                      <button
                        onClick={() => {
                          onRequestGPS();
                          setShowLocationMenu(false);
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center gap-2 border-b border-slate-100"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Utiliser ma position GPS exacte</span>
                      </button>
                    )}

                    <div className="p-1.5 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 px-2.5 py-1 block uppercase tracking-wider">
                        Villes & Dépôts
                      </span>
                      {CITY_PRESETS.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            if (onSelectCity) onSelectCity(city);
                            setShowLocationMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {city.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{city.country}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('map')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'map'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="nav-map-tab"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Carte & Dépôts</span>
              </button>

              {currentUser.role === 'client' && (
                <button
                  onClick={() => onNavigate('client_dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeView === 'client_dashboard'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  id="nav-orders-tab"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Mes Commandes</span>
                </button>
              )}

              {currentUser.role === 'vendor' && (
                <button
                  onClick={() => onNavigate('vendor_dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeView === 'vendor_dashboard'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Gestion Point de Vente</span>
                </button>
              )}

              {currentUser.role === 'driver' && (
                <button
                  onClick={() => onNavigate('driver_dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeView === 'driver_dashboard'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Espace Livreur</span>
                </button>
              )}

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin_dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeView === 'admin_dashboard'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </button>
              )}

              {currentUser.role === 'brand' && (
                <button
                  onClick={() => onNavigate('brand_dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeView === 'brand_dashboard'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Portail Marque</span>
                </button>
              )}

              <button
                onClick={onOpenDocsModal}
                className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 transition-all flex items-center gap-1.5"
                id="nav-docs-tab"
                title="Consulter le dossier d'architecture Django et les 12 spécifications techniques"
              >
                <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Architecture Django (12 docs)</span>
              </button>
            </nav>

            {/* Right Actions: Cart, Role Switcher, Mobile Toggle */}
            <div className="flex items-center gap-2">
              {/* Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 text-orange-700 border border-orange-200 transition-all focus:outline-hidden"
                id="cart-drawer-btn"
                aria-label="Voir le panier"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-orange-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Role Simulation Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${currentRoleBadge.bg}`}
                  id="user-role-switcher-btn"
                >
                  <RoleIcon className="w-4 h-4 shrink-0" />
                  <div className="text-left hidden sm:block">
                    <span className="block leading-none truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[9px] opacity-80 uppercase tracking-wider font-extrabold">
                      {currentRoleBadge.label}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                        Simulateur d'acteurs système
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Basculez de rôle pour tester instantanément les flux métier.
                      </p>
                    </div>

                    <div className="p-1.5 space-y-1 max-h-[340px] overflow-y-auto">
                      {allUsers.map((u) => {
                        const badge = getRoleBadge(u.role);
                        const Icon = badge.icon;
                        const isSelected = u.id === currentUser.id;

                        return (
                          <button
                            key={u.id}
                            onClick={() => handleRoleSelect(u)}
                            className={`w-full p-2.5 text-left rounded-xl flex items-center gap-3 transition-colors ${
                              isSelected ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-slate-800 text-white' : badge.bg
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold truncate">{u.name}</div>
                              <div className="text-[10px] opacity-75 capitalize flex items-center gap-1.5">
                                <span>{badge.label}</span>
                                <span>•</span>
                                <span className="truncate">{u.email}</span>
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => {
                  onNavigate('map');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                  activeView === 'map' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Carte & Dépôts</span>
              </button>

              <button
                onClick={() => {
                  if (currentUser.role === 'client') onNavigate('client_dashboard');
                  else if (currentUser.role === 'vendor') onNavigate('vendor_dashboard');
                  else if (currentUser.role === 'driver') onNavigate('driver_dashboard');
                  else if (currentUser.role === 'admin') onNavigate('admin_dashboard');
                  else if (currentUser.role === 'brand') onNavigate('brand_dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                  activeView !== 'map' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <RoleIcon className="w-4 h-4" />
                <span>Espace {currentRoleBadge.label}</span>
              </button>
            </div>

            <button
              onClick={() => {
                onOpenDocsModal();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 border border-indigo-200"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Dossier Architecture Django (12 docs)</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar for seamless Thumb-Reach */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onNavigate('map')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeView === 'map' ? 'text-orange-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Explorer</span>
        </button>

        <button
          onClick={() => {
            if (currentUser.role === 'client') onNavigate('client_dashboard');
            else if (currentUser.role === 'vendor') onNavigate('vendor_dashboard');
            else if (currentUser.role === 'driver') onNavigate('driver_dashboard');
            else if (currentUser.role === 'admin') onNavigate('admin_dashboard');
            else if (currentUser.role === 'brand') onNavigate('brand_dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeView !== 'map' ? 'text-orange-600 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <RoleIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Espace</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 font-medium"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Panier</span>
        </button>

        <button
          onClick={onOpenDocsModal}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-indigo-600 font-medium"
        >
          <FileCode2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Specs</span>
        </button>
      </nav>
    </>
  );
};
