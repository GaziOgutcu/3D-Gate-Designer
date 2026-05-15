import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const CAR_MODEL_URL = '/models/car.glb'
const CAR_LENGTH_METERS = 4.4
const CAR_WIDTH_METERS = 1.8
const CAR_HEIGHT_METERS = 1.4

function getNeighborOffset(cfg, side) {
  const lotWidth = Math.max(cfg.width + 7, 12)
  return side * (lotWidth + 1.2)
}

export function loadCarModel(scene, cfg, callbacks = {}) {
  const variant = callbacks.variant ?? 'street'
  return loadGlbModel({
    scene,
    cfg,
    url: CAR_MODEL_URL,
    name: callbacks.name ?? (variant === 'driveway-right' ? 'Right driveway car' : 'Residential street car'),
    updateTransform: (group, currentCfg) => updateCarModel(group, currentCfg, variant),
    normalize: normalizeCarModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  })
}

export function updateCarModel(carGroup, cfg, variant = 'street') {
  if (!carGroup) return

  if (variant === 'driveway-right') {
    carGroup.position.set(getNeighborOffset(cfg, 1) + Math.min(cfg.width * 0.18, 0.8), 0.04, -2.05)
    carGroup.rotation.set(0, 0, 0)
    return
  }

  const lotWidth = Math.max(cfg.width + 7, 12)
  carGroup.position.set(Math.min(lotWidth * 0.34, 4.4), 0.04, 4.25)
  carGroup.rotation.set(0, Math.PI / 2, 0)
}

function normalizeCarModel(model) {
  normalizeImportedModelByBoundingBox(model, {
    y: CAR_HEIGHT_METERS,
    horizontalLength: CAR_LENGTH_METERS,
    horizontalWidth: CAR_WIDTH_METERS,
  })
}
