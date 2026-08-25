import React, { useState } from 'react';
import {
  Flame,
  Store,
  User as UserIcon,
  Truck,
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
  PhoneCall,
  Sparkles,
  Search,
  Layers,
  ChevronRight,
  CreditCard,
  KeyRound,
  Navigation,
  Star,
  Users,
  Award,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER' | 'PRESETS', role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'client' | 'vendor' | 'driver' | 'brand'>('client');

  const officialPrices = [
    {
      format: '6 kg',
      name: 'Format Compact / Studio',
      price: '3 000 FCFA',
      refill: '2 800 - 3 200 FCFA',
      deposit: '12 000 FCFA',
      usage: 'Étudiants, petits ménages, réchauds d’appoint',
      badge: 'Pratique',
      color: 'border-blue-200 bg-blue-50/60 text-blue-800',
    },
    {
      format: '12.5 kg',
      name: 'Format Familial Standard',
      price: '6 500 FCFA',
      refill: '6 500 FCFA (Prix officiel)',
      deposit: '18 000 - 22 000 FCFA',
      usage: 'Ménages de 3 à 6 personnes, autonomie 3 à 5 semaines',
      badge: 'Le plus populaire',
      color: 'border-orange-300 bg-orange-50/70 text-orange-900 ring-2 ring-orange-500/20',
      isPopular: true,
    },
    {
      format: '50 kg',
      name: 'Format Professionnel & Grand Débit',
      price: '26 500 FCFA',
      refill: '25 000 - 28 000 FCFA',
      deposit: '45 000 FCFA',
      usage: 'Restaurants, boulangeries, hôtels, traiteurs',
      badge: 'Professionnel',
      color: 'border-amber-200 bg-amber-50/60 text-amber-800',
    },
  ];

  const brandsList = [
    { name: 'Tradex', color: 'bg-red-600', text: 'text-white' },
    { name: 'TotalEnergies', color: 'bg-red-500', text: 'text-white' },
    { name: 'Camgaz', color: 'bg-blue-700', text: 'text-white' },
    { name: 'Ola Energy', color: 'bg-blue-600', text: 'text-white' },
    { name: 'SCTM Gaz', color: 'bg-emerald-600', text: 'text-white' },
    { name: 'GlocalGaz', color: 'bg-amber-600', text: 'text-white' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Glow & background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Tag badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-black uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Plateforme Officielle de Gaz Domestique & Dépôts Agréés</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
              Commandez votre gaz domestique{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                en toute simplicité
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Localisez les stocks réels de bouteilles autour de vous, commandez au prix officiel garanti, et faites-vous livrer express à domicile ou retirez directement au dépôt agréé.
            </p>
          </div>

          {/* Core Action Callouts (Client vs Distributeur) */}
          <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action 1: Client */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:border-orange-400/60 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-300 bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-500/30">
                    Pour les Ménages
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-orange-300 transition-colors">
                  Vous êtes un Consommateur ?
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Recherchez vos marques (Tradex, Total, Camgaz...), commandez votre recharge et suivez votre livraison en direct.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => onOpenAuth('REGISTER', 'client')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Créer un compte Client</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
                <button
                  onClick={() => onOpenAuth('LOGIN', 'client')}
                  className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <span>Connexion Client</span>
                </button>
              </div>
            </div>

            {/* Action 2: Distributeur */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:border-blue-400/60 transition-all flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-500/30">
                    Pour les Professionnels
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                  Vous êtes un Distributeur de Gaz ?
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Digitalisez votre dépôt, gérez vos bouteilles en stock, recevez les commandes locales et augmentez vos ventes.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => onOpenAuth('REGISTER', 'vendor')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <Store className="w-4 h-4" />
                  <span>Créer un compte Distributeur</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
                <button
                  onClick={() => onOpenAuth('LOGIN', 'vendor')}
                  className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <span>Accès Espace Dépôt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-orange-400">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Prix Officiels Homologués</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">&lt; 40 min</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Livraison Moyenne à Domicile</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">OTP Sécurisé</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Validation Anti-Fraude</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">6+ Marques</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Tradex, Total, Camgaz, etc.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Services Showcase (Detailed Tabs) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>Nos Espaces Métiers Dédiés</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Une solution sur-mesure pour chaque acteur
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            pleinGas connecte les consommateurs, les dépôts agréés, les livreurs et les marques dans un écosystème fluide et sécurisé.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-wrap gap-1 max-w-full justify-center">
            <button
              onClick={() => setActiveTab('client')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'client'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300/60'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Espace Client / Consommateur</span>
            </button>

            <button
              onClick={() => setActiveTab('vendor')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'vendor'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300/60'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Espace Distributeur / Dépôt</span>
            </button>

            <button
              onClick={() => setActiveTab('driver')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'driver'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300/60'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Espace Livreur Partenaire</span>
            </button>

            <button
              onClick={() => setActiveTab('brand')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === 'brand'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-300/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Fournisseurs & Marques</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Client Service Details */}
        {activeTab === 'client' && (
          <div className="bg-white rounded-3xl border border-orange-200 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-black">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>Pour les Particuliers, Familles & Cuisiniers</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Commandez votre recharge de gaz en moins de 2 minutes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ne tombez plus jamais en panne de gaz au milieu d’un repas. pleinGas vous permet d’identifier en direct les dépôts ouverts dans votre quartier ayant du stock pour votre marque de bouteille.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Carte & Stocks en Direct</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Visibilité sur les dépôts de votre quartier et quantités disponibles.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Prix Homologués Garantis</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">6.500 FCFA pour 12.5kg. Aucune spéculation ni surfacturation.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Livraison ou Retrait</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Livraison moto/tricycle à votre porte ou retrait express au guichet.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Code OTP Sécurisé</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Vous communiquez votre code au livreur uniquement après vérification.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenAuth('REGISTER', 'client')}
                  className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>S'inscrire comme Client</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('LOGIN', 'client')}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  <span>Déjà inscrit ? Me connecter</span>
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg border border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Aperçu Interface Client</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                    Actif 24/7
                  </span>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-orange-400">TotalGaz 12.5kg (Recharge)</span>
                    <span className="font-black text-white">6 500 FCFA</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Store className="w-3 h-3 text-slate-400" />
                    <span>Dépôt Akwa Centre • 350m</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-300 text-[10px] font-bold">
                      24 en stock
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 text-[10px] font-bold">
                      Livraison ~25 min
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px] font-medium">Votre adresse de livraison :</div>
                  <div className="font-bold text-slate-200">Rue Joss, Akwa - Douala</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bouteilles certifiées conformes et testées étanchéité.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vendor / Distributeur Service Details */}
        {activeTab === 'vendor' && (
          <div className="bg-white rounded-3xl border border-blue-200 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-black">
                <Store className="w-4 h-4 text-blue-600" />
                <span>Pour les Dépôts de Gaz, Stations-Services & Revendeurs</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Digitalisez votre point de vente et multipliez vos commandes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fini les carnets papier et les appels manqués. Gérez en temps réel vos stocks de bouteilles pleines et consignes, recevez les commandes des résidents de votre zone et confiez les courses à notre réseau de livreurs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Gestion Stock en Direct</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Ajustement instantané des stocks par marque et alerte seuil critique.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Visibilité Quartier</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Apparaissez en tête de liste sur la carte auprès de milliers de clients.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Dispatch Livreur Intégré</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Affectez automatiquement les commandes aux livreurs moto disponibles.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Rapports Financiers & CA</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Suivi des ventes quotidiennes, marges nettes et historique comptable.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenAuth('REGISTER', 'vendor')}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Store className="w-4 h-4" />
                  <span>Inscrire mon Point de Vente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('LOGIN', 'vendor')}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  <span>Connexion Espace Dépôt</span>
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg border border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Tableau de Bord Distributeur</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black">
                    Point Agréé
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Ventes du jour</div>
                    <div className="text-base font-black text-white mt-1">182 500 F</div>
                    <div className="text-[10px] text-emerald-400">+14% vs hier</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Bouteilles dispo</div>
                    <div className="text-base font-black text-white mt-1">68 / 80</div>
                    <div className="text-[10px] text-blue-400">Stock optimal</div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">Dernière Commande #PG-882</span>
                    <span className="text-[10px] text-slate-400">Il y a 3 min</span>
                  </div>
                  <div className="text-xs text-slate-200">2x Tradex 12.5kg • Livraison Bonapriso</div>
                  <div className="text-[10px] text-emerald-400 font-extrabold">Assignée au livreur Momo (Moto Express)</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Validation instantanée de votre point de vente en moins de 24h.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Driver Service Details */}
        {activeTab === 'driver' && (
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Pour les Livreurs Moto, Tricycles & Transporteurs</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Augmentez vos revenus avec des courses de proximité
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Recevez des missions de livraison de bouteilles de gaz directement sur votre smartphone. Optimisez vos trajets dans votre quartier de rattachement et touchez vos commissions immédiatement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Courses Géolocalisées</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Trajets courts entre les dépôts et les ménages de votre quartier.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Rémunération Juste</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Tarif de livraison transparent et pourboires 100% conservés.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenAuth('REGISTER', 'driver')}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Truck className="w-4 h-4" />
                  <span>Devenir Livreur Partenaire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('LOGIN', 'driver')}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  <span>Connexion Livreur</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg border border-slate-800">
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
                  Aperçu Cockpit Livreur
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-emerald-400">Nouvelle Mission de Livraison</div>
                  <div className="text-[11px] text-slate-300">Dépôt Tradex Deido → Résidence Bonamoussadi</div>
                  <div className="text-xs font-extrabold text-white">Rémunération : 1 250 FCFA</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Brand Service Details */}
        {activeTab === 'brand' && (
          <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-black">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Pour les Marques & Distributeurs Officiels (Tradex, Total, Camgaz...)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Supervision de réseau et traçabilité des volumes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Suivez en temps réel la distribution de vos bouteilles dans les différents dépôts affiliés, analysez la demande par ville et assurez le respect de vos standards de marque.
              </p>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenAuth('REGISTER', 'brand')}
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Espace Marque / Producteur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('LOGIN', 'brand')}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  <span>Connexion Marque</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Official Price Grid & Catalog */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-100/80 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Transparence Tarifaire
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Grille des Prix Officiels Homologués
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Sur pleinGas, tous les dépôts affiliés s’engagent à respecter strictement les tarifs réglementés de recharge et de consigne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officialPrices.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 border transition-all flex flex-col justify-between bg-white shadow-sm ${item.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-white/90 border border-slate-200">
                      {item.format}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{item.badge}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.usage}</p>

                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Recharge gaz seul :</span>
                      <span className="text-sm font-black text-slate-900">{item.refill}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Consigne Bouteille :</span>
                      <span className="text-xs font-bold text-slate-700">{item.deposit}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  <button
                    onClick={() => onOpenAuth('REGISTER', 'client')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Commander ce format</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Brands ticker */}
          <div className="mt-12 pt-8 border-t border-slate-200/80">
            <div className="text-center text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-5">
              Marques Agréées Disponibles sur la Plateforme
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {brandsList.map((b, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-xl text-xs font-black ${b.color} ${b.text} shadow-xs`}
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works: 4 Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Simplicité & Rapidité
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Comment fonctionne pleinGas ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            4 étapes simples pour être approvisionné en toute sérénité.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white font-black text-sm flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-sm font-black text-slate-900">1. Localisez le Dépôt</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Consultez les points de vente à proximité et vérifiez la disponibilité de votre marque en temps réel.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white font-black text-sm flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-sm font-black text-slate-900">2. Choisissez votre Produit</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Sélectionnez une recharge simple ou un pack complet (bouteille + gaz + accessoires).
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white font-black text-sm flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-sm font-black text-slate-900">3. Validez la Commande</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Optez pour la livraison express à domicile ou le retrait direct au guichet du dépôt.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="text-sm font-black text-slate-900">4. Réceptionnez avec OTP</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Vérifiez la bouteille à l’arrivée et communiquez votre code de validation au livreur.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Compliance Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Engagement Qualité & Sécurité Gaz</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Bouteilles 100% scellées et contrôlées à chaque livraison
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Toutes les bouteilles distribuées via pleinGas disposent d'un opercule de sécurité certifié par les marques officielles. Aucun risque de fuite ou de falsification.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAuth('REGISTER', 'client')}
              className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs shadow-lg transition-all"
            >
              Créer un Compte
            </button>
            <button
              onClick={() => onOpenAuth('LOGIN')}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              Se Connecter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-black text-white text-sm">pleinGas</span>
            <span className="text-slate-500 text-[11px]">— Distribution de gaz géolocalisée</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenAuth('REGISTER', 'client')}
              className="hover:text-white transition-colors"
            >
              Espace Client
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenAuth('REGISTER', 'vendor')}
              className="hover:text-white transition-colors"
            >
              Espace Distributeur
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenAuth('PRESETS')}
              className="hover:text-orange-400 transition-colors font-bold"
            >
              Comptes Démo
            </button>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} pleinGas. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};
