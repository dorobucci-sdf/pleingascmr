import React, { useState } from 'react';
import {
  Store,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Plus,
  Edit2,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Phone,
  Save,
  Check,
  Truck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { User, SalesPoint, Order, Product, OrderStatus } from '../../types';
import { AppStorage } from '../../services/storage';

interface VendorDashboardProps {
  currentUser: User;
  salesPoints: SalesPoint[];
  products: Product[];
  orders: Order[];
  onDataChanged: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  currentUser,
  salesPoints,
  products,
  orders,
  onDataChanged,
}) => {
  // Find vendor's sales point (or fallback to first one)
  const mySalesPoint =
    salesPoints.find((sp) => sp.vendorUserId === currentUser.id || sp.id === currentUser.salesPointId) ||
    salesPoints[0];

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'settings'>('orders');
  const [editingStock, setEditingStock] = useState<{ [productId: string]: number }>({});
  const [editingPrices, setEditingPrices] = useState<{ [productId: string]: number }>({});
  const [saveSuccessAlert, setSaveSuccessAlert] = useState<string | null>(null);

  // Settings form
  const [spName, setSpName] = useState(mySalesPoint?.name || '');
  const [spHours, setSpHours] = useState(mySalesPoint?.openingHours || '');
  const [spPhone, setSpPhone] = useState(mySalesPoint?.phone || '');
  const [spOffersDelivery, setSpOffersDelivery] = useState(mySalesPoint?.offersDelivery ?? true);
  const [spBaseFee, setSpBaseFee] = useState(mySalesPoint?.deliveryBaseFee || 1000);
  const [spPerKm, setSpPerKm] = useState(mySalesPoint?.deliveryFeePerKm || 250);

  // New product selector
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedNewProdId, setSelectedNewProdId] = useState(products[0]?.id || '');
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdPrice, setNewProdPrice] = useState(6500);

  const spOrders = orders.filter((o) => o.salesPointId === mySalesPoint?.id);
  const pendingOrders = spOrders.filter(
    (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'READY'
  );
  const completedOrders = spOrders.filter((o) => o.status === 'DELIVERED');

  const totalSalesAmount = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalStockCount = mySalesPoint?.products.reduce((sum, p) => sum + p.stock, 0) || 0;
  const outOfStockCount = mySalesPoint?.products.filter((p) => p.stock === 0 || !p.isAvailable).length || 0;

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, note: string) => {
    AppStorage.updateOrderStatus(orderId, status, currentUser.name, note);
    onDataChanged();
    setSaveSuccessAlert(`Commande #${orderId.slice(-4)} passée au statut ${status}`);
    setTimeout(() => setSaveSuccessAlert(null), 3000);
  };

  const handleSaveInventory = () => {
    if (!mySalesPoint) return;
    const allSp = AppStorage.getSalesPoints();
    const idx = allSp.findIndex((s) => s.id === mySalesPoint.id);
    if (idx === -1) return;

    mySalesPoint.products.forEach((p) => {
      if (editingStock[p.productId] !== undefined) {
        p.stock = Math.max(0, editingStock[p.productId]);
        p.isAvailable = p.stock > 0;
      }
      if (editingPrices[p.productId] !== undefined) {
        p.price = Math.max(0, editingPrices[p.productId]);
      }
    });

    allSp[idx] = mySalesPoint;
    AppStorage.saveSalesPoints(allSp);
    AppStorage.logAction(
      'STOCK_MANUAL_UPDATE',
      currentUser.name,
      `Mise à jour des stocks/prix pour ${mySalesPoint.name}`,
      'INFO'
    );
    onDataChanged();
    setSaveSuccessAlert('Stocks et prix enregistrés avec succès !');
    setTimeout(() => setSaveSuccessAlert(null), 3000);
  };

  const handleAddProductToInventory = () => {
    if (!mySalesPoint) return;
    const productToAdd = products.find((p) => p.id === selectedNewProdId);
    if (!productToAdd) return;

    // Check if already in inventory
    const existing = mySalesPoint.products.find((p) => p.productId === selectedNewProdId);
    if (existing) {
      existing.stock += newProdStock;
      existing.price = newProdPrice;
      existing.isAvailable = existing.stock > 0;
    } else {
      mySalesPoint.products.push({
        productId: productToAdd.id,
        product: productToAdd,
        price: newProdPrice,
        stock: newProdStock,
        isAvailable: newProdStock > 0,
        minStockAlert: 3,
      });
    }

    const allSp = AppStorage.getSalesPoints();
    const idx = allSp.findIndex((s) => s.id === mySalesPoint.id);
    if (idx !== -1) {
      allSp[idx] = mySalesPoint;
      AppStorage.saveSalesPoints(allSp);
    }

    setShowAddProductModal(false);
    onDataChanged();
    setSaveSuccessAlert(`${productToAdd.name} ajouté à l'inventaire !`);
    setTimeout(() => setSaveSuccessAlert(null), 3000);
  };

  const handleSaveSettings = () => {
    if (!mySalesPoint) return;
    const allSp = AppStorage.getSalesPoints();
    const idx = allSp.findIndex((s) => s.id === mySalesPoint.id);
    if (idx === -1) return;

    mySalesPoint.name = spName;
    mySalesPoint.openingHours = spHours;
    mySalesPoint.phone = spPhone;
    mySalesPoint.offersDelivery = spOffersDelivery;
    mySalesPoint.deliveryBaseFee = Number(spBaseFee);
    mySalesPoint.deliveryFeePerKm = Number(spPerKm);

    allSp[idx] = mySalesPoint;
    AppStorage.saveSalesPoints(allSp);
    onDataChanged();
    setSaveSuccessAlert('Paramètres du point de vente enregistrés.');
    setTimeout(() => setSaveSuccessAlert(null), 3000);
  };

  if (!mySalesPoint) {
    return <div className="p-8 text-center">Aucun point de vente assigné.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            🏪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{mySalesPoint.name}</h1>
              {mySalesPoint.isVerified ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Agréé & Actif
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  En attente validation admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {mySalesPoint.address} ({mySalesPoint.neighborhood}) • GPS: {mySalesPoint.coordinates.lat.toFixed(4)},{' '}
                {mySalesPoint.coordinates.lng.toFixed(4)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Commandes ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Stock & Tarifs ({mySalesPoint.products.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Paramètres
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {saveSuccessAlert && (
        <div className="p-3 bg-emerald-500 text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" /> {saveSuccessAlert}
          </span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Commandes à traiter
          </span>
          <div className="text-2xl font-extrabold text-orange-600 mt-1">{pendingOrders.length}</div>
          <span className="text-[10px] text-slate-500">En cours de flux</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Ventes Réalisées
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {totalSalesAmount.toLocaleString('fr-FR')} F
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">
            {completedOrders.length} commandes livrées
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Bouteilles en stock
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalStockCount}</div>
          <span className="text-[10px] text-slate-500">Toutes marques confondues</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Alertes Rupture
          </span>
          <div
            className={`text-2xl font-extrabold mt-1 ${
              outOfStockCount > 0 ? 'text-rose-600' : 'text-slate-400'
            }`}
          >
            {outOfStockCount}
          </div>
          <span className="text-[10px] text-slate-500">Produits à réapprovisionner</span>
        </div>
      </div>

      {/* Tab: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Commandes Reçues ({spOrders.length})
            </h2>
            <span className="text-xs text-slate-400">Cliquez pour valider les étapes</span>
          </div>

          {spOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Aucune commande pour le moment</h3>
              <p className="text-xs text-slate-400">Les nouvelles commandes apparaîtront ici automatiquement.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {spOrders.map((order) => {
                const isPending = order.status === 'PENDING';
                const isConfirmed = order.status === 'CONFIRMED';
                const isPreparing = order.status === 'PREPARING';
                const isReady = order.status === 'READY';
                const isOut = order.status === 'OUT_FOR_DELIVERY';
                const isDelivered = order.status === 'DELIVERED';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-mono font-bold">
                          #{order.reference}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm">{order.clientName}</span>
                        <span className="text-xs text-slate-400 font-medium">({order.clientPhone})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-orange-100 text-orange-800 animate-pulse'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-semibold">
                        {order.items.map((i) => `${i.quantity}x ${i.productName} (${i.weight})`).join(' + ')}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span>{order.deliveryType === 'DELIVERY' ? '🚚 Livraison' : '🏬 Retrait sur place'}</span>
                        {order.deliveryAddress && <span>• {order.deliveryAddress}</span>}
                        <span>• Paiement : {order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Order Action Flow Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <div className="text-right mr-3 hidden sm:block">
                        <div className="text-sm font-extrabold text-slate-900">
                          {order.totalAmount.toLocaleString('fr-FR')} FCFA
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {isPending && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'CONFIRMED', 'Commande confirmée par le point de vente')
                            }
                            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow-xs"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'REJECTED', 'Refusée par le dépôt (rupture ou fermeture)')
                            }
                            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold"
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(
                              order.id,
                              'PREPARING',
                              'Bouteille contrôlée et en cours de préparation'
                            )
                          }
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-xs"
                        >
                          Préparer le colis
                        </button>
                      )}

                      {isPreparing && (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(
                              order.id,
                              'READY',
                              order.deliveryType === 'DELIVERY'
                                ? 'Prête pour le livreur partenaire'
                                : 'Prête pour le retrait client'
                            )
                          }
                          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-xs"
                        >
                          Marquer "Prête"
                        </button>
                      )}

                      {isReady && (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(
                              order.id,
                              order.deliveryType === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'DELIVERED',
                              order.deliveryType === 'DELIVERY'
                                ? 'Transmise au livreur Jean-Pierre Kamga'
                                : 'Retirée sur place par le client'
                            )
                          }
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-xs"
                        >
                          {order.deliveryType === 'DELIVERY' ? 'Remettre au livreur' : 'Confirmer Retrait Client'}
                        </button>
                      )}

                      {isDelivered && (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Clôturée
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Inventory & Pricing */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Gestion des Bouteilles, Stocks & Prix
              </h2>
              <p className="text-xs text-slate-500">
                Modifiez les quantités en temps réel pour éviter l'overselling (survente).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une marque</span>
              </button>

              <button
                onClick={handleSaveInventory}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                id="save-inventory-btn"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les stocks</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Produit / Marque</th>
                    <th className="p-3.5">Format</th>
                    <th className="p-3.5">Prix de vente (FCFA)</th>
                    <th className="p-3.5">Stock Disponible</th>
                    <th className="p-3.5">Statut Visibilité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mySalesPoint.products.map((item) => {
                    const currentStock =
                      editingStock[item.productId] !== undefined
                        ? editingStock[item.productId]
                        : item.stock;
                    const currentPrice =
                      editingPrices[item.productId] !== undefined
                        ? editingPrices[item.productId]
                        : item.price;

                    return (
                      <tr key={item.productId} className="hover:bg-slate-50/50">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                              🔥
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{item.product.name}</div>
                              <span className="text-[10px] text-slate-400">{item.product.brandName}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-bold text-slate-700">{item.product.weight}</td>

                        <td className="p-3.5">
                          <input
                            type="number"
                            value={currentPrice}
                            onChange={(e) =>
                              setEditingPrices({
                                ...editingPrices,
                                [item.productId]: Number(e.target.value),
                              })
                            }
                            className="w-24 p-1.5 bg-slate-100 rounded-lg font-extrabold text-slate-900 border border-slate-200 focus:bg-white focus:outline-hidden"
                          />
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={currentStock}
                              onChange={(e) =>
                                setEditingStock({
                                  ...editingStock,
                                  [item.productId]: Number(e.target.value),
                                })
                              }
                              className="w-20 p-1.5 bg-slate-100 rounded-lg font-extrabold text-slate-900 border border-slate-200 focus:bg-white focus:outline-hidden"
                            />
                            {currentStock === 0 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                Rupture
                              </span>
                            ) : currentStock <= 5 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                                Alerte stock bas
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                OK
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              currentStock > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {currentStock > 0 ? 'Visible en recherche' : 'Masqué (Rupture)'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-2xl shadow-xs">
          <h2 className="text-base font-extrabold text-slate-900">
            Coordonnées & Tarifs de Livraison du Dépôt
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nom public du point de vente :</label>
              <input
                type="text"
                value={spName}
                onChange={(e) => setSpName(e.target.value)}
                className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Horaires d'ouverture :</label>
              <input
                type="text"
                value={spHours}
                onChange={(e) => setSpHours(e.target.value)}
                className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Téléphone de contact :</label>
              <input
                type="text"
                value={spPhone}
                onChange={(e) => setSpPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spOffersDelivery}
                  onChange={(e) => setSpOffersDelivery(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span>Activer le service de livraison à domicile</span>
              </label>

              {spOffersDelivery && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Frais de base (FCFA) :</label>
                    <input
                      type="number"
                      value={spBaseFee}
                      onChange={(e) => setSpBaseFee(Number(e.target.value))}
                      className="w-full p-2 bg-slate-100 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tarif au km (FCFA) :</label>
                    <input
                      type="number"
                      value={spPerKm}
                      onChange={(e) => setSpPerKm(Number(e.target.value))}
                      className="w-full p-2 bg-slate-100 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveSettings}
              className="mt-4 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold shadow-xs hover:bg-orange-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add Product to Point of Sale */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Ajouter une bouteille au stock</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sélectionner la bouteille :</label>
                <select
                  value={selectedNewProdId}
                  onChange={(e) => setSelectedNewProdId(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.weight}) - {p.brandName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantité initiale en stock :</label>
                <input
                  type="number"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full p-2 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Prix de vente unitaire (FCFA) :</label>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProductToInventory}
                className="px-4 py-2 text-xs font-bold bg-orange-600 text-white rounded-xl shadow-xs hover:bg-orange-700"
              >
                Ajouter au stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
