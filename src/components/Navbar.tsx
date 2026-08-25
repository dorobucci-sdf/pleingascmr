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
  ChevronDown,
  Navigation,
  CheckCircle2,
  Layers,
  Search,
  Package,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  UserPlus,
  LogIn,
  LogOut,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Home,
} from 'lucide-react';
import { User, UserRole, Coordinates } from '../types';
import { CITY_PRESETS } from '../services/geo';

interface NavbarProps {
  currentUser: User | null;
  allUsers?: User[];
  onSelectUser?: (user: User) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  activeView?: string;
  onNavigate?: (view: string) => void;
  onOpenAuthModal?: (mode?: 'LOGIN' | 'REGISTER' | 'PRESETS', role?: UserRole) => void;
  onOpenSimulatorModal?: () => void;
  onLogout?: () => void;
  userLocation?: Coordinates;
  onSelectCity?: (city: { name: string; coordinates: Coordinates }) => void;
  onRequestGPS?: () => void;
  isGpsActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers = [],
  onSelectUser,
  cartCount = 0,
  onOpenCart,
  activeView,
  onNavigate,
  onOpenAuthModal,
  onOpenSimulatorModal,
  onLogout,
  userLocation,
  onSelectCity,
  onRequestGPS,
  isGpsActive = false,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role?: UserRole) => {
    if (!role) {
      return {
        label: 'Visiteur',
        sectionTitle: 'Accueil Visiteur',
        description: 'Découverte des services pleinGas',
        icon: UserIcon,
        bg: 'bg-slate-100 text-slate-800 border-slate-200',
        accent: 'bg-slate-700',
        headerBg: 'bg-slate-50 text-slate-900 border-slate-200',
      };
    }
    switch (role) {
      case 'admin':
        return {
          label: 'Super Admin',
          sectionTitle: '🛡️ Super Administrateur & Régulation',
          description: 'Gouvernance, validation dépôts et régulation',
          icon: Shield,
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          accent: 'bg-purple-600',
          headerBg: 'bg-purple-50 text-purple-900 border-purple-200',
        };
      case 'vendor':
        return {
          label: 'Distributeur',
          sectionTitle: '🏪 Gérants de Points de Vente & Dépôts',
          description: 'Gestion des stocks, prix et commandes',
          icon: Store,
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          accent: 'bg-blue-600',
          headerBg: 'bg-blue-50 text-blue-900 border-blue-200',
        };
      case 'driver':
        return {
          label: 'Livreur',
          sectionTitle: '🛵 Livreurs & Transporteurs',
          description: 'Missions géolocalisées et validation OTP',
          icon: Bike,
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          accent: 'bg-emerald-600',
          headerBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        };
      case 'brand':
        return {
          label: 'Fournisseur Marque',
          sectionTitle: '🏢 Fournisseurs & Marques de Gaz',
          description: 'Suivi des volumes et stocks partenaires',
          icon: Building2,
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          accent: 'bg-amber-600',
          headerBg: 'bg-amber-50 text-amber-900 border-amber-200',
        };
      default:
        return {
          label: 'Client',
          sectionTitle: '🛒 Consommateurs & Clients Particuliers',
          description: 'Recherche géoloc, commandes et livraisons',
          icon: UserIcon,
          bg: 'bg-orange-100 text-orange-800 border-orange-200',
          accent: 'bg-orange-500',
          headerBg: 'bg-orange-50 text-orange-900 border-orange-200',
        };
    }
  };

  const currentRoleBadge = getRoleBadge(currentUser?.role);
  const RoleIcon = currentRoleBadge.icon;

  const handleRoleSelect = (u: User) => {
    if (onSelectUser) onSelectUser(u);
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
  };

  // Group users by unique system actor role
  const roleGroups: { role: UserRole; title: string; subtitle: string; icon: any; colorClass: string; badgeClass: string; headerBg: string }[] = [
    {
      role: 'client',
      title: 'Acteur 1 : Consommateurs & Clients',
      subtitle: 'Ménages, Familles, Restaurants',
      icon: UserIcon,
      colorClass: 'text-orange-600',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
      headerBg: 'bg-orange-50/80 border-orange-200',
    },
    {
      role: 'vendor',
      title: 'Acteur 2 : Points de Vente & Dépôts',
      subtitle: 'Gérants de Stations & Dépôts de quartier',
      icon: Store,
      colorClass: 'text-blue-600',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      headerBg: 'bg-blue-50/80 border-blue-200',
    },
    {
      role: 'driver',
      title: 'Acteur 3 : Livreurs & Transporteurs',
      subtitle: 'Motos express & Navettes urbaines',
      icon: Bike,
      colorClass: 'text-emerald-600',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      headerBg: 'bg-emerald-50/80 border-emerald-200',
    },
    {
      role: 'brand',
      title: 'Acteur 4 : Fournisseurs & Marques Gaz',
      subtitle: 'Tradex, TotalEnergies, Camgaz, Ola',
      icon: Building2,
      colorClass: 'text-amber-600',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      headerBg: 'bg-amber-50/80 border-amber-200',
    },
    {
      role: 'admin',
      title: 'Acteur 5 : Super Administrateur',
      subtitle: 'Direction générale pleinGas & Contrôle',
      icon: Shield,
      colorClass: 'text-purple-600',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      headerBg: 'bg-purple-50/80 border-purple-200',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => {
                  if (!currentUser && onNavigate) {
                    onNavigate('landing');
                  } else if (currentUser?.role === 'client' && onNavigate) {
                    onNavigate('map');
                  } else if (currentUser?.role === 'vendor' && onNavigate) {
                    onNavigate('vendor_dashboard');
                  } else if (currentUser?.role === 'driver' && onNavigate) {
                    onNavigate('driver_dashboard');
                  } else if (currentUser?.role === 'admin' && onNavigate) {
                    onNavigate('admin_dashboard');
                  } else if (currentUser?.role === 'brand' && onNavigate) {
                    onNavigate('brand_dashboard');
                  }
                }}
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
                    Gaz & Dépôts Agréés
                  </span>
                </div>
              </button>

              {/* City & Geolocation Picker Dropdown (Only for Clients) */}
              {currentUser?.role === 'client' && (
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
                          Villes principales
                        </span>
                        {CITY_PRESETS.map((city) => (
                          <button
                            key={city.name}
                            onClick={() => {
                              if (onSelectCity) onSelectCity(city);
                              setShowLocationMenu(false);
                            }}
                            className="w-full px-2.5 py-1.5 text-left text-xs rounded-xl hover:bg-slate-100 flex items-center justify-between transition-colors font-medium text-slate-700"
                          >
                            <span>{city.name}</span>
                            <span className="text-[10px] text-slate-400">{city.country}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {/* If Visitor (Not Logged In) */}
              {!currentUser && (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mr-2">
                    <span className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      Services de Gaz Domestique & Livraison Express
                    </span>
                  </div>
                </>
              )}

              {/* 1. Client Navigation Links */}
              {currentUser?.role === 'client' && (
                <>
                  <button
                    onClick={() => onNavigate && onNavigate('map')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeView === 'map'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    id="nav-map-tab"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Dépôts & Bouteilles</span>
                  </button>

                  <button
                    onClick={() => onNavigate && onNavigate('client_dashboard')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeView === 'client_dashboard'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    id="nav-orders-tab"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Mes Commandes & Suivi</span>
                  </button>
                </>
              )}

              {/* 2. Vendor Navigation Links */}
              {currentUser?.role === 'vendor' && (
                <>
                  <button
                    onClick={() => onNavigate && onNavigate('vendor_dashboard')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-blue-600 text-white shadow-xs"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Tableau de Bord Dépôt & Stocks</span>
                  </button>
                </>
              )}

              {/* 3. Driver Navigation Links */}
              {currentUser?.role === 'driver' && (
                <>
                  <button
                    onClick={() => onNavigate && onNavigate('driver_dashboard')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-600 text-white shadow-xs"
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Espace Livreur & Missions</span>
                  </button>
                </>
              )}

              {/* 4. Brand Navigation Links */}
              {currentUser?.role === 'brand' && (
                <>
                  <button
                    onClick={() => onNavigate && onNavigate('brand_dashboard')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-amber-600 text-white shadow-xs"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Portail Marque & Réseau Dépôts</span>
                  </button>
                </>
              )}

              {/* 5. Super Admin Navigation Links */}
              {currentUser?.role === 'admin' && (
                <>
                  <button
                    onClick={() => onNavigate && onNavigate('admin_dashboard')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-purple-600 text-white shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Super Admin & Régulation</span>
                  </button>
                </>
              )}

              {/* Simulator Hub Button (for connected actors) */}
              {currentUser && onOpenSimulatorModal && (
                <button
                  onClick={onOpenSimulatorModal}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                  id="nav-simulator-hub-btn"
                  title={`Visualiser l'espace ${currentRoleBadge.label}`}
                >
                  <Layers className="w-3.5 h-3.5 text-orange-600" />
                  <span>Espace {currentRoleBadge.label}</span>
                </button>
              )}
            </nav>

            {/* Right Actions: Visitor Auth Buttons OR Connected User Menu */}
            <div className="flex items-center gap-2">
              {/* Case 1: Visitor (Not Connected) */}
              {!currentUser && (
                <div className="flex items-center gap-2">
                  {onOpenAuthModal && (
                    <>
                      <button
                        onClick={() => onOpenAuthModal('LOGIN')}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
                        id="nav-visitor-login-btn"
                      >
                        <LogIn className="w-3.5 h-3.5 text-slate-600" />
                        <span>Se connecter</span>
                      </button>

                      <div className="relative group">
                        <button
                          onClick={() => onOpenAuthModal('REGISTER', 'client')}
                          className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                          id="nav-visitor-register-btn"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Créer un compte</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Case 2: Connected User */}
              {currentUser && (
                <>
                  {/* Cart Drawer Trigger (Only shown for Client role) */}
                  {currentUser.role === 'client' && onOpenCart && (
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
                  )}

                  {/* Role & Account Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRoleMenu(!showRoleMenu)}
                      className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${currentRoleBadge.bg}`}
                      id="user-role-switcher-btn"
                    >
                      <RoleIcon className="w-4 h-4 shrink-0" />
                      <div className="text-left hidden sm:block">
                        <span className="block leading-none truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                        <span className="text-[9px] opacity-80 uppercase tracking-wider font-extrabold">
                          {currentRoleBadge.label}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    {showRoleMenu && (
                      <div className="absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" /> Espace {currentRoleBadge.label}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Comptes rattachés à votre rôle ({currentRoleBadge.label}) :
                            </p>
                          </div>
                          {onOpenSimulatorModal && (
                            <button
                              onClick={() => {
                                setShowRoleMenu(false);
                                onOpenSimulatorModal();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center gap-1 border border-orange-200 transition-colors"
                            >
                              <span>Détails</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Distinct Section strictly for the Connected Actor Role */}
                        <div className="p-2 space-y-3 max-h-[380px] overflow-y-auto">
                          {roleGroups
                            .filter((group) => group.role === currentUser.role)
                            .map((group) => {
                              const GroupIcon = group.icon;
                              const usersInGroup = allUsers.filter((u) => u.role === group.role);

                              return (
                                <div
                                  key={group.role}
                                  className={`rounded-2xl border ${group.headerBg} overflow-hidden shadow-2xs transition-all`}
                                >
                                  {/* Unique Section Header */}
                                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-inherit">
                                    <div className="flex items-center gap-2">
                                      <GroupIcon className={`w-3.5 h-3.5 ${group.colorClass}`} />
                                      <span className="text-xs font-black text-slate-900">{group.title}</span>
                                    </div>
                                    <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                                      Acteur Connecté
                                    </span>
                                  </div>

                                  {/* Users inside this dedicated actor section */}
                                  <div className="p-1.5 space-y-1 bg-white/90">
                                    {usersInGroup.map((u) => {
                                      const isSelected = u.id === currentUser.id;

                                      return (
                                        <button
                                          key={u.id}
                                          onClick={() => handleRoleSelect(u)}
                                          className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-colors ${
                                            isSelected
                                              ? 'bg-slate-900 text-white shadow-xs'
                                              : 'hover:bg-slate-100 text-slate-800'
                                          }`}
                                        >
                                          <div
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                              isSelected ? 'bg-slate-800 text-white' : group.badgeClass
                                            }`}
                                          >
                                            <GroupIcon className="w-3.5 h-3.5" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold truncate">{u.name}</div>
                                            <div className="text-[10px] opacity-75 truncate">{u.email}</div>
                                          </div>
                                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        {/* Bottom CTAs: Switch / Register and Logout */}
                        <div className="p-2 border-t border-slate-100 bg-slate-50 space-y-1.5">
                          {onOpenAuthModal && (
                            <button
                              onClick={() => {
                                setShowRoleMenu(false);
                                onOpenAuthModal('REGISTER');
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-orange-200"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Changer d'acteur / Inscrire un autre rôle</span>
                            </button>
                          )}

                          {onLogout && (
                            <button
                              onClick={() => {
                                setShowRoleMenu(false);
                                onLogout();
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-red-200"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Se déconnecter (Retour Visiteur)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

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
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2.5 shadow-lg animate-in slide-in-from-top duration-200">
            {/* Visitor on mobile */}
            {!currentUser && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal('LOGIN');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Se connecter</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal('REGISTER', 'client');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Créer un compte Client</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal('REGISTER', 'vendor');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Créer un compte Distributeur</span>
                </button>
              </div>
            )}

            {/* Client on mobile */}
            {currentUser?.role === 'client' && (
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('map');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                    activeView === 'map' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Bouteilles</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('client_dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                    activeView === 'client_dashboard' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Commandes</span>
                </button>
              </div>
            )}

            {/* Connected actions */}
            {currentUser && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {onOpenSimulatorModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSimulatorModal();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-orange-600" />
                    <span>Espace {currentRoleBadge.label}</span>
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
