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
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { AppStorage } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserAuthenticated: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserAuthenticated,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'PRESETS'>('LOGIN');
  const [role, setRole] = useState<UserRole>('client');

  // Form states
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const allUsers = AppStorage.getUsers();

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
      onUserAuthenticated(found);
      onClose();
    } else {
      setError(
        'Identifiant introuvable. Utilisez les comptes de démonstration ou créez un nouveau compte.'
      );
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneOrEmail.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: phoneOrEmail.includes('@') ? phoneOrEmail.trim() : `${name.toLowerCase().replace(/\s+/g, '')}@pleingas.cm`,
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail.trim() : '+237 690 00 00 00',
      role: role,
      defaultAddress: address.trim() || 'Douala, Cameroun',
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

    onUserAuthenticated(newUser);
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
    onUserAuthenticated(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-orange-400">
                pleinGas Authentification
              </span>
              <h2 className="text-base font-extrabold text-white">
                {mode === 'LOGIN'
                  ? 'Connexion sécurisée'
                  : mode === 'REGISTER'
                  ? 'Créer un compte'
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
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-extrabold">
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
            Connexion
          </button>
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
            Inscription
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
            Profils Démo (Rôles)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
              {error}
            </div>
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
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('PRESETS')}
                  className="text-xs text-orange-600 font-bold hover:underline"
                >
                  Ou tester instantanément avec les 5 profils prédéfinis →
                </button>
              </div>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Je m'inscris en tant que :</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      role === 'client'
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Client Final
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      role === 'vendor'
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Point de Vente
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      role === 'driver'
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Livreur
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom complet ou Raison sociale :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Paul Atangana / Dépôt Gaz Deido"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Numéro de téléphone :</label>
                <input
                  type="tel"
                  required
                  placeholder="+237 6XX XX XX XX"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Adresse ou Quartier habituel :</label>
                <input
                  type="text"
                  placeholder="Ex: Bonapriso, Douala"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-extrabold shadow-md shadow-orange-600/20 mt-2"
              >
                Créer mon compte pleinGas
              </button>
            </form>
          )}

          {/* MODE: PRESET ROLES FOR EASY TESTING */}
          {mode === 'PRESETS' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-2">
                Sélectionnez un acteur pour vous connecter instantanément et explorer son interface dédiée :
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
                  client: 'Client Final (Recherche & Commande)',
                  vendor: 'Gérant Point de Vente (Stocks & Commandes)',
                  driver: 'Livreur Partenaire (Missions de livraison)',
                  admin: 'Super Administrateur (Gouvernance & Agréments)',
                  brand: 'Fournisseur Marque (Volumes & Dépôts)',
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
