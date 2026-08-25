import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Search,
  MapPin,
  Truck,
  Store,
  Phone,
  Calendar,
  CreditCard,
  Star,
} from 'lucide-react';
import { User, Order } from '../../types';

interface ClientDashboardProps {
  currentUser: User;
  orders: Order[];
  onOpenSearch: () => void;
  onTrackOrder: (order: Order) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentUser,
  orders,
  onOpenSearch,
  onTrackOrder,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL');

  const myOrders = orders.filter((o) => o.clientId === currentUser.id);

  const activeOrders = myOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && o.status !== 'REJECTED');
  const pastOrders = myOrders.filter((o) => o.status === 'DELIVERED');

  const displayedOrders = myOrders.filter((o) => {
    if (filterStatus === 'ACTIVE') return o.status !== 'DELIVERED';
    if (filterStatus === 'DELIVERED') return o.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-orange-600 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Espace Client
            </span>
            <span className="text-xs text-slate-400">Compte vérifié</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bonjour, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Retrouvez ici toutes vos commandes de gaz, vos factures, vos adresses de livraison et le suivi de vos bouteilles en temps réel.
          </p>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-extrabold text-sm flex items-center gap-2.5 shadow-lg shadow-orange-600/30 transition-transform hover:scale-105 shrink-0"
          id="hero-find-gas-btn"
        >
          <Search className="w-5 h-5" />
          <span>Trouver du gaz près de moi</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commandes en cours</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{activeOrders.length}</div>
          <span className="text-[11px] text-slate-400">Suivi GPS et livraison en direct</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bouteilles livrées</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {pastOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
          </div>
          <span className="text-[11px] text-slate-400">Total historique de recharges</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adresse par défaut</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-2 truncate">
            {currentUser.defaultAddress || 'Akwa, Douala'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Zone couverte par livraison</span>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Historique de mes commandes</h2>
            <p className="text-xs text-slate-500">Visualisez et suivez le statut de chaque commande.</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Toutes ({myOrders.length})
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'ACTIVE' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              En cours ({activeOrders.length})
            </button>
            <button
              onClick={() => setFilterStatus('DELIVERED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'DELIVERED' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Terminées ({pastOrders.length})
            </button>
          </div>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Aucune commande trouvée</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Recherchez le point de vente le plus proche sur la carte pour commander votre bouteille de gaz.
            </p>
            <button
              onClick={onOpenSearch}
              className="px-5 py-2.5 bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-orange-700"
            >
              Trouver du gaz maintenant
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedOrders.map((order) => {
              const isDelivered = order.status === 'DELIVERED';
              const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  onClick={() => onTrackOrder(order)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  id={`order-card-${order.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                        isDelivered ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      🔥
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {order.salesPointName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{order.reference}</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-0.5">
                        {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {order.deliveryType === 'DELIVERY' ? (
                            <Truck className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Store className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                          <span>{order.deliveryType === 'DELIVERY' ? 'Livraison' : 'Retrait'}</span>
                        </span>
                        <span>•</span>
                        <span className="font-bold text-slate-700">
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        {order.totalAmount.toLocaleString('fr-FR')} FCFA
                      </div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800 animate-pulse'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <button
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors"
                      id={`view-order-${order.id}`}
                    >
                      <span>Suivre</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
