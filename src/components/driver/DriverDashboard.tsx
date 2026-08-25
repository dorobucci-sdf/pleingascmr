import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Store,
  User as UserIcon,
} from 'lucide-react';
import { User, Order, OrderStatus } from '../../types';
import { AppStorage } from '../../services/storage';

interface DriverDashboardProps {
  currentUser: User;
  orders: Order[];
  onDataChanged: () => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  currentUser,
  orders,
  onDataChanged,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [incidentNote, setIncidentNote] = useState('');
  const [showIncidentModal, setShowIncidentModal] = useState<string | null>(null);

  // Available delivery missions (Orders marked as READY or PREPARING without a driver)
  const availableMissions = orders.filter(
    (o) =>
      o.deliveryType === 'DELIVERY' &&
      (o.status === 'READY' || o.status === 'PREPARING') &&
      (!o.driverId || o.driverId === '')
  );

  // Active missions for this driver
  const myActiveMissions = orders.filter(
    (o) =>
      o.driverId === currentUser.id &&
      (o.status === 'READY' || o.status === 'OUT_FOR_DELIVERY')
  );

  // Completed missions
  const completedMissions = orders.filter(
    (o) => o.driverId === currentUser.id && o.status === 'DELIVERED'
  );

  const totalEarnings = completedMissions.reduce((sum, o) => sum + o.deliveryFee, 0);

  const handleAcceptMission = (order: Order) => {
    AppStorage.updateOrderStatus(
      order.id,
      'READY',
      currentUser.name,
      `Mission acceptée par ${currentUser.name}`,
      currentUser.id,
      currentUser.name,
      currentUser.phone
    );
    onDataChanged();
  };

  const handleConfirmPickup = (order: Order) => {
    AppStorage.updateOrderStatus(
      order.id,
      'OUT_FOR_DELIVERY',
      currentUser.name,
      `Bouteille récupérée au dépôt ${order.salesPointName}. Livreur en route vers le client.`
    );
    onDataChanged();
  };

  const handleConfirmDelivered = (order: Order) => {
    AppStorage.updateOrderStatus(
      order.id,
      'DELIVERED',
      currentUser.name,
      `Bouteille livrée au client ${order.clientName} avec succès.`
    );
    onDataChanged();
  };

  const handleReportIncident = (orderId: string) => {
    if (!incidentNote.trim()) return;
    AppStorage.logAction(
      'DELIVERY_INCIDENT',
      currentUser.name,
      `Incident sur commande #${orderId.slice(-4)} : ${incidentNote}`,
      'ALERT'
    );
    setShowIncidentModal(null);
    setIncidentNote('');
    onDataChanged();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Driver Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Livreur Agréé Gaz
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Zone assignée : <strong>Douala Centre / Akwa / Deido</strong> • Véhicule : Moto sécurisée
            </p>
          </div>
        </div>

        {/* Online Status Toggle */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700 pl-2">
            Statut : {isOnline ? '🟢 En service (Disponible)' : '🔴 Hors ligne'}
          </span>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isOnline ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-300 text-slate-700'
            }`}
          >
            {isOnline ? 'En Ligne' : 'Passer En Ligne'}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Gains Cumulés
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {totalEarnings.toLocaleString('fr-FR')} FCFA
          </div>
          <span className="text-[10px] text-slate-500">100% des frais de livraison versés</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Missions Terminées
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{completedMissions.length}</div>
          <span className="text-[10px] text-slate-500">Bouteilles remises en main propre</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Missions Actives
          </span>
          <div className="text-2xl font-extrabold text-orange-600 mt-1">{myActiveMissions.length}</div>
          <span className="text-[10px] text-slate-500">En cours de transport</span>
        </div>
      </div>

      {/* Active Deliveries in Progress */}
      {myActiveMissions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping"></span>
            Mission en cours de livraison
          </h2>

          <div className="space-y-3">
            {myActiveMissions.map((order) => {
              const isOut = order.status === 'OUT_FOR_DELIVERY';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-orange-500 p-5 sm:p-6 shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-mono text-xs font-bold">
                          #{order.reference}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          Gain de course : {order.deliveryFee.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                        isOut ? 'bg-orange-100 text-orange-800 animate-pulse' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isOut ? 'En route vers le client' : 'À récupérer au dépôt'}
                    </span>
                  </div>

                  {/* Pickup & Dropoff Itinerary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Point A: Sales Point Pickup */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                        <Store className="w-3.5 h-3.5" /> Étape 1 : Retrait au Dépôt
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{order.salesPointName}</h4>
                      <p className="text-slate-500">{order.salesPointAddress}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${order.salesPointPhone}`}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-1 hover:bg-slate-100"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-600" /> Appeler le dépôt
                        </a>
                      </div>
                    </div>

                    {/* Point B: Client Dropoff */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                        <UserIcon className="w-3.5 h-3.5" /> Étape 2 : Livraison Client
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{order.clientName}</h4>
                      <p className="text-slate-500">{order.deliveryAddress}</p>
                      {order.notes && (
                        <p className="text-amber-800 bg-amber-50 p-1.5 rounded-lg text-[11px] font-semibold">
                          💡 Note : {order.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${order.clientPhone}`}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-1 hover:bg-slate-100"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" /> Appeler le client
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setShowIncidentModal(order.id)}
                      className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      Signaler un problème
                    </button>

                    {!isOut ? (
                      <button
                        onClick={() => handleConfirmPickup(order)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmer la récupération de la bouteille au dépôt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConfirmDelivered(order)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmer la remise de la bouteille au client</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Missions List */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">
          Missions de Livraison Disponibles ({availableMissions.length})
        </h2>

        {availableMissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <Bike className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Aucune mission en attente dans votre rayon</h3>
            <p className="text-xs text-slate-400">
              Dès qu'un client commande avec livraison, l'alerte apparaîtra instantanément ici.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-xs font-bold rounded">
                      #{mission.reference}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{mission.salesPointName}</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-sm font-bold text-emerald-700">{mission.clientName}</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {mission.items.map((i) => `${i.quantity}x ${i.productName} (${i.weight})`).join(', ')}
                  </p>

                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>📍 Destination : {mission.deliveryAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Gain du coursier</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {mission.deliveryFee.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <button
                    onClick={() => handleAcceptMission(mission)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accepter la mission</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base text-rose-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Signaler un incident de livraison
            </h3>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Description du problème :</label>
              <textarea
                value={incidentNote}
                onChange={(e) => setIncidentNote(e.target.value)}
                placeholder="Client injoignable, adresse introuvable, bouteille non conforme..."
                className="w-full p-3 bg-slate-100 rounded-xl border border-slate-200 h-24"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowIncidentModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={() => handleReportIncident(showIncidentModal)}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl shadow-xs hover:bg-rose-700"
              >
                Envoyer le rapport
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
