export const FIXED_LOT_WIDTH = 15
export const FIXED_LOT_DEPTH = 18
export const NEIGHBOUR_LOT_GAP = 1.2
export const FIXED_DRIVEWAY_WIDTH = 5.1

export function getFixedLotOffset(side = 0) {
  return side * (FIXED_LOT_WIDTH + NEIGHBOUR_LOT_GAP)
}
