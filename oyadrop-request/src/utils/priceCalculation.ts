interface Coordinates {
  pickup: [number, number] | null;
  dropOff: [number, number] | null;
}

/**
 * Calculates the distance between two coordinates using the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Estimates the price based on the distance between pickup and dropOff locations
 * This is a simplified pricing model that can be adjusted based on actual business needs
 */
export function estimatePrice(coordinates: Coordinates): number | null {
  if (!coordinates.pickup || !coordinates.dropOff) {
    return null;
  }

  const [pickupLon, pickupLat] = coordinates.pickup;
  const [dropOffLon, dropOffLat] = coordinates.dropOff;

  // Calculate distance
  const distance = calculateDistance(
    pickupLat,
    pickupLon,
    dropOffLat,
    dropOffLon
  );

  // Base fare in Nigerian Naira
  const baseFare = 1000;

  // Rate per km (adjust as needed)
  const ratePerKm = 200;

  // Calculate price
  let estimatedPrice = baseFare + distance * ratePerKm;

  // Add a small random factor for realistic variation (±5%)
  const variation = Math.random() * 0.1 - 0.05;
  estimatedPrice = estimatedPrice * (1 + variation);

  // Round to nearest 100 Naira
  return Math.round(estimatedPrice / 100) * 100;
}

/**
 * Formats the price in Nigerian Naira
 */
export function formatPrice(price: number | null): string {
  if (price === null) return "N/A";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
