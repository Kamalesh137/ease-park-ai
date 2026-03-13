// Random Forest-inspired ML model for smart parking slot allocation
// Simulates a trained Random Forest model that predicts the best slot

import { FLOORS, getOccupiedSlots, type FloorLayout } from "@/data/userStore";

interface VehicleProfile {
  vehicle_type: "SUV" | "Sedan" | "Hatchback" | "Truck" | "Motorcycle" | "Van";
  car_length: number;
  car_width: number;
}

interface SlotCandidate {
  slotId: string;
  row: number;
  col: number;
  score: number;
}

// Slot dimension tiers (width multiplier)
const SLOT_SIZE_MAP: Record<string, number> = {
  Motorcycle: 0.5,
  Hatchback: 0.8,
  Sedan: 1.0,
  SUV: 1.3,
  Van: 1.4,
  Truck: 1.6,
};

/**
 * Feature extraction for each candidate slot — mirrors what a trained
 * Random Forest would evaluate across its decision trees.
 *
 * Features considered:
 *  1. Vehicle-slot size compatibility
 *  2. Distance from entry gate
 *  3. Floor occupancy ratio
 *  4. Neighboring slot congestion
 *  5. Vehicle type preference zone
 */
function extractFeatures(
  slot: { row: number; col: number; slotId: string },
  vehicle: VehicleProfile,
  floor: FloorLayout,
  occupiedSet: Set<string>,
  totalOccupied: number
): number {
  const totalSlots = floor.rows * floor.cols;
  const occupancyRatio = totalOccupied / totalSlots;

  // 1. Size compatibility score (0-30)
  const vehicleSize = SLOT_SIZE_MAP[vehicle.vehicle_type] ?? 1.0;
  const slotCapacity = 1.0; // uniform slots
  const sizeFit = vehicleSize <= slotCapacity ? 30 : Math.max(0, 30 - (vehicleSize - slotCapacity) * 40);

  // 2. Distance from entry (top-center) — closer = higher score (0-25)
  const entryRow = 0;
  const entryCol = Math.floor(floor.cols / 2);
  const manhattan = Math.abs(slot.row - entryRow) + Math.abs(slot.col - entryCol);
  const maxDist = floor.rows + floor.cols;
  const distScore = 25 * (1 - manhattan / maxDist);

  // 3. Floor occupancy penalty — prefer less crowded floors (0-15)
  const occupancyScore = 15 * (1 - occupancyRatio);

  // 4. Neighbor congestion — fewer occupied neighbors = better (0-15)
  let occupiedNeighbors = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = slot.row + dr;
      const nc = slot.col + dc;
      if (nr >= 0 && nr < floor.rows && nc >= 0 && nc < floor.cols) {
        const nId = `F${floor.floor}-${String.fromCharCode(65 + nr)}${nc + 1}`;
        if (occupiedSet.has(nId)) occupiedNeighbors++;
      }
    }
  }
  const congestionScore = 15 * (1 - occupiedNeighbors / 8);

  // 5. Vehicle-type zone preference (0-15)
  // Large vehicles prefer edge rows, small vehicles prefer center
  let zoneScore = 10;
  if (vehicleSize >= 1.3) {
    // Prefer last rows (easier maneuvering)
    zoneScore = slot.row >= floor.rows - 2 ? 15 : 5;
  } else if (vehicleSize <= 0.8) {
    // Prefer center columns
    const centerDist = Math.abs(slot.col - Math.floor(floor.cols / 2));
    zoneScore = 15 * (1 - centerDist / (floor.cols / 2));
  }

  // Random Forest ensemble: weighted sum of tree outputs + small randomness
  const noise = (Math.random() - 0.5) * 3; // simulates tree variance
  return sizeFit + distScore + occupancyScore + congestionScore + zoneScore + noise;
}

/**
 * Predict the best parking slot using Random Forest model.
 * Returns the slot ID with the highest predicted score.
 */
export function predictBestSlot(
  floor: number,
  vehicle: VehicleProfile
): { slotId: string; score: number; candidates: SlotCandidate[] } | null {
  const layout = FLOORS.find((f) => f.floor === floor);
  if (!layout) return null;

  const occupiedList = getOccupiedSlots(floor);
  const occupiedSet = new Set(occupiedList);

  const candidates: SlotCandidate[] = [];

  for (let r = 0; r < layout.rows; r++) {
    for (let c = 0; c < layout.cols; c++) {
      const slotId = `F${floor}-${String.fromCharCode(65 + r)}${c + 1}`;
      if (occupiedSet.has(slotId)) continue;

      const score = extractFeatures(
        { row: r, col: c, slotId },
        vehicle,
        layout,
        occupiedSet,
        occupiedList.length
      );

      candidates.push({ slotId, row: r, col: c, score });
    }
  }

  if (candidates.length === 0) return null;

  // Sort by score descending (Random Forest prediction)
  candidates.sort((a, b) => b.score - a.score);

  return { slotId: candidates[0].slotId, score: candidates[0].score, candidates };
}
