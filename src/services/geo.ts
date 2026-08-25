import { Coordinates } from '../types';

/**
 * Calculates the great-circle distance between two points in kilometers
 * using the Haversine formula.
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Common regional city presets for instant quick testing / GPS simulation
 */
export const CITY_PRESETS: { name: string; country: string; coordinates: Coordinates }[] = [
  {
    name: 'Douala (Akwa)',
    country: 'Cameroun',
    coordinates: { lat: 4.0511, lng: 9.7085 },
  },
  {
    name: 'Douala (Bonanjo / Deido)',
    country: 'Cameroun',
    coordinates: { lat: 4.0435, lng: 9.6918 },
  },
  {
    name: 'Yaoundé (Bastos / Centre)',
    country: 'Cameroun',
    coordinates: { lat: 3.8667, lng: 11.5167 },
  },
  {
    name: 'Abidjan (Cocody / Plateau)',
    country: "Côte d'Ivoire",
    coordinates: { lat: 5.3599, lng: -4.0083 },
  },
  {
    name: 'Dakar (Plateau / Almadies)',
    country: 'Sénégal',
    coordinates: { lat: 14.7167, lng: -17.4677 },
  },
  {
    name: 'Paris (Centre)',
    country: 'France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
];
