import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const HOUSE_MODEL_URL = '/models/house.glb'
const HOUSE_SCALE_MULTIPLIER = 1.44
const HOUSE_WIDTH_METERS = 9.5 * HOUSE_SCALE_MULTIPLIER
const HOUSE_HEIGHT_METERS = 4.8 * HOUSE_SCALE_MULTIPLIER
const HOUSE_DEPTH_METERS = 7.0 * HOUSE_SCALE_MULTIPLIER

function getNeighborOffset(cfg, side) {
  const lotWidth = Math.max(cfg.width + 7, 12)
  return side * (lotWidth + 1.2)
}

export function loadHouseModel(scene, cfg, callbacks = {}) {
  const variant = callbacks.variant ?? 'main'
  return loadGlbModel({
    scene,
    cfg,
    url: HOUSE_MODEL_URL,
    name: callbacks.name ?? (variant === 'main' ? 'Residential house' : `${variant} residential house`),
    updateTransform: (group, currentCfg) => updateHouseModel(group, currentCfg, variant),
    normalize: normalizeHouseModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  })
}

export function updateHouseModel(houseGroup, cfg, variant = 'main') {
  if (!houseGroup) return

  const side = variant === 'left' ? -1 : variant === 'right' ? 1 : 0
  const x = side === 0 ? 0 : getNeighborOffset(cfg, side)
  const z = side === 0 ? -7.4 : -7.15
  const yaw = side === 0 ? Math.PI * 1.5 : Math.PI * 1.5 + side * 0.035

  houseGroup.position.set(x, 0.02, z)
  houseGroup.rotation.set(0, yaw, 0)
}

function normalizeHouseModel(model) {
  normalizeImportedModelByBoundingBox(model, {
    x: HOUSE_WIDTH_METERS,
    y: HOUSE_HEIGHT_METERS,
    z: HOUSE_DEPTH_METERS,
  })
}
