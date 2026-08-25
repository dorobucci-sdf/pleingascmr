import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Truck,
  ShieldCheck,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Check,
  Flame,
  Info,
  AlertTriangle,
  PackageCheck,
} from 'lucide-react';
import { SalesPoint, Product, SalesPointProduct, Cart } from '../../types';

interface SalesPointModalProps {
  salesPoint: SalesPoint;
  products: Product[];
  currentCart?: Cart;
  onAddToCart: (product: Product, quantity: number) => void;
  onClose: () => void;
}

export const SalesPointModal: React.FC<SalesPointModalProps> = ({
  salesPoint,
  products,
  currentCart,
  onAddToCart,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'info' | 'reviews'>('products');
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
  const [addedAlert, setAddedAlert] = useState<string | null>(null);

  const getQty = (productId: string) => quantities[productId] || 1;

  const setQty = (productId: string, val: number, maxStock: number) => {
    const clamped = Math.max(1, Math.min(val, maxStock));
    setQuantities((prev) => ({ ...prev, [productId]: clamped }));
  };

  const handleAdd = (item: SalesPointProduct) => {
    const qty = getQty(item.productId);
    onAddToCart(item.product, qty);
    setAddedAlert(`✓ ${qty}x ${item.product.name} ajouté au panier !`);
    setTimeout(() => setAddedAlert(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] sm:max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-transform hover:scale-105"
          id="close-sp-modal-btn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Banner */}
        <div className="relative h-40 sm:h-48 bg-slate-900 overflow-hidden shrink-0">
          <img
            src={salesPoint.image}
            alt={salesPoint.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="px-2 py-0.5 rounded-md bg-orange-600 font-bold text-[10px] uppercase tracking-wider">
                Point de Vente Agréé
              </span>
              {salesPoint.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> Certifié
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight">{salesPoint.name}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">
                {salesPoint.address}, {salesPoint.neighborhood} ({salesPoint.city})
              </span>
            </p>
          </div>
        </div>

        {/* Quick Action Contact Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 text-xs shrink-0 flex-wrap">
          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className={salesPoint.isOpen ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                {salesPoint.isOpen ? `Ouvert (${salesPoint.openingHours})` : 'Fermé'}
              </span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              <span>{salesPoint.offersDelivery ? `Livraison (rayon ${salesPoint.deliveryRadiusKm} km)` : 'Retrait seul'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {salesPoint.phone && (
              <a
                href={`tel:${salesPoint.phone}`}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1 shadow-2xs"
              >
                <Phone className="w-3 h-3 text-blue-600" />
                <span>Appel</span>
              </a>
            )}
            {salesPoint.whatsapp && (
              <a
                href={`https://wa.me/${salesPoint.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-2xs"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Added Alert Toast */}
        {addedAlert && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-200 shrink-0">
            <span>{addedAlert}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-4 shrink-0 bg-white">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Bouteilles & Stocks ({salesPoint.products.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Horaires & Localisation
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Avis ({salesPoint.reviewCount})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'products' && (
            <div className="space-y-2.5">
              {salesPoint.products.map((item) => {
                const inStock = item.stock > 0 && item.isAvailable;
                const qty = getQty(item.productId);

                return (
                  <div
                    key={item.productId}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      inStock
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/80 flex items-center justify-center font-black shrink-0 text-xs">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{item.product.name}</h4>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                            {item.product.weight}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-black text-orange-600">
                            {item.price.toLocaleString('fr-FR')} FCFA
                          </span>
                          {inStock ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              {item.stock} en stock
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                              Rupture de stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Add button */}
                    {inStock ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                          <button
                            onClick={() => setQty(item.productId, qty - 1, item.stock)}
                            disabled={qty <= 1}
                            className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold disabled:opacity-40 shadow-2xs"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-slate-800">{qty}</span>
                          <button
                            onClick={() => setQty(item.productId, qty + 1, item.stock)}
                            disabled={qty >= item.stock}
                            className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold disabled:opacity-40 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleAdd(item)}
                          className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">Indisponible</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Adresse et Accès</h4>
                <p>📍 {salesPoint.address}, Quartier {salesPoint.neighborhood}, {salesPoint.city}</p>
                <p>🕒 Horaires habituels : <strong>{salesPoint.openingHours}</strong></p>
                <p>🚚 Tarifs livraison : Base <strong>{salesPoint.deliveryBaseFee} F</strong> + <strong>{salesPoint.deliveryFeePerKm} F/km</strong></p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
                <Star className="w-8 h-8 fill-amber-400 stroke-amber-400" />
                <div>
                  <div className="text-lg font-black text-slate-900">{salesPoint.rating} / 5</div>
                  <div className="text-xs text-slate-600">Basé sur {salesPoint.reviewCount} avis certifiés</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic text-center py-2">
                Tous les avis proviennent de clients ayant validé une livraison ou un retrait.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
