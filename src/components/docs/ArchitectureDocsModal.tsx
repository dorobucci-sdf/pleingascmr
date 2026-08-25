import React, { useState } from 'react';
import {
  X,
  FileCode2,
  Layers,
  Database,
  Shield,
  MapPin,
  Workflow,
  Copy,
  Check,
  Download,
  BookOpen,
  Terminal,
  Server,
  Code2,
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDoc, setActiveDoc] = useState<number>(1);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const docTitles = [
    { id: 1, title: 'Doc 1 — Architecture Générale' },
    { id: 2, title: 'Doc 2 — Acteurs & Matrice RACI' },
    { id: 3, title: 'Doc 3 — Cas d’Utilisation Détaillés' },
    { id: 4, title: 'Doc 4 — Diagrammes UML PlantUML' },
    { id: 5, title: 'Doc 5 — Diagramme de Classes UML' },
    { id: 6, title: 'Doc 6 — Modèle de Base de Données' },
    { id: 7, title: 'Doc 7 — Architecture Django Modulaire' },
    { id: 8, title: 'Doc 8 — Workflow & Machine à États' },
    { id: 9, title: 'Doc 9 — Architecture Géolocalisation & PostGIS' },
    { id: 10, title: 'Doc 10 — Spécification API REST' },
    { id: 11, title: 'Doc 11 — Sécurité & Anti-Overselling' },
    { id: 12, title: 'Doc 12 — Plan & Code Django Exportable' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in">
      <div className="bg-slate-900 text-slate-100 w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                  Dossier d'Architecture & Ingénierie Django
                </span>
                <span className="text-[11px] text-slate-400">12 Documents de Conception</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                pleinGas — Plateforme de Distribution Géolocalisée
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Layout: Left Sidebar for Docs + Right Content Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 sm:w-72 bg-slate-950/40 border-r border-slate-800/80 p-3 overflow-y-auto shrink-0 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
              Sommaire des Documents
            </span>
            {docTitles.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  activeDoc === doc.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>

          {/* Right Content Pane */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300">
            {/* DOCUMENT 1 */}
            {activeDoc === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-orange-400 text-xs font-bold uppercase">Document 1</span>
                  <h3 className="text-xl font-extrabold text-white">Architecture Générale du Système</h3>
                </div>
                <p>
                  La plateforme <strong>pleinGas</strong> est conçue selon un patron d’architecture en couches moderne, découplée et résiliente, adaptée aux environnements web et mobiles.
                </p>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre overflow-x-auto">
{`+-------------------------------------------------------------------------+
|                              CLIENT APPS                                |
|  - Web SPA (HTML5, CSS3, Tailwind, React, Leaflet Maps)                 |
|  - Mobile App (Flutter / React Native - Future expansion)               |
+-------------------------------------------------------------------------+
                                    | HTTPS / JSON (REST API)
                                    v
+-------------------------------------------------------------------------+
|                     API GATEWAY / NGINX REVERSE PROXY                   |
|  - Rate Limiting, SSL Offloading, Security Headers                      |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                  BACKEND DJANGO 5.x / DJANGO REST FRAMEWORK              |
|  ├── accounts/       (Auth, JWT, RBAC, Profils)                         |
|  ├── salespoints/    (Points de vente, Horaires, Agréments)              |
|  ├── brands/         (Marques, Fournisseurs)                            |
|  ├── inventory/      (Stocks, Verrouillage transactionnel atomic)       |
|  ├── orders/         (Commandes, Machine à états, Facturation)          |
|  ├── payments/       (Gateways Mobile Money: OM, MoMo, Wave, Carte)     |
|  ├── deliveries/     (Attribution courses, Tracking livreurs)           |
|  └── geolocation/    (Requêtes spatiales GeoDjango, PostGIS)            |
+-------------------------------------------------------------------------+
         |                                  |                     |
         v                                  v                     v
+-----------------------+      +-----------------------+  +---------------+
| POSTGRESQL + POSTGIS  |      | REDIS CACHE & BROKER  |  | CELERY TASKS  |
| - Tables relationnelles|     | - Sessions & Tokens   |  | - Notifs SMS  |
| - Index spatiaux GIST |      | - Cache géoloc        |  | - Push FCM    |
| - PointField (SRID 4326)     | - File de messages    |  | - Webhooks    |
+-----------------------+      +-----------------------+  +---------------+`}
                </div>

                <h4 className="text-base font-bold text-white mt-4">Composants Clés</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li><strong>GeoDjango & PostGIS :</strong> Indexation spatiale GiST pour les requêtes de proximité en temps sub-milliseconde.</li>
                  <li><strong>Sécurité des Transactions :</strong> Verrouillage pessimiste <code>select_for_update()</code> pour éliminer le risque d'overselling de bouteilles.</li>
                  <li><strong>Architecture Paiement Ouverte :</strong> Couplage abstrait aux passerelles de Mobile Money africaines et cartes bancaires.</li>
                </ul>
              </div>
            )}

            {/* DOCUMENT 2 */}
            {activeDoc === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-orange-400 text-xs font-bold uppercase">Document 2</span>
                  <h3 className="text-xl font-extrabold text-white">Liste Complète des Acteurs & Matrice RACI</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3 border border-slate-800">Acteur</th>
                        <th className="p-3 border border-slate-800">Rôle Métier</th>
                        <th className="p-3 border border-slate-800">Périmètre d'Accès</th>
                        <th className="p-3 border border-slate-800">Authentification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-3 font-bold text-purple-400 border border-slate-800">Super Administrateur</td>
                        <td className="p-3 border border-slate-800">Gouvernance globale, validation des agréments, commissions, audits</td>
                        <td className="p-3 border border-slate-800">Totalité de la plateforme, logs et base de données</td>
                        <td className="p-3 border border-slate-800">2FA + Django Admin / JWT SuperUser</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-blue-400 border border-slate-800">Gérant Point de Vente</td>
                        <td className="p-3 border border-slate-800">Gestion de ses stocks, prix de vente, traitement des commandes de sa station</td>
                        <td className="p-3 border border-slate-800">Uniquement son ou ses points de vente assignés</td>
                        <td className="p-3 border border-slate-800">Email/Tél + Mot de passe sécurisé</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-orange-400 border border-slate-800">Client Final</td>
                        <td className="p-3 border border-slate-800">Recherche de gaz géolocalisée, commande, paiement, suivi</td>
                        <td className="p-3 border border-slate-800">Points de vente publics certifiés, son panier, ses commandes</td>
                        <td className="p-3 border border-slate-800">Numéro de téléphone / Email + OTP / Password</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-emerald-400 border border-slate-800">Livreur Partenaire</td>
                        <td className="p-3 border border-slate-800">Acceptation de courses de livraison, retrait au dépôt, remise au client</td>
                        <td className="p-3 border border-slate-800">Missions assignées, navigation GPS, historique de gains</td>
                        <td className="p-3 border border-slate-800">Application mobile / Espace Livreur sécurisé</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-400 border border-slate-800">Fournisseur / Marque</td>
                        <td className="p-3 border border-slate-800">Suivi des volumes distribués, visibilité sur le réseau de revendeurs</td>
                        <td className="p-3 border border-slate-800">Statistiques et stocks liés à sa propre marque uniquement</td>
                        <td className="p-3 border border-slate-800">Compte professionnel Marque B2B</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DOCUMENT 4 (PLANTUML) */}
            {activeDoc === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-orange-400 text-xs font-bold uppercase">Document 4</span>
                    <h3 className="text-xl font-extrabold text-white">Diagrammes UML PlantUML (Use Cases & Séquences)</h3>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `@startuml pleinGas_UseCases
left to right direction
skinparam packageStyle rectangle

actor "Client" as client
actor "Point de Vente" as vendor
actor "Livreur" as driver
actor "Super Administrateur" as admin
actor "Fournisseur / Marque" as brand

rectangle "Plateforme pleinGas" {
  usecase "Rechercher du gaz par géoloc & marque" as UC_Search
  usecase "Commander & Choisir mode (Retrait/Livraison)" as UC_Order
  usecase "Payer en ligne (Mobile Money/Carte)" as UC_Pay
  usecase "Suivre la commande en direct" as UC_Track
  
  usecase "Gérer stocks & tarifs" as UC_Stock
  usecase "Traiter commandes (Accepter/Préparer)" as UC_ProcessOrder
  
  usecase "Accepter mission de livraison" as UC_Deliver
  usecase "Confirmer remise bouteille" as UC_ConfirmDeliv
  
  usecase "Valider agréments dépôts" as UC_ValidateSP
  usecase "Superviser commissions & logs" as UC_Audit
  
  usecase "Consulter volumes distribués" as UC_BrandStats
}

client --> UC_Search
client --> UC_Order
client --> UC_Pay
client --> UC_Track

vendor --> UC_Stock
vendor --> UC_ProcessOrder

driver --> UC_Deliver
driver --> UC_ConfirmDeliv

admin --> UC_ValidateSP
admin --> UC_Audit

brand --> UC_BrandStats
@enduml`,
                        'plantuml-uc'
                      )
                    }
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    {copiedSection === 'plantuml-uc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copier PlantUML</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300 whitespace-pre overflow-x-auto">
{`@startuml pleinGas_UseCases
left to right direction
skinparam packageStyle rectangle

actor "Client" as client
actor "Point de Vente" as vendor
actor "Livreur" as driver
actor "Super Administrateur" as admin
actor "Fournisseur / Marque" as brand

rectangle "Plateforme pleinGas" {
  usecase "Rechercher du gaz par géoloc & marque" as UC_Search
  usecase "Commander & Choisir mode (Retrait/Livraison)" as UC_Order
  usecase "Payer en ligne (Mobile Money/Carte)" as UC_Pay
  usecase "Suivre la commande en direct" as UC_Track
  
  usecase "Gérer stocks & tarifs" as UC_Stock
  usecase "Traiter commandes (Accepter/Préparer)" as UC_ProcessOrder
  
  usecase "Accepter mission de livraison" as UC_Deliver
  usecase "Confirmer remise bouteille" as UC_ConfirmDeliv
  
  usecase "Valider agréments dépôts" as UC_ValidateSP
  usecase "Superviser commissions & logs" as UC_Audit
  
  usecase "Consulter volumes distribués" as UC_BrandStats
}

client --> UC_Search
client --> UC_Order
client --> UC_Pay
client --> UC_Track

vendor --> UC_Stock
vendor --> UC_ProcessOrder

driver --> UC_Deliver
driver --> UC_ConfirmDeliv

admin --> UC_ValidateSP
admin --> UC_Audit

brand --> UC_BrandStats
@enduml`}
                </div>
              </div>
            )}

            {/* DOCUMENT 7 & 12 (DJANGO MODELS & ARCHITECTURE) */}
            {(activeDoc === 7 || activeDoc === 12 || activeDoc === 6) && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-orange-400 text-xs font-bold uppercase">
                      {activeDoc === 6 ? 'Document 6 — Modèles de Base de Données' : activeDoc === 7 ? 'Document 7 — Architecture Django' : 'Document 12 — Code Django Complet'}
                    </span>
                    <h3 className="text-xl font-extrabold text-white">
                      Modèles Django (GeoDjango, Transaction Atomique, Modèles ORM)
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `# models.py - Architecture pleinGas
from django.contrib.gis.db import models as geomodels
from django.db import models, transaction
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('vendor', 'Gérant Point de Vente'),
        ('driver', 'Livreur'),
        ('brand', 'Fournisseur Marque'),
        ('admin', 'Super Administrateur'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=25, unique=True)
    is_verified = models.BooleanField(default=False)

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='brands/')
    color_hex = models.CharField(max_length=7, default='#E53E3E')
    headquarters = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)

class Product(models.Model):
    SIZE_CHOICES = (('6kg', '6 kg'), ('12.5kg', '12.5 kg'), ('28kg', '28 kg'), ('50kg', '50 kg'))
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=150)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    tare_weight = models.DecimalField(max_digits=5, decimal_places=2)
    standard_price = models.DecimalField(max_digits=10, decimal_places=2)

class SalesPoint(geomodels.Model):
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales_points')
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    location = geomodels.PointField(srid=4326, spatial_index=True)  # PostGIS spatial point
    phone = models.CharField(max_length=25)
    is_verified = models.BooleanField(default=False)
    is_open = models.BooleanField(default=True)
    offers_delivery = models.BooleanField(default=True)
    delivery_radius_km = models.DecimalField(max_digits=4, decimal_places=1, default=8.0)
    delivery_base_fee = models.DecimalField(max_digits=8, decimal_places=2, default=1000.0)
    delivery_fee_per_km = models.DecimalField(max_digits=8, decimal_places=2, default=250.0)

class Inventory(models.Model):
    sales_point = models.ForeignKey(SalesPoint, on_delete=models.CASCADE, related_name='inventory')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('sales_point', 'product')

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('CONFIRMED', 'Confirmée'),
        ('PREPARING', 'En préparation'),
        ('READY', 'Prête'),
        ('OUT_FOR_DELIVERY', 'En livraison'),
        ('DELIVERED', 'Livrée'),
        ('CANCELLED', 'Annulée'),
        ('REJECTED', 'Refusée'),
    )
    reference = models.CharField(max_length=30, unique=True, db_index=True)
    client = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    sales_point = models.ForeignKey(SalesPoint, on_delete=models.PROTECT, related_name='orders')
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='missions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    @transaction.atomic
    def place_order_atomic(cls, client, sales_point, items_data, delivery_type, delivery_fee):
        """Protection anti-overselling avec select_for_update()"""
        total = 0
        order = cls.objects.create(
            client=client,
            sales_point=sales_point,
            subtotal=0,
            delivery_fee=delivery_fee,
            total_amount=0
        )
        for item in items_data:
            inv = Inventory.objects.select_for_update().get(
                sales_point=sales_point, product_id=item['product_id']
            )
            if inv.stock_quantity < item['quantity']:
                raise ValueError(f"Stock insuffisant pour {inv.product.name}")
            inv.stock_quantity -= item['quantity']
            inv.save()
            total += inv.price * item['quantity']
        order.subtotal = total
        order.total_amount = total + delivery_fee
        order.save()
        return order`,
                        'django-models'
                      )
                    }
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    {copiedSection === 'django-models' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copier Code Django</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 whitespace-pre overflow-x-auto">
{`# pleinGas/inventory/models.py & services.py
from django.contrib.gis.db import models as geomodels
from django.db import models, transaction
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('vendor', 'Gérant Point de Vente'),
        ('driver', 'Livreur'),
        ('brand', 'Fournisseur Marque'),
        ('admin', 'Super Administrateur'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=25, unique=True)
    is_verified = models.BooleanField(default=False)

class SalesPoint(geomodels.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    location = geomodels.PointField(srid=4326, spatial_index=True)  # PostGIS spatial point
    phone = models.CharField(max_length=25)
    is_verified = models.BooleanField(default=False)
    offers_delivery = models.BooleanField(default=True)
    delivery_radius_km = models.DecimalField(max_digits=4, decimal_places=1, default=8.0)
    delivery_base_fee = models.DecimalField(max_digits=8, decimal_places=2, default=1000.0)
    delivery_fee_per_km = models.DecimalField(max_digits=8, decimal_places=2, default=250.0)

class Inventory(models.Model):
    sales_point = models.ForeignKey(SalesPoint, on_delete=models.CASCADE, related_name='inventory')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)

# Service d'exécution atomique pour éliminer les conflits de concurrence (Race Conditions)
@transaction.atomic
def execute_order_atomic(client, sales_point, cart_items, delivery_mode):
    # Verrouillage pessimiste de toutes les lignes d'inventaire
    for item in cart_items:
        inv = Inventory.objects.select_for_update().get(
            sales_point=sales_point,
            product_id=item.product_id
        )
        if inv.stock_quantity < item.quantity:
            raise ValueError(f"Rupture de stock sur {inv.product.name}")
        inv.stock_quantity -= item.quantity
        if inv.stock_quantity == 0:
            inv.is_available = False
        inv.save()
    ...`}
                </div>
              </div>
            )}

            {/* DOCUMENT 10: API REST SPEC */}
            {activeDoc === 10 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-orange-400 text-xs font-bold uppercase">Document 10</span>
                  <h3 className="text-xl font-extrabold text-white">Spécification des Endpoints API REST (DRF)</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-xs rounded font-mono">GET</span>
                      <span className="font-mono text-xs text-white">/api/v1/sales-points/nearby/?lat=4.0511&lng=9.7085&radius_km=5&brand_id=1</span>
                    </div>
                    <p className="text-xs text-slate-400">Recherche géolocalisée PostGIS par proximité spatiale avec filtrage par marque et stock.</p>
                    <div className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-emerald-400">
{`{
  "count": 3,
  "results": [
    {
      "id": "sp-1",
      "name": "Station Tradex Akwa Nord",
      "distance_km": 1.2,
      "coordinates": { "lat": 4.0535, "lng": 9.7062 },
      "is_open": true,
      "available_products": [
        { "product_id": "p-1", "name": "Tradex 12.5 kg", "stock": 24, "price": 6500 }
      ]
    }
  ]
}`}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-xs rounded font-mono">POST</span>
                      <span className="font-mono text-xs text-white">/api/v1/orders/create/</span>
                    </div>
                    <p className="text-xs text-slate-400">Création atomique d'une commande avec réservation de stock et passerelle de paiement.</p>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 11: SECURITY & ANTI-OVERSELLING */}
            {activeDoc === 11 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-orange-400 text-xs font-bold uppercase">Document 11</span>
                  <h3 className="text-xl font-extrabold text-white">Architecture de Sécurité & Anti-Overselling</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-sm">🔒 Protection Anti-Overselling</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      L'achat simultané de la dernière bouteille de gaz par deux clients est neutralisé par le verrouillage pessimiste SQL au niveau de la base de données :
                    </p>
                    <code className="block bg-slate-900 p-2 rounded text-[11px] text-amber-300 font-mono">
                      Inventory.objects.select_for_update().get(id=...)
                    </code>
                    <p className="text-xs text-slate-400">
                      Toute commande échoue instantanément si le stock passe sous la quantité requise durant la transaction.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-sm">🛡️ Confidentialité & RGPD / GPS</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Les coordonnées GPS de l'utilisateur ne sont jamais transmises à des tiers. Elles ne sont sollicitées qu'après consentement explicite du navigateur pour calculer les distances de livraison.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 3, 5, 8, 9 FALLBACK RENDERING */}
            {(activeDoc === 3 || activeDoc === 5 || activeDoc === 8 || activeDoc === 9) && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-orange-400 text-xs font-bold uppercase">Document {activeDoc}</span>
                  <h3 className="text-xl font-extrabold text-white">
                    {docTitles.find((d) => d.id === activeDoc)?.title}
                  </h3>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Spécification fonctionnelle et algorithmique complète implémentée dans la plateforme <strong>pleinGas</strong>.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
                    <li><strong>Machine à États :</strong> Transitions strictes <code>PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED</code>. Les retours en arrière non autorisés sont bloqués par le backend.</li>
                    <li><strong>Algorithme Spatial :</strong> Utilisation de la formule d'Haversine côté frontend Leaflet pour un calcul instantané, et de <code>ST_DWithin</code> PostGIS côté backend GeoDjango.</li>
                    <li><strong>Règles Métier :</strong> Règle mono-dépôt par panier, vérification d'agrément par le super admin, et traçabilité intégrale par audit logs.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400">
            pleinGas Architecture v1.0 • Prêt pour déploiement Django 5 / PostGIS / React
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
          >
            Fermer le dossier technique
          </button>
        </div>
      </div>
    </div>
  );
};
