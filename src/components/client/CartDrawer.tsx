import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  Store,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { Cart, SalesPoint, DeliveryType, Coordinates } from '../../types';
import { calculateDistanceKm, formatDistance } from '../../services/geo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  salesPoint?: SalesPoint | null;
  userLocation?: Coordinates;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (options?: {
    deliveryType: DeliveryType;
    deliveryAddress: string;
    deliveryFee: number;
    subtotal: number;
    totalAmount: number;
    notes: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  salesPoint,
  userLocation = { lat: 4.0511, lng: 9.7085 },
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Akwa, Rue Sylvani, Immeuble Horizon');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Delivery distance & fee calculation
  const distance = salesPoint ? calculateDistanceKm(userLocation, salesPoint.coordinates) : 2.5;

  let deliveryFee = 0;
  if (deliveryType === 'DELIVERY' && salesPoint && salesPoint.offersDelivery) {
    deliveryFee = salesPoint.deliveryBaseFee + Math.round(distance * salesPoint.deliveryFeePerKm);
  }

  const totalAmount = subtotal + deliveryFee;

  const handleCheckoutClick = () => {
    onProceedToCheckout({
      deliveryType,
      deliveryAddress: deliveryType === 'DELIVERY' ? deliveryAddress : '',
      deliveryFee,
      subtotal,
      totalAmount,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Mon Panier Gaz</h3>
              <span className="text-[11px] text-slate-500 font-semibold">
                {totalItems} bouteille{totalItems > 1 ? 's' : ''} • {salesPoint?.name || cart.salesPointName || 'Point de vente'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            id="close-cart-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Votre panier est vide</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Sélectionnez un dépôt sur la carte pour ajouter des bouteilles de gaz disponibles.
              </p>
            </div>
          ) : (
            <>
              {/* Point of sale banner */}
              {salesPoint && (
                <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/80 flex items-center gap-3 text-xs">
                  <Store className="w-4 h-4 text-orange-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 block truncate">{salesPoint.name}</span>
                    <span className="text-slate-500 text-[11px]">📍 {salesPoint.address} ({formatDistance(distance)})</span>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="space-y-2.5">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.productName}</h5>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-orange-600">{item.unitPrice.toLocaleString('fr-FR')} F</span>
                        <span>• Format {item.weight}</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold shadow-2xs hover:bg-slate-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-extrabold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold shadow-2xs hover:bg-slate-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity(item.productId, 0)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Retirer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery vs Pickup Choice */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <span className="font-extrabold text-slate-900 block uppercase tracking-wider text-[10px]">
                  Mode de réception :
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryType('DELIVERY')}
                    className={`p-2.5 rounded-xl border font-bold flex flex-col items-center text-center gap-1 transition-all ${
                      deliveryType === 'DELIVERY'
                        ? 'bg-white border-orange-500 text-orange-600 shadow-xs ring-2 ring-orange-200'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Livraison à domicile</span>
                  </button>

                  <button
                    onClick={() => setDeliveryType('PICKUP')}
                    className={`p-2.5 rounded-xl border font-bold flex flex-col items-center text-center gap-1 transition-all ${
                      deliveryType === 'PICKUP'
                        ? 'bg-white border-orange-500 text-orange-600 shadow-xs ring-2 ring-orange-200'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Retrait au dépôt</span>
                  </button>
                </div>

                {deliveryType === 'DELIVERY' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Adresse de livraison :</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
                      placeholder="Quartier, rue, repère..."
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer with Price Breakdown & Checkout Button */}
        {cart.items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total bouteilles :</span>
                <span className="font-bold text-slate-900">{subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison :</span>
                <span className="font-bold text-slate-900">
                  {deliveryType === 'DELIVERY' ? `${deliveryFee.toLocaleString('fr-FR')} FCFA` : 'Gratuit (Retrait)'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total à régler :</span>
                <span className="text-orange-600 text-base font-black">
                  {totalAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.01]"
              id="proceed-checkout-btn"
            >
              <span>Procéder au Paiement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
