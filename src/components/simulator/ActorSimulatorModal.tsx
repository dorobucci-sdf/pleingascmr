import React, { useState } from 'react';
import {
  User as UserIcon,
  Store,
  Bike,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  Flame,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { User, UserRole, SalesPoint, Brand } from '../../types';

interface ActorSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  salesPoints: SalesPoint[];
  brands: Brand[];
  onSelectUser: (user: User) => void;
  onOpenAuthModal?: () => void;
}

interface ActorCategoryMeta {
  role: UserRole;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  themeColor: {
    bg: string;
    text: string;
    border: string;
    accent: string;
    pillBg: string;
    activeBorder: string;
  };
  description: string;
  keyFeatures: string[];
}

const ACTOR_CATEGORIES: ActorCategoryMeta[] = [
  {
    role: 'client',
    title: 'Acteur 1 : Consommateurs & Clients Particuliers',
    subtitle: 'Ménages, Familles, Restaurants & Professionnels',
    badge: 'Espace Client',
    icon: UserIcon,
    themeColor: {
      bg: 'bg-orange-50/70',
      text: 'text-orange-950',
      border: 'border-orange-200/90',
      accent: 'bg-orange-500 text-white',
      pillBg: 'bg-orange-100 text-orange-800 border-orange-200',
      activeBorder: 'border-orange-500 ring-2 ring-orange-500/20',
    },
    description:
      'Recherche géolocalisée des dépôts les plus proches, consultation des stocks en direct (6kg, 12.5kg, 50kg), comparaison des prix officiels, commande en livraison à domicile ou retrait, paiement mobile (Orange Money / MTN MoMo / Espèces) et suivi de livraison en direct.',
    keyFeatures: [
      'Carte interactive & calcul de distance en temps réel',
      'Filtrage par marque de gaz et format de bouteille',
      'Passage de commande avec panier multi-bouteilles',
      'Suivi chronologique et dépôt d’avis noté',
    ],
  },
  {
    role: 'vendor',
    title: 'Acteur 2 : Points de Vente & Gérants de Dépôts',
    subtitle: 'Stations-services, Dépôts de quartier, Distributeurs agréés',
    badge: 'Espace Gérant Dépôt',
    icon: Store,
    themeColor: {
      bg: 'bg-blue-50/70',
      text: 'text-blue-950',
      border: 'border-blue-200/90',
      accent: 'bg-blue-600 text-white',
      pillBg: 'bg-blue-100 text-blue-800 border-blue-200',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
    },
    description:
      'Gestion complète de l’inventaire des bouteilles de gaz, mise à jour des disponibilités et alertes de stock faible, ajustement des tarifs au kilo, réception des commandes en temps réel, assignation aux livreurs et validation des retraits comptoir.',
    keyFeatures: [
      'Mise à jour instantanée des stocks de bouteilles (+ / -)',
      'Réception et acceptation des nouvelles commandes',
      'Horaires, rayon de livraison et statut ouvert / fermé',
      'Calcul du chiffre d’affaires et commissions reversées',
    ],
  },
  {
    role: 'driver',
    title: 'Acteur 3 : Livreurs & Transporteurs Géolocalisés',
    subtitle: 'Coursiers moto, Tricycles spécialisés et Navettes urbaines',
    badge: 'Espace Livreur',
    icon: Bike,
    themeColor: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-950',
      border: 'border-emerald-200/90',
      accent: 'bg-emerald-600 text-white',
      pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
    },
    description:
      'Réception des missions de livraison de bouteilles de gaz disponibles, itinéraire GPS optimisé entre le dépôt et l’adresse du client, confirmation de prise en charge au dépôt et validation de fin de course sécurisée par code de confirmation client.',
    keyFeatures: [
      'Flux des courses prêtes à être livrées',
      'Guidage GPS avec itinéraire et coordonnées client',
      'Validation de la livraison et encaissement',
      'Suivi des gains et pourboires cumulés',
    ],
  },
  {
    role: 'brand',
    title: 'Acteur 4 : Fournisseurs & Marques de Gaz',
    subtitle: 'Tradex S.A., TotalEnergies, Ola Energy, Camgaz, SCTM, etc.',
    badge: 'Espace Marque Partenaire',
    icon: Building2,
    themeColor: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-950',
      border: 'border-amber-200/90',
      accent: 'bg-amber-600 text-white',
      pillBg: 'bg-amber-100 text-amber-800 border-amber-200',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
    },
    description:
      'Portail analytique dédié aux directions de marques et raffineries pour suivre les volumes de gaz distribués sur le territoire, surveiller l’état des stocks dans l’ensemble des points de vente partenaires et identifier les zones de tension d’approvisionnement.',
    keyFeatures: [
      'Visualisation des volumes globaux distribués par format',
      'Cartographie des dépôts partenaires stockant la marque',
      'Alertes de rupture de stock sur le réseau de distribution',
      'Statistiques de performance et parts de marché locales',
    ],
  },
  {
    role: 'admin',
    title: 'Acteur 5 : Super Administrateur & Régulateur',
    subtitle: 'Direction générale pleinGas & Supervision des hydrocarbures',
    badge: 'Superviseur & Gouvernance',
    icon: ShieldCheck,
    themeColor: {
      bg: 'bg-purple-50/70',
      text: 'text-purple-950',
      border: 'border-purple-200/90',
      accent: 'bg-purple-600 text-white',
      pillBg: 'bg-purple-100 text-purple-800 border-purple-200',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/20',
    },
    description:
      'Gouvernance globale de la plateforme, homologation et vérification de la conformité des nouveaux points de vente de gaz, contrôle du respect des prix plafonds réglementés par l’État, configuration du taux de commission et journalisation des logs système.',
    keyFeatures: [
      'Agrément et validation des dépôts de gaz candidats',
      'Suivi financier des commissions de la plateforme (10%)',
      'Gestion des utilisateurs, des marques et du catalogue',
      'Audit de sécurité et journal des transactions système',
    ],
  },
];

