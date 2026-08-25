import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Flame,
  Truck,
  Store,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Cart, SalesPoint, DeliveryType, PaymentMethod, Order, User } from '../../types';
import { AppStorage } from '../../services/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  salesPoint: SalesPoint;
  currentUser: User;
  onOrderSuccess: (order: Order) => void;
  orderOptions?: {
    deliveryType: DeliveryType;
    deliveryAddress: string;
    deliveryFee: number;
    subtotal: number;
    totalAmount: number;
    notes: string;
  };
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  salesPoint,
  currentUser,
  onOrderSuccess,
  orderOptions,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('ORANGE_MONEY');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser.phone || '+237 690 12 34 56');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvc, setCardCvc] = useState<string>('888');

  // Status step
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = orderOptions?.subtotal || cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const deliveryFee = orderOptions?.deliveryFee || 0;
  const totalAmount = orderOptions?.totalAmount || subtotal + deliveryFee;
  const deliveryType = orderOptions?.deliveryType || 'DELIVERY';
  const deliveryAddress = orderOptions?.deliveryAddress || currentUser.address || 'Akwa, Douala';

  const handleProcessPayment = () => {
    setStatus('PROCESSING');
    setErrorMessage(null);

    setTimeout(() => {
      const items = cart.items.map((c) => ({
        productId: c.productId,
        productName: c.productName,
        brandName: c.brandName,
        weight: c.weight,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        totalPrice: c.unitPrice * c.quantity,
      }));

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const reference = `PG-2026-${randomSuffix}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        reference,
        clientId: currentUser.id,
        clientName: currentUser.name,
        clientPhone: phoneNumber,
        salesPointId: salesPoint.id,
        salesPointName: salesPoint.name,
        salesPointAddress: salesPoint.address,
        salesPointPhone: salesPoint.phone,
        items,
        subtotal,
        deliveryFee,
        totalAmount,
        deliveryType,
        deliveryAddress: deliveryType === 'DELIVERY' ? deliveryAddress : '',
        deliveryCoordinates: salesPoint.coordinates,
        status: 'PENDING',
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
        paymentReference: `${selectedMethod.slice(0, 3)}-${Date.now().toString().slice(-6)}`,
        notes: orderOptions?.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            status: 'PENDING',
            timestamp: new Date().toISOString(),
            note:
              selectedMethod === 'CASH_ON_DELIVERY'
                ? 'Commande créée (Paiement à la livraison).'
                : `Paiement ${selectedMethod} validé. Commande transmise au dépôt ${salesPoint.name}.`,
          },
        ],
      };

      const result = AppStorage.placeOrder(newOrder);

      if (!result.success) {
        setStatus('ERROR');
        setErrorMessage(result.error || 'Erreur lors de la validation du stock.');
        return;
      }

      setCreatedOrder(newOrder);
      setStatus('SUCCESS');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 1500);
  };

  const handleFinish = () => {
    if (createdOrder) {
      onOrderSuccess(createdOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
              Paiement Sécurisé
            </span>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              {status === 'SUCCESS' ? 'Commande Validée avec Succès !' : 'Régler ma commande de gaz'}
            </h3>
          </div>
          {status !== 'PROCESSING' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {status === 'SUCCESS' && createdOrder ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black">
                  Réf : #{createdOrder.reference}
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-2">
                  Merci {currentUser.name} !
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  Votre commande a été transmise à <strong>{salesPoint.name}</strong>. Les bouteilles sont réservées en stock.
                </p>
              </div>

              {/* Order Recap */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between font-black text-slate-900">
                  <span>Montant Total :</span>
                  <span className="text-orange-600 font-black text-sm">
                    {createdOrder.totalAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mode de règlement :</span>
                  <span className="font-bold text-slate-900">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Type :</span>
                  <span className="font-bold text-slate-900">
                    {createdOrder.deliveryType === 'DELIVERY' ? 'Livraison à domicile' : 'Retrait au dépôt'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
              >
                <span>Suivre ma commande en temps réel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Amount Recap Banner */}
              <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-orange-800 font-bold block">Montant Total à payer :</span>
                  <span className="text-xl font-black text-orange-600">
                    {totalAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="text-right text-xs text-slate-500 font-medium">
                  <span>{cart.items.reduce((s, i) => s + i.quantity, 0)} bouteille(s)</span>
                  <div className="text-[10px] text-slate-400">{salesPoint.name}</div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Choisissez votre moyen de paiement :</label>

                <div className="grid grid-cols-2 gap-2">
                  {/* Orange Money */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('ORANGE_MONEY')}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                      selectedMethod === 'ORANGE_MONEY'
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                      OM
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Orange Money</span>
                      <span className="text-[10px] text-slate-400">#150*...</span>
                    </div>
                  </button>

                  {/* MTN Mobile Money */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('MTN_MOMO')}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                      selectedMethod === 'MTN_MOMO'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                      MTN
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">MTN MoMo</span>
                      <span className="text-[10px] text-slate-400">*126#</span>
                    </div>
                  </button>

                  {/* Wave */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('WAVE')}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                      selectedMethod === 'WAVE'
                        ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                      🌊
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Wave</span>
                      <span className="text-[10px] text-slate-400">Scan QR</span>
                    </div>
                  </button>

                  {/* Cash on delivery */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('CASH_ON_DELIVERY')}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                      selectedMethod === 'CASH_ON_DELIVERY'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">À la livraison</span>
                      <span className="text-[10px] text-slate-400">Cash / Espèces</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic input field depending on payment method */}
              {(selectedMethod === 'ORANGE_MONEY' || selectedMethod === 'MTN_MOMO' || selectedMethod === 'WAVE') && (
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block">
                    Numéro de compte pour le prélèvement :
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold focus:border-orange-500 focus:outline-hidden"
                      placeholder="+237 6XX XX XX XX"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Un prompt de validation USSD sécurisé sera envoyé à ce numéro.
                  </span>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Confirm Pay button */}
              <button
                onClick={handleProcessPayment}
                disabled={status === 'PROCESSING'}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-transform hover:scale-[1.01] disabled:opacity-50"
                id="confirm-pay-btn"
              >
                {status === 'PROCESSING' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Communication Passerelle Sécurisée...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmer et Payer {totalAmount.toLocaleString('fr-FR')} FCFA</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
