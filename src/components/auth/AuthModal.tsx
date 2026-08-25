import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  User as UserIcon,
  Store,
  Bike,
  Shield,
  Building2,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Flame,
  Truck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { User, UserRole, SalesPoint } from '../../types';
import { AppStorage } from '../../services/storage';
import { INITIAL_PRODUCTS } from '../../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserAuthenticated: (user: User, isNewRegistration?: boolean) => void;
  initialMode?: 'LOGIN' | 'REGISTER' | 'PRESETS';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserAuthenticated,
  initialMode = 'REGISTER',
  initialRole = 'client',
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'PRESETS'>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);

  // Sync mode and role when initial props change or modal re-opens
  React.useEffect(() => {
    if (isOpen) {
      if (initialMode) setMode(initialMode);
      if (initialRole) setRole(initialRole);
      setError(null);
    }
  }, [isOpen, initialMode, initialRole]);

  // Common Form states
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  // Vendor-specific registration states
  const [salesPointName, setSalesPointName] = useState('');
  const [salesPointCity, setSalesPointCity] = useState('Douala');
  const [salesPointQuarter, setSalesPointQuarter] = useState('Akwa');
  const [openingHours, setOpeningHours] = useState('07h30 - 20h00');

  // Driver-specific registration states
  const [vehicleType, setVehicleType] = useState('Moto Express');
  const [driverZone, setDriverZone] = useState('Douala Centre & Akwa');

  // Brand-specific registration states
  const [selectedBrandId, setSelectedBrandId] = useState('brand-1');
  const [brandRoleTitle, setBrandRoleTitle] = useState('Direction Commerciale');

  // Admin-specific registration states
  const [adminSecurityCode, setAdminSecurityCode] = useState('');

  const [error, setError] = useState<string | null>(null);

  const allUsers = AppStorage.getUsers();
  const brands = AppStorage.getBrands();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input = phoneOrEmail.trim().toLowerCase();
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === input ||
        u.phone.replace(/\s+/g, '') === input.replace(/\s+/g, '')
    );

    if (found) {
      AppStorage.setCurrentUser(found.id);
      AppStorage.logAction(
        'USER_LOGIN',
        found.name,
        `Connexion réussie en tant que ${found.role}`,
        'SUCCESS'
      );
      onUserAuthenticated(found, false);
      onClose();
    } else {
      setError(
        'Identifiant introuvable. Utilisez les comptes prédéfinis ou créez un nouveau compte.'
      );
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phoneOrEmail.trim()) {
      setError('Veuillez remplir votre nom et vos coordonnées.');
      return;
    }

    const newUserId = `user-${Date.now()}`;
    let userSalesPointId: string | undefined = undefined;
    let userBrandId: string | undefined = undefined;

    // 1. If Vendor: automatically provision a real Sales Point in storage
    if (role === 'vendor') {
      const spName = salesPointName.trim() || `Dépôt Gaz ${name.trim()}`;
      userSalesPointId = `sp-${Date.now()}`;

      const newSalesPoint: SalesPoint = {
        id: userSalesPointId,
        vendorUserId: newUserId,
        name: spName,
        legalName: `${spName} S.A.R.L`,
        address: `${salesPointQuarter.trim() || 'Akwa'}, ${salesPointCity}`,
        city: salesPointCity,
        neighborhood: salesPointQuarter.trim() || 'Akwa',
        coordinates: { lat: 4.0511 + (Math.random() - 0.5) * 0.02, lng: 9.7085 + (Math.random() - 0.5) * 0.02 },
        phone: phoneOrEmail.trim(),
        email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'depot'}@pleingas.cm`,
        openingHours: openingHours || '07h30 - 20h30',
        rating: 5.0,
        reviewCount: 1,
        isOpen: true,
        isVerified: true,
        offersDelivery: true,
        deliveryRadiusKm: 6.5,
        deliveryBaseFee: 1000,
        deliveryFeePerKm: 250,
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?w=600&auto=format&fit=crop&q=80',
        products: INITIAL_PRODUCTS.map((prod) => ({
          productId: prod.id,
          product: prod,
          stock: prod.weight === '12.5kg' ? 25 : prod.weight === '6kg' ? 15 : 6,
          price: prod.standardPrice,
          isAvailable: true,
          minStockAlert: 5,
        })),
      };

      const existingSalesPoints = AppStorage.getSalesPoints();
      AppStorage.saveSalesPoints([newSalesPoint, ...existingSalesPoints]);
    }

    // 2. If Brand: assign selected brand
    if (role === 'brand') {
      userBrandId = selectedBrandId;
    }

    // 3. Create the user
    const newUser: User = {
      id: newUserId,
      name: name.trim(),
      email: phoneOrEmail.includes('@')
        ? phoneOrEmail.trim()
        : `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'utilisateur'}@pleingas.cm`,
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail.trim() : '+237 690 00 00 00',
      role: role,
      defaultAddress: address.trim() || `${salesPointQuarter || 'Akwa'}, Douala, Cameroun`,
      salesPointId: userSalesPointId,
      brandId: userBrandId,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    };

    const updatedUsers = [...allUsers, newUser];
    AppStorage.saveUsers(updatedUsers);
    AppStorage.setCurrentUser(newUser.id);
    AppStorage.logAction(
      'USER_REGISTER',
      newUser.name,
      `Création de compte ${newUser.role} pour ${newUser.name}`,
      'SUCCESS'
    );

    onUserAuthenticated(newUser, true);
    onClose();
  };

  const handleSelectPreset = (user: User) => {
    AppStorage.setCurrentUser(user.id);
    AppStorage.logAction(
      'USER_SWITCH',
      user.name,
      `Bascule vers le profil démo ${user.name} (${user.role})`,
      'INFO'
    );
    onUserAuthenticated(user, false);
    onClose();
  };

  const roleMeta = [
    {
      role: 'client' as UserRole,
      title: 'Consommateur / Client',
      subtitle: 'Trouver & Commander du gaz',
      icon: UserIcon,
      accent: 'border-orange-500 bg-orange-50 text-orange-800',
    },
    {
      role: 'vendor' as UserRole,
      title: 'Point de Vente / Dépôt',
      subtitle: 'Gérer stocks & commandes',
      icon: Store,
      accent: 'border-blue-500 bg-blue-50 text-blue-800',
    },
    {
      role: 'driver' as UserRole,
      title: 'Livreur Partenaire',
      subtitle: 'Missions géolocalisées',
      icon: Bike,
      accent: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    },
    {
      role: 'brand' as UserRole,
      title: 'Fournisseur Marque',
      subtitle: 'Volumes & Réseau Dépôts',
      icon: Building2,
      accent: 'border-amber-500 bg-amber-50 text-amber-800',
    },
    {
      role: 'admin' as UserRole,
      title: 'Super Administrateur',
      subtitle: 'Gouvernance & Régulation',
      icon: Shield,
      accent: 'border-purple-500 bg-purple-50 text-purple-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-orange-400">
                pleinGas Authentification
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                {mode === 'REGISTER'
                  ? 'Créer mon compte acteur'
                  : mode === 'LOGIN'
                  ? 'Connexion sécurisée'
                  : 'Changer de profil démo'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-extrabold shrink-0">
          <button
            onClick={() => {
              setMode('REGISTER');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'REGISTER'
                ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Inscription Acteur
          </button>
          <button
            onClick={() => {
              setMode('LOGIN');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'LOGIN'
                ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Connexion
          </button>
          <button
            onClick={() => {
              setMode('PRESETS');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'PRESETS'
                ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Profils Démo
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* MODE: REGISTER */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              {/* Actor Role Picker */}
              <div>
                <label className="font-extrabold text-slate-800 block mb-2">
                  Choisissez votre rôle d'acteur dans le système :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {roleMeta.map((item) => {
                    const Icon = item.icon;
                    const isSelected = role === item.role;

                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setRole(item.role)}
                        className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all ${
                          isSelected
                            ? `${item.accent} shadow-xs ring-2 ring-orange-500/20 font-black`
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className="w-4 h-4" />
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-[11px] leading-tight">{item.title}</div>
                          <div className="text-[9px] opacity-75">{item.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Informative Scope Banner */}
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200/90 text-slate-700 text-[11px] leading-relaxed">
                {role === 'client' && (
                  <p>
                    🛒 <strong>Espace Client Particulier :</strong> Vous accéderez à la carte géolocalisée, aux stocks en direct des dépôts autour de vous, à la commande avec livraison à domicile et au suivi GPS.
                  </p>
                )}
                {role === 'vendor' && (
                  <p>
                    🏪 <strong>Espace Point de Vente & Dépôt :</strong> Vous disposerez d'un tableau de bord pour mettre à jour vos stocks de bouteilles, ajuster vos prix, valider les commandes entrantes et suivre votre chiffre d'affaires.
                  </p>
                )}
                {role === 'driver' && (
                  <p>
                    🛵 <strong>Espace Livreur Partenaire :</strong> Vous accéderez au tableau des missions de livraison disponibles, au guidage d'itinéraire et à la validation des livraisons par code OTP.
                  </p>
                )}
                {role === 'brand' && (
                  <p>
                    🏢 <strong>Espace Fournisseur Marque :</strong> Vous suivrez les volumes de gaz distribués par format de bouteille et la disponibilité de votre marque sur l'ensemble du réseau de dépôts.
                  </p>
                )}
                {role === 'admin' && (
                  <p>
                    🛡️ <strong>Espace Super Administrateur :</strong> Vous piloterez la conformité des dépôts de gaz, l'agrément des points de vente, la régulation des prix et l'audit de sécurité système.
                  </p>
                )}
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {role === 'vendor'
                      ? 'Nom du gérant / responsable :'
                      : role === 'brand'
                      ? 'Nom du représentant :'
                      : 'Nom complet :'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean Mbianda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Numéro de téléphone / WhatsApp :
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 6XX XX XX XX"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}

              {/* 1. Client Specific */}
              {role === 'client' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adresse ou Quartier de livraison habituel :</label>
                  <input
                    type="text"
                    placeholder="Ex: Akwa, Rue Sylvani, Douala"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 focus:bg-white focus:outline-hidden"
                  />
                </div>
              )}

              {/* 2. Vendor Specific */}
              {role === 'vendor' && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                  <div className="font-black text-blue-900 text-xs flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-blue-700" />
                    <span>Configuration de votre Point de Vente / Dépôt :</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nom du Dépôt / Station-service :</label>
                    <input
                      type="text"
                      placeholder="Ex: Dépôt Gaz Express Bonamoussadi"
                      value={salesPointName}
                      onChange={(e) => setSalesPointName(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-blue-200 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Quartier / Emplacement :</label>
                      <input
                        type="text"
                        placeholder="Ex: Bonamoussadi"
                        value={salesPointQuarter}
                        onChange={(e) => setSalesPointQuarter(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-blue-200 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Horaires d'ouverture :</label>
                      <input
                        type="text"
                        placeholder="07h30 - 21h00"
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-blue-200 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Driver Specific */}
              {role === 'driver' && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="font-black text-emerald-900 text-xs flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-emerald-700" />
                    <span>Configuration Livreur Partenaire :</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Type de transport :</label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-emerald-200 font-bold"
                      >
                        <option value="Moto Express">Moto Express (1-2 Bouteilles)</option>
                        <option value="Tricycle Cargo">Tricycle Cargo (Jusqu'à 10 Bouteilles)</option>
                        <option value="Fourgonnette">Fourgonnette Urbaine (Grand volume)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Zone de livraison :</label>
                      <input
                        type="text"
                        placeholder="Ex: Akwa, Bonanjo, Deido"
                        value={driverZone}
                        onChange={(e) => setDriverZone(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-emerald-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Brand Specific */}
              {role === 'brand' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <div className="font-black text-amber-900 text-xs flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span>Marque de Gaz représentée :</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sélectionnez la marque :</label>
                    <select
                      value={selectedBrandId}
                      onChange={(e) => setSelectedBrandId(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-amber-200 font-bold"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.headquarters})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 5. Admin Specific */}
              {role === 'admin' && (
                <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                  <div className="font-black text-purple-900 text-xs flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-700" />
                    <span>Habilitation Super Administrateur :</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    L'inscription Super Administrateur vous confère les droits d'homologation des dépôts et de régulation des prix de l'énergie.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all mt-2"
                id="submit-register-actor-btn"
              >
                <span>Créer mon compte et ouvrir mon espace {role.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE: LOGIN */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Téléphone ou Adresse Email :
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: +237 699 00 11 22 ou jean.mbianda@gmail.com"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full p-3 pl-10 bg-slate-100 rounded-xl text-xs border border-slate-200 focus:bg-white focus:outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mot de passe :</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pl-10 bg-slate-100 rounded-xl text-xs border border-slate-200 focus:bg-white focus:outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
              >
                <span>Accéder à mon espace dédié</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE: PRESET ROLES FOR EASY TESTING */}
          {mode === 'PRESETS' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Sélectionnez un acteur pour basculer instantanément dans son espace propre :
              </p>

              {allUsers.map((user) => {
                const isSelected = currentUser.id === user.id;

                const roleIcons = {
                  client: <UserIcon className="w-4 h-4 text-orange-600" />,
                  vendor: <Store className="w-4 h-4 text-blue-600" />,
                  driver: <Bike className="w-4 h-4 text-emerald-600" />,
                  admin: <Shield className="w-4 h-4 text-purple-600" />,
                  brand: <Building2 className="w-4 h-4 text-amber-600" />,
                };

                const roleLabels = {
                  client: 'Acteur Client (Recherche & Commande)',
                  vendor: 'Acteur Point de Vente (Stocks & Commandes)',
                  driver: 'Acteur Livreur (Missions de livraison)',
                  admin: 'Acteur Super Admin (Gouvernance & Agréments)',
                  brand: 'Acteur Marque (Volumes & Dépôts)',
                };

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectPreset(user)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {roleIcons[user.role]}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500">{roleLabels[user.role]}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-1 bg-orange-600 text-white text-[10px] font-bold rounded-lg shrink-0">
                        Actif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
