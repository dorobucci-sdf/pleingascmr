import React from 'react';
import { Building2, Store, Flame, TrendingUp, PackageCheck, MapPin, ShieldCheck } from 'lucide-react';
import { User, Brand, SalesPoint, Order, Product } from '../../types';

interface BrandDashboardProps {
  currentUser: User;
  brands: Brand[];
  salesPoints: SalesPoint[];
  orders: Order[];
  products: Product[];
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({
  currentUser,
  brands,
  salesPoints,
  orders,
  products,
}) => {
  const myBrand =
    brands.find((b) => b.id === currentUser.brandId) || brands[0];

  const brandProducts = products.filter((p) => p.brandId === myBrand.id);

  // Find sales points that distribute this brand
  const partnerSalesPoints = salesPoints.filter((sp) =>
    sp.products.some((p) => p.product.brandId === myBrand.id)
  );

  // Total volume distributed
  const distributedOrders = orders.filter((o) => o.status === 'DELIVERED');
  let totalDistributedKg = 0;
  let totalDistributedUnits = 0;

  distributedOrders.forEach((o) => {
    o.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.brandId === myBrand.id) {
        totalDistributedUnits += item.quantity;
        const weightNum = parseFloat(prod.weight) || 12.5;
        totalDistributedKg += weightNum * item.quantity;
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Brand Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl text-white font-bold shadow-md"
            style={{ backgroundColor: myBrand.color }}
          >
            {myBrand.logo || '🔥'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{myBrand.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Fournisseur Partenaire Agréé
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Siège : {myBrand.headquarters} • Support technique : {myBrand.supportPhone}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-100 rounded-2xl text-xs font-bold text-slate-700">
          Distribution Réseau Multi-Dépôts
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Volume Marque Distribué
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {totalDistributedKg.toLocaleString('fr-FR')} kg
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {totalDistributedUnits} bouteilles livrées / retirées
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Points de Vente Partenaires
          </span>
          <div className="text-2xl font-extrabold text-orange-600 mt-1">{partnerSalesPoints.length}</div>
          <span className="text-[10px] text-slate-500">Stations & dépôts agréés</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Formats Référencés
          </span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{brandProducts.length}</div>
          <span className="text-[10px] text-slate-500">Bouteilles certifiées</span>
        </div>
      </div>

      {/* Partner Sales Points List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Réseau des Stations & Dépôts Distribuant {myBrand.name} ({partnerSalesPoints.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {partnerSalesPoints.map((sp) => {
            const stockInSp = sp.products
              .filter((p) => p.product.brandId === myBrand.id)
              .reduce((sum, p) => sum + p.stock, 0);

            return (
              <div key={sp.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{sp.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{sp.address} ({sp.neighborhood}, {sp.city})</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">{stockInSp} bouteilles en stock</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Note : {sp.rating} ★</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
