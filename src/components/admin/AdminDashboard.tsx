import React, { useState } from 'react';
import {
  Shield,
  Store,
  Users,
  Building2,
  DollarSign,
  CheckCircle2,
  XCircle,
  FileText,
  Percent,
  TrendingUp,
  Flame,
  AlertTriangle,
  MapPin,
  Check,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { SalesPoint, Brand, Product, Order, User, SystemLog } from '../../types';
import { AppStorage } from '../../services/storage';

interface AdminDashboardProps {
  currentUser: User;
  salesPoints: SalesPoint[];
  brands: Brand[];
  products: Product[];
  orders: Order[];
  users: User[];
  logs: SystemLog[];
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  salesPoints,
  brands,
  products,
  orders,
  users,
  logs,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sales_points' | 'brands' | 'logs' | 'commission'>('overview');
  const [commissionRate, setCommissionRate] = useState<number>(AppStorage.getCommissionRate());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // New Brand modal state
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#E53E3E');
  const [newBrandHq, setNewBrandHq] = useState('Douala, Cameroun');
  const [newBrandPhone, setNewBrandPhone] = useState('+237 233 00 00 00');

  const totalVolumeKg = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => {
      return (
        sum +
        o.items.reduce((s, i) => {
          const weightNum = parseFloat(i.weight) || 12.5;
          return s + weightNum * i.quantity;
        }, 0)
      );
    }, 0);

  const totalTurnover = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.subtotal, 0);

  const platformRevenue = Math.round((totalTurnover * commissionRate) / 100);

  const pendingSalesPoints = salesPoints.filter((sp) => !sp.isVerified);
  const verifiedSalesPoints = salesPoints.filter((sp) => sp.isVerified);

  const handleVerifySalesPoint = (spId: string, verify: boolean) => {
    const allSp = AppStorage.getSalesPoints();
    const idx = allSp.findIndex((s) => s.id === spId);
    if (idx === -1) return;

    allSp[idx].isVerified = verify;
    AppStorage.saveSalesPoints(allSp);

    AppStorage.logAction(
      verify ? 'SALES_POINT_VALIDATED' : 'SALES_POINT_SUSPENDED',
      currentUser.name,
      `Point de vente "${allSp[idx].name}" ${verify ? 'validé et rendu public' : 'suspendu'}.`,
      verify ? 'SUCCESS' : 'WARN'
    );

    onDataChanged();
    setAlertMessage(`Point de vente ${verify ? 'validé avec succès' : 'suspendu'}.`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSaveCommission = () => {
    AppStorage.saveCommissionRate(commissionRate);
    AppStorage.logAction(
      'COMMISSION_RATE_CHANGE',
      currentUser.name,
      `Taux de commission de la plateforme fixé à ${commissionRate}%`,
      'INFO'
    );
    setAlertMessage(`Taux de commission (${commissionRate}%) enregistré.`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const allBrands = AppStorage.getBrands();
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: newBrandName,
      logo: '🔥',
      color: newBrandColor,
      description: `Marque de gaz ${newBrandName} certifiée.`,
      headquarters: newBrandHq,
      supportPhone: newBrandPhone,
    };

    AppStorage.saveBrands([...allBrands, newBrand]);
    AppStorage.logAction(
      'BRAND_CREATED',
      currentUser.name,
      `Nouvelle marque "${newBrandName}" ajoutée à la plateforme.`,
      'SUCCESS'
    );

    setShowAddBrandModal(false);
    setNewBrandName('');
    onDataChanged();
    setAlertMessage(`Marque ${newBrandName} créée avec succès.`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                Super Administrateur
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
              Supervision Globale pleinGas
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Gouvernance, validation des points de vente, catalogue marques, commissions et logs de sécurité.
            </p>
          </div>
        </div>

        {/* Navigation pills */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 overflow-x-auto self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              activeTab === 'overview' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            KPIs & Vue Globale
          </button>
          <button
            onClick={() => setActiveTab('sales_points')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              activeTab === 'sales_points' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Points de Vente ({pendingSalesPoints.length > 0 ? `⚠️ ${pendingSalesPoints.length}` : salesPoints.length})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              activeTab === 'brands' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Marques & Produits
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              activeTab === 'logs' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Alert toast */}
      {alertMessage && (
        <div className="p-3 bg-emerald-500 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4" /> {alertMessage}
        </div>
      )}

      {/* Overview KPIs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Volume Distribué
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalVolumeKg.toLocaleString('fr-FR')} kg
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Gaz Butane / Propane</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Chiffre d'Affaires Réseau
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalTurnover.toLocaleString('fr-FR')} F
              </div>
              <span className="text-[10px] text-slate-500">Toutes stations confondues</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Commissions Plateforme ({commissionRate}%)
              </span>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">
                {platformRevenue.toLocaleString('fr-FR')} F
              </div>
              <span className="text-[10px] text-slate-500">Revenus nets pleinGas</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Points de Vente Agréés
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {verifiedSalesPoints.length} / {salesPoints.length}
              </div>
              <span className="text-[10px] text-slate-500">
                {pendingSalesPoints.length} en attente d'approbation
              </span>
            </div>
          </div>

          {/* Pending Sales Points Approval Box */}
          {pendingSalesPoints.length > 0 && (
            <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-amber-950">
                  {pendingSalesPoints.length} point(s) de vente en attente d'agrément officiel
                </h3>
              </div>
              <p className="text-xs text-amber-800">
                Conformément à la <strong>Règle Métier 1</strong>, un point de vente ne peut être affiché sur la carte publique qu'après vérification de ses licences et de ses coordonnées GPS par l'administrateur.
              </p>

              <div className="space-y-2 pt-2">
                {pendingSalesPoints.map((sp) => (
                  <div
                    key={sp.id}
                    className="bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{sp.name}</h4>
                      <p className="text-xs text-slate-500">{sp.address} ({sp.city}) • Tél : {sp.phone}</p>
                      <span className="text-[10px] text-slate-400">
                        GPS: {sp.coordinates.lat}, {sp.coordinates.lng}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifySalesPoint(sp.id, true)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valider & Publier</span>
                      </button>
                      <button
                        onClick={() => handleVerifySalesPoint(sp.id, false)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold"
                      >
                        Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Platform Settings: Commission */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl space-y-4 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-600" />
              Paramétrage du Taux de Commission pleinGas
            </h3>
            <p className="text-xs text-slate-500">
              Pourcentage prélevé sur chaque vente de bouteille de gaz réalisée via la plateforme.
            </p>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 font-extrabold text-sm text-slate-900 focus:bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
              </div>

              <button
                onClick={handleSaveCommission}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sales Points Management */}
      {activeTab === 'sales_points' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Répertoire des Points de Vente ({salesPoints.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Point de Vente</th>
                  <th className="p-3.5">Ville & Quartier</th>
                  <th className="p-3.5">Coordonnées GPS</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Produits</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {salesPoints.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{sp.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{sp.legalName}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {sp.neighborhood}, {sp.city}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {sp.coordinates.lat.toFixed(4)}, {sp.coordinates.lng.toFixed(4)}
                    </td>
                    <td className="p-3.5 text-slate-600">{sp.phone}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800">{sp.products.length} réf.</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sp.isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sp.isVerified ? '✓ Agréé & Public' : '⚠️ En attente'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {sp.isVerified ? (
                        <button
                          onClick={() => handleVerifySalesPoint(sp.id, false)}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          Suspendre
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifySalesPoint(sp.id, true)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Brands */}
      {activeTab === 'brands' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Marques Partenaires & Produits Certifiés</h3>
            <button
              onClick={() => setShowAddBrandModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une nouvelle marque</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => {
              const brandProducts = products.filter((p) => p.brandId === brand.id);

              return (
                <div key={brand.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white font-bold"
                        style={{ backgroundColor: brand.color || '#E53E3E' }}
                      >
                        {brand.logo || '🔥'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{brand.name}</h4>
                        <span className="text-[10px] text-slate-400">{brand.headquarters}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">{brand.description}</p>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Formats au catalogue ({brandProducts.length}) :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {brandProducts.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                        >
                          {p.weight} ({p.standardPrice.toLocaleString('fr-FR')} F)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: System Logs (CU-ADMIN-15) */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Journaux d'activité & Audit Trail ({logs.length})
            </h3>
            <span className="text-xs text-slate-400">Traces d'exécution temps réel</span>
          </div>

          <div className="overflow-x-auto max-h-[60vh]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="p-3">Horodatage</th>
                  <th className="p-3">Niveau</th>
                  <th className="p-3">Action Système</th>
                  <th className="p-3">Acteur</th>
                  <th className="p-3">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          log.level === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.level === 'WARN' || log.level === 'ALERT'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{log.action}</td>
                    <td className="p-3 text-slate-600 font-sans">{log.actor}</td>
                    <td className="p-3 text-slate-700 font-sans">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Brand */}
      {showAddBrandModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddBrand}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="font-bold text-slate-900 text-base">Enregistrer une nouvelle marque de gaz</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom de la marque :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Oryx Energies, SCTM Gaz..."
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Couleur représentative :</label>
                <input
                  type="color"
                  value={newBrandColor}
                  onChange={(e) => setNewBrandColor(e.target.value)}
                  className="w-full h-10 p-1 bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Siège social / Ville :</label>
                <input
                  type="text"
                  value={newBrandHq}
                  onChange={(e) => setNewBrandHq(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Téléphone support :</label>
                <input
                  type="text"
                  value={newBrandPhone}
                  onChange={(e) => setNewBrandPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddBrandModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-purple-600 text-white rounded-xl shadow-xs hover:bg-purple-700"
              >
                Créer la marque
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
