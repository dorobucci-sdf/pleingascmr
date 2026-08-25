import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Package,
  Bike,
  Home,
  Store,
  Phone,
  RotateCcw,
  Sparkles,
  Star,
  Flame,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Order, OrderStatus, User } from '../../types';
import { AppStorage } from '../../services/storage';

interface OrderTrackingModalProps {
  order: Order;
  currentUser?: User;
  onClose: () => void;
  onDataChanged?: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  currentUser,
  onClose,
  onDataChanged,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [isSimulating, setIsSimulating] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  const steps: { status: OrderStatus; label: string; description: string; icon: React.ElementType }[] = [
    {
      status: 'PENDING',
      label: 'Commande transmise',
      description: 'Paiement enregistré, en attente d’acceptation par le dépôt.',
      icon: Clock,
    },
    {
      status: 'CONFIRMED',
      label: 'Acceptée par le dépôt',
      description: 'Le point de vente a confirmé la disponibilité des bouteilles.',
      icon: CheckCircle2,
    },
    {
      status: 'PREPARING',
      label: 'En préparation',
      description: 'Vérification du scellé et test de pression de la valve.',
      icon: Package,
    },
    {
      status: 'READY',
      label: currentOrder.deliveryType === 'DELIVERY' ? 'Prête / Livreur affecté' : 'Prête pour retrait',
      description:
        currentOrder.deliveryType === 'DELIVERY'
          ? 'Bouteille prête. Mission attribuée au livreur partenaire.'
          : 'Vous pouvez vous présenter au dépôt pour récupérer vos bouteilles.',
      icon: currentOrder.deliveryType === 'DELIVERY' ? Bike : Store,
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'En cours de livraison',
      description: 'Le livreur est en route vers votre adresse de livraison.',
      icon: Bike,
    },
    {
      status: 'DELIVERED',
      label: 'Terminée avec succès',
      description: 'Bouteille remise et vérifiée avec le client.',
      icon: Home,
    },
  ];

  const statusOrderIndex: { [key in OrderStatus]: number } = {
    PENDING: 0,
    CONFIRMED: 1,
    PREPARING: 2,
    READY: 3,
    OUT_FOR_DELIVERY: 4,
    DELIVERED: 5,
    CANCELLED: -1,
    REJECTED: -1,
  };

  const currentStepIndex = statusOrderIndex[currentOrder.status];

  // Helper to simulate next lifecycle step for demo purposes
  const handleAdvanceStatus = () => {
    setIsSimulating(true);
    const orderStatuses: OrderStatus[] = [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
    ];

    const nextIdx = currentStepIndex + 1;
    if (nextIdx < orderStatuses.length) {
      const nextStatus = orderStatuses[nextIdx];
      const updated = AppStorage.updateOrderStatus(
        currentOrder.id,
        nextStatus,
        `Mise à jour automatique simulation : ${nextStatus}`
      );
      if (updated) {
        setCurrentOrder(updated);
        if (onDataChanged) onDataChanged();
      }
    }
    setIsSimulating(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOrder.salesPointId && currentUser) {
      AppStorage.addReview({
        salesPointId: currentOrder.salesPointId,
        orderId: currentOrder.id,
        clientName: currentUser.name,
        rating,
        comment,
      });
      setIsReviewSubmitted(true);
      if (onDataChanged) onDataChanged();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md text-[10px] font-black uppercase tracking-wider">
                Suivi en temps réel
              </span>
              <span className="text-xs font-bold text-slate-500">#{currentOrder.reference}</span>
            </div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg mt-0.5">
              {currentOrder.salesPointName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Order Summary Pill */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Bouteilles commandées
              </span>
              <span className="font-black text-slate-900 text-sm">
                {currentOrder.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Réglé</span>
              <span className="font-black text-orange-600 text-sm">
                {currentOrder.totalAmount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Progression de la livraison
            </h4>

            <div className="space-y-4 relative pl-2">
              {/* Vertical line behind items */}
              <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-200 z-0"></div>

              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.status} className="relative flex items-start gap-3.5 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 transition-all ${
                        isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-extrabold ${
                            isCurrent
                              ? 'text-orange-600'
                              : isPassed
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold animate-pulse">
                            En cours
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulation Accelerator for Demo */}
          {currentOrder.status !== 'DELIVERED' && (
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="text-indigo-900">
                <span className="font-extrabold block">Mode Démonstration & Test</span>
                <span className="text-[11px] text-indigo-700">
                  Faites avancer le statut de la commande instantanément.
                </span>
              </div>
              <button
                onClick={handleAdvanceStatus}
                disabled={isSimulating}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Étape suivante</span>
              </button>
            </div>
          )}

          {/* Review Box once Delivered */}
          {currentOrder.status === 'DELIVERED' && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
              <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Donnez votre avis sur le dépôt {currentOrder.salesPointName}</span>
              </h5>

              {isReviewSubmitted ? (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Merci pour votre avis ! Il a été publié sur le profil du dépôt.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Note :</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Votre commentaire (qualité du scellé, rapidité de la livraison...)"
                    rows={2}
                    className="w-full p-2.5 bg-white rounded-xl border border-amber-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors"
                  >
                    Publier mon évaluation
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