export const ActorSimulatorModal: React.FC<ActorSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  salesPoints,
  brands,
  onSelectUser,
  onOpenAuthModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // STRICT ISOLATION: Only the current actor's category is visible
  const currentCategory = ACTOR_CATEGORIES.find((cat) => cat.role === currentUser.role) || ACTOR_CATEGORIES[0];
  const Icon = currentCategory.icon;

  // Filter users strictly belonging to the current connected actor's role
  const categoryUsers = allUsers.filter(
    (u) =>
      u.role === currentUser.role &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSalesPointName = (spId?: string) => {
    if (!spId) return null;
    const sp = salesPoints.find((p) => p.id === spId);
    return sp ? sp.name : null;
  };

  const getBrandName = (brandId?: string) => {
    if (!brandId) return null;
    const b = brands.find((brand) => brand.id === brandId);
    return b ? b.name : null;
  };

  const handleSelectActor = (user: User) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 sm:px-8 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl ${currentCategory.themeColor.accent} flex items-center justify-center shadow-inner`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Espace & Profils {currentCategory.badge}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${currentCategory.themeColor.pillBg}`}>
                  Acteur Actif
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Visualisation et gestion des profils rattachés à votre rôle ({currentCategory.title}).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Actor Banner with Isolation Notice */}
        <div className="px-5 sm:px-8 py-3 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <span className="font-bold text-slate-500">Compte en session :</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white font-extrabold text-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentUser.name}
            </span>
            <span className="text-slate-500 font-medium">({currentUser.email})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Isolation active (Autres acteurs masqués)
            </span>
          </div>
        </div>

        {/* Scrollable Content Area: Strictly shows ONLY the current actor */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
          <section
            id={`actor-section-${currentCategory.role}`}
            className={`rounded-3xl border ${currentCategory.themeColor.border} bg-white shadow-xs overflow-hidden`}
          >
            {/* Dedicated Section Header */}
            <div
              className={`px-5 sm:px-7 py-4 ${currentCategory.themeColor.bg} border-b ${currentCategory.themeColor.border} flex flex-wrap items-center justify-between gap-3`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl ${currentCategory.themeColor.accent} flex items-center justify-center shadow-sm shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base sm:text-lg font-black tracking-tight ${currentCategory.themeColor.text}`}>
                      {currentCategory.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${currentCategory.themeColor.pillBg}`}>
                      {currentCategory.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {currentCategory.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Section Body: Scope & Profiles */}
            <div className="p-5 sm:p-7 space-y-5">
              {/* Actor Functional Scope Description & Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-4 border-b border-slate-100">
                <div className="lg:col-span-6 space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Périmètre & Habilitations de votre rôle
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentCategory.description}
                  </p>
                </div>

                <div className="lg:col-span-6 space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Fonctionnalités Disponibles
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {currentCategory.keyFeatures.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 text-slate-600 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* List of Simulated User Accounts for this Specific Actor */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Comptes disponibles pour ce rôle ({categoryUsers.length})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Basculez entre vos profils métier
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    const spName = getSalesPointName(user.salesPointId);
                    const bName = getBrandName(user.brandId);

                    return (
                      <div
                        key={user.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? `bg-slate-900 text-white border-slate-800 shadow-md ${currentCategory.themeColor.activeBorder}`
                            : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black truncate">{user.name}</span>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase">
                                  En cours
                                </span>
                              )}
                            </div>

                            <div
                              className={`text-xs flex items-center gap-2 ${
                                isSelected ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              <Mail className="w-3.5 h-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{user.email}</span>
                            </div>

                            {user.phone && (
                              <div
                                className={`text-xs flex items-center gap-2 ${
                                  isSelected ? 'text-slate-300' : 'text-slate-500'
                                }`}
                              >
                                <Phone className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                <span>{user.phone}</span>
                              </div>
                            )}

                            {spName && (
                              <div
                                className={`text-xs flex items-center gap-1.5 mt-1 font-semibold ${
                                  isSelected ? 'text-blue-300' : 'text-blue-700'
                                }`}
                              >
                                <Store className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Point de vente : {spName}</span>
                              </div>
                            )}

                            {bName && (
                              <div
                                className={`text-xs flex items-center gap-1.5 mt-1 font-semibold ${
                                  isSelected ? 'text-amber-300' : 'text-amber-700'
                                }`}
                              >
                                <Building2 className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Marque : {bName}</span>
                              </div>
                            )}

                            {user.defaultAddress && (
                              <div
                                className={`text-xs flex items-center gap-1.5 mt-1 ${
                                  isSelected ? 'text-slate-300' : 'text-slate-500'
                                }`}
                              >
                                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                <span className="truncate">{user.defaultAddress}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectActor(user)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                              : `${currentCategory.themeColor.accent} hover:opacity-95 shadow-xs`
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Profil actuel</span>
                            </>
                          ) : (
                            <>
                              <span>Utiliser ce profil ({user.name.split(' ')[0]})</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenAuthModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-all border border-orange-200"
              >
                Changer d'acteur / Inscrire un autre rôle
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
