import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Search,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Truck,
  Clock,
  Star,
  Flame,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Store,
  Layers,
  ArrowUpDown,
  RotateCcw,
  ChevronDown,
  List,
  Map as MapIcon,
  Plus,
  ShoppingCart,
  Check,
} from 'lucide-react';
import { SalesPoint, Brand, CylinderSize, Coordinates, Product } from '../../types';
import { calculateDistanceKm, formatDistance } from '../../services/geo';

interface GasSearchMapProps {
  salesPoints: SalesPoint[];
  brands: Brand[];
  products: Product[];
  userLocation?: Coordinates;
  isGpsActive?: boolean;
  onRequestGPS?: () => void;
  onSelectSalesPoint: (sp: SalesPoint) => void;
  onAddToCart?: (product: Product, sp: SalesPoint, quantity: number) => void;
}

export const GasSearchMap: React.FC<GasSearchMapProps> = ({
  salesPoints,
  brands,
  products,
  userLocation: propLocation,
  isGpsActive: propGpsActive,
  onRequestGPS: propRequestGPS,
  onSelectSalesPoint,
  onAddToCart,
}) => {
  const [internalLocation, setInternalLocation] = useState<Coordinates>({
    lat: 4.0511,
    lng: 9.7085,
  });
  const [internalGpsActive, setInternalGpsActive] = useState<boolean>(false);

  const userLocation = propLocation || internalLocation;
  const isGpsActive = propGpsActive !== undefined ? propGpsActive : internalGpsActive;

  const handleRequestGPS = () => {
    if (propRequestGPS) {
      propRequestGPS();
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setInternalLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setInternalGpsActive(true);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable', err);
          setInternalLocation({ lat: 4.0511, lng: 9.7085 });
        }
      );
    }
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('ALL');
  const [selectedWeight, setSelectedWeight] = useState<CylinderSize | 'ALL'>('ALL');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(true);
  const [onlyDelivery, setOnlyDelivery] = useState<boolean>(false);
  const [selectedSalesPointId, setSelectedSalesPointId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  // Compute distances & filter sales points
  const filteredSalesPoints = useMemo(() => {
    return salesPoints
      .map((sp) => {
        const distance = calculateDistanceKm(userLocation, sp.coordinates);
        return { ...sp, currentDistance: distance };
      })
      .filter((sp) => {
        // Admin validation filter (only verified points visible to client)
        if (!sp.isVerified) return false;

        // Radius filter
        if (sp.currentDistance > radiusKm) return false;

        // Search query filter (name, city, neighborhood, address)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = sp.name.toLowerCase().includes(q);
          const matchesAddress = sp.address.toLowerCase().includes(q);
          const matchesCity = sp.city.toLowerCase().includes(q);
          const matchesNeighborhood = sp.neighborhood.toLowerCase().includes(q);
          const matchesBrand = sp.products.some((p) => p.product.brandName.toLowerCase().includes(q));
          if (!matchesName && !matchesAddress && !matchesCity && !matchesNeighborhood && !matchesBrand) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrandId !== 'ALL') {
          const hasBrand = sp.products.some((p) => p.product.brandId === selectedBrandId);
          if (!hasBrand) return false;
        }

        // Weight filter
        if (selectedWeight !== 'ALL') {
          const hasWeight = sp.products.some((p) => p.product.weight === selectedWeight);
          if (!hasWeight) return false;
        }

        // In Stock filter
        if (onlyInStock) {
          const hasMatchingStock = sp.products.some((p) => {
            const matchesBrand = selectedBrandId === 'ALL' || p.product.brandId === selectedBrandId;
            const matchesWeight = selectedWeight === 'ALL' || p.product.weight === selectedWeight;
            return matchesBrand && matchesWeight && p.stock > 0 && p.isAvailable;
          });
          if (!hasMatchingStock) return false;
        }

        // Delivery filter
        if (onlyDelivery && !sp.offersDelivery) return false;

        return true;
      })
      .sort((a, b) => a.currentDistance - b.currentDistance);
  }, [salesPoints, userLocation, radiusKm, searchQuery, selectedBrandId, selectedWeight, onlyInStock, onlyDelivery]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Update User Position Marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
        <div class="relative w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[11px] font-bold">
          📍
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'user-pulse-marker',
      html: userIconHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(
        `<div class="p-2 text-xs font-semibold text-slate-800">
          <span class="text-blue-600 font-bold">● Votre position</span><br/>
          Latitude: ${userLocation.lat.toFixed(4)}<br/>
          Longitude: ${userLocation.lng.toFixed(4)}
        </div>`
      );

    // Clear old sales points markers
    Object.values(markersRef.current).forEach((m: any) => m && typeof m.remove === 'function' && m.remove());
    markersRef.current = {};

    // Add Sales Point Markers
    filteredSalesPoints.forEach((sp) => {
      const inStockProducts = sp.products.filter((p) => p.stock > 0 && p.isAvailable);
      const hasStock = inStockProducts.length > 0;

      const markerHtml = `
        <div class="group relative cursor-pointer transform hover:scale-110 transition-transform">
          <div class="w-9 h-9 rounded-2xl ${
            hasStock ? 'bg-orange-600' : 'bg-slate-500'
          } border-2 border-white shadow-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
          </div>
          <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full ${
            hasStock ? 'bg-emerald-500' : 'bg-rose-500'
          } border-2 border-white"></span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-sp-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([sp.coordinates.lat, sp.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `
          <div class="w-64 p-3 bg-white">
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <h4 class="font-bold text-slate-900 text-sm leading-tight">${sp.name}</h4>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${
                hasStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }">${hasStock ? 'En stock' : 'Rupture'}</span>
            </div>
            <p class="text-xs text-slate-500 mb-2">${sp.address} (${formatDistance(sp.currentDistance)})</p>
            <div class="text-xs font-semibold text-slate-700 bg-slate-50 p-1.5 rounded-lg mb-2">
              🔥 ${sp.products.length} marques/produits disponibles
            </div>
            <button id="popup-btn-${sp.id}" class="w-full py-1.5 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold text-center block shadow-xs">
              Consulter le stock & Commander
            </button>
          </div>
        `,
          { className: 'custom-map-popup' }
        );

      marker.on('popupopen', () => {
        setSelectedSalesPointId(sp.id);
        const btn = document.getElementById(`popup-btn-${sp.id}`);
        if (btn) {
          btn.onclick = () => onSelectSalesPoint(sp);
        }
      });

      markersRef.current[sp.id] = marker;
    });

    if (filteredSalesPoints.length > 0 && userMarkerRef.current) {
      const group = new L.FeatureGroup([
        userMarkerRef.current,
        ...Object.values(markersRef.current),
      ]);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [filteredSalesPoints, userLocation]);

  const handleCardClick = (sp: SalesPoint) => {
    setSelectedSalesPointId(sp.id);
    if (mapInstanceRef.current && markersRef.current[sp.id]) {
      mapInstanceRef.current.setView([sp.coordinates.lat, sp.coordinates.lng], 15, { animate: true });
      markersRef.current[sp.id].openPopup();
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrandId('ALL');
    setSelectedWeight('ALL');
    setRadiusKm(10);
    setOnlyInStock(true);
    setOnlyDelivery(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pb-14 lg:pb-0 bg-slate-50 overflow-hidden">
      {/* Top Filter & Search Section */}
      <section className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-3 shrink-0 shadow-xs z-20">
        <div className="max-w-7xl mx-auto space-y-2.5">
          {/* Row 1: Search Bar + GPS + Radius + Mobile View Switcher */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une marque, quartier, station (ex: Tradex Akwa, Total, Bonapriso...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white rounded-xl text-xs sm:text-sm font-medium border border-transparent focus:border-orange-500 focus:outline-hidden transition-all placeholder:text-slate-400"
                id="search-gas-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* GPS Trigger & Radius Picker */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={handleRequestGPS}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isGpsActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                }`}
                id="gps-trigger-btn"
                title="Actualiser ma position GPS"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isGpsActive ? 'GPS Actif' : 'Activer GPS'}</span>
              </button>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1.5 font-bold">Rayon :</span>
                {[3, 5, 10, 20].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusKm(r)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      radiusKm === r
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>

              {/* Mobile View Switcher (List vs Map) */}
              <div className="flex lg:hidden items-center bg-slate-100 p-1 rounded-xl text-xs shrink-0 border border-slate-200/80">
                <button
                  onClick={() => setMobileTab('list')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    mobileTab === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Liste</span>
                </button>
                <button
                  onClick={() => {
                    setMobileTab('map');
                    setTimeout(() => {
                      mapInstanceRef.current?.invalidateSize();
                    }, 100);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    mobileTab === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Carte</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Dropdowns (Marque, Format) + Toggles */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            {/* Dropdown 1: Marque */}
            <div className="relative flex items-center gap-1.5">
              <label
                htmlFor="brand-select"
                className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Marque :</span>
              </label>
              <div className="relative">
                <select
                  id="brand-select"
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className={`appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-hidden ${
                    selectedBrandId !== 'ALL'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs ring-2 ring-orange-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border-slate-200 focus:border-slate-400'
                  }`}
                >
                  <option value="ALL" className="bg-white text-slate-800 font-semibold">
                    Toutes les marques ({brands.length})
                  </option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id} className="bg-white text-slate-800 font-medium">
                      {b.logo} {b.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                    selectedBrandId !== 'ALL' ? 'text-white' : 'text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0 mx-1 hidden sm:block"></div>

            {/* Dropdown 2: Format */}
            <div className="relative flex items-center gap-1.5">
              <label
                htmlFor="weight-select"
                className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Format :</span>
              </label>
              <div className="relative">
                <select
                  id="weight-select"
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value as CylinderSize | 'ALL')}
                  className={`appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-hidden ${
                    selectedWeight !== 'ALL'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border-slate-200 focus:border-slate-400'
                  }`}
                >
                  <option value="ALL" className="bg-white text-slate-800 font-semibold">
                    Tous les formats
                  </option>
                  <option value="6kg" className="bg-white text-slate-800 font-medium">
                    6 kg (Mini)
                  </option>
                  <option value="12.5kg" className="bg-white text-slate-800 font-medium">
                    12.5 kg (Standard)
                  </option>
                  <option value="28kg" className="bg-white text-slate-800 font-medium">
                    28 kg (Moyen)
                  </option>
                  <option value="50kg" className="bg-white text-slate-800 font-medium">
                    50 kg (Grand / Pro)
                  </option>
                </select>
                <ChevronDown
                  className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                    selectedWeight !== 'ALL' ? 'text-white' : 'text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0 mx-1 hidden sm:block"></div>

            {/* Toggle: En stock */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                onlyInStock
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>En stock</span>
            </button>

            {/* Toggle: Livraison */}
            <button
              onClick={() => setOnlyDelivery(!onlyDelivery)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                onlyDelivery
                  ? 'bg-blue-50 text-blue-800 border border-blue-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Livraison à domicile</span>
            </button>

            {/* Reset Filters */}
            {(selectedBrandId !== 'ALL' || selectedWeight !== 'ALL' || searchQuery || onlyDelivery || !onlyInStock) && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-full font-bold flex items-center gap-1 shrink-0 ml-auto transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout: Responsive Split View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Results List */}
        <div
          className={`w-full lg:w-[480px] xl:w-[520px] shrink-0 h-full overflow-y-auto bg-slate-50 border-r border-slate-200 p-3 sm:p-4 space-y-3.5 ${
            mobileTab === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              {filteredSalesPoints.length} point{filteredSalesPoints.length > 1 ? 's' : ''} de vente (≤ {radiusKm} km)
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Tri par distance
            </span>
          </div>

          {filteredSalesPoints.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 mt-4 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Aucun dépôt ne correspond à ces critères</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Élargissez votre rayon kilométrique ou modifiez le filtre de marque.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredSalesPoints.map((sp) => {
              const isSelected = sp.id === selectedSalesPointId;
              const inStockProducts = sp.products.filter((p) => p.stock > 0 && p.isAvailable);

              return (
                <div
                  key={sp.id}
                  onClick={() => handleCardClick(sp)}
                  className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  id={`sp-card-${sp.id}`}
                >
                  {/* Top line: Depot Name, Badge, Distance */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                          {sp.name}
                        </h3>
                        {sp.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Agréé
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{sp.address}, {sp.neighborhood}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-xl bg-orange-100 text-orange-950 font-black text-xs block">
                        {formatDistance(sp.currentDistance)}
                      </span>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        <span>{sp.rating}</span>
                        <span className="text-slate-400 font-normal">({sp.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Inventory Pills */}
                  <div className="my-2.5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Disponibilités en stock :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sp.products.map((item) => {
                        const inStock = item.stock > 0 && item.isAvailable;
                        const isMatch =
                          (selectedBrandId === 'ALL' || item.product.brandId === selectedBrandId) &&
                          (selectedWeight === 'ALL' || item.product.weight === selectedWeight);

                        return (
                          <div
                            key={item.productId}
                            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                              inStock
                                ? isMatch
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-1 ring-emerald-400'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-rose-50 text-rose-600 border-rose-200 opacity-60 line-through'
                            }`}
                          >
                            <span className="font-bold">{item.product.brandName.split(' ')[0]}</span>
                            <span className="text-[11px] font-normal">{item.product.weight}</span>
                            <span className="font-black text-orange-600">
                              {item.price.toLocaleString('fr-FR')} F
                            </span>
                            {inStock ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                                {item.stock}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1 rounded">
                                0
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className={sp.isOpen ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                          {sp.isOpen ? 'Ouvert' : 'Fermé'}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-slate-400" />
                        <span>{sp.offersDelivery ? `Livraison dès ${sp.deliveryBaseFee} F` : 'Retrait seul'}</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSalesPoint(sp);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                      id={`choose-sp-btn-${sp.id}`}
                    >
                      <span>Commander</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Leaflet Interactive Map */}
        <div
          className={`flex-1 h-full relative bg-slate-200 ${
            mobileTab === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div ref={mapContainerRef} className="w-full h-full" id="interactive-leaflet-map" />

          {/* Floating Pill on Map */}
          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{filteredSalesPoints.length} dépôts affichés</span>
          </div>
        </div>
      </div>
    </div>
  );
};
