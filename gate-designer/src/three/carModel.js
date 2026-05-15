import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const CAR_MODEL_URL = '/models/car.glb'
const CAR_LENGTH_METERS = 4.4
const CAR_WIDTH_METERS = 1.8
const CAR_HEIGHT_METERS = 1.4

export function loadCarModel(scene, cfg, callbacks = {}) {
  return loadGlbModel({
    scene,
    cfg,
    url: CAR_MODEL_URL,
    name: 'Residential street car',
    updateTransform: updateCarModel,
    normalize: normalizeCarModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  })
}

export function updateCarModel(carGroup, cfg) {
  if (!carGroup) return
  const lotWidth = Math.max(cfg.width + 7, 12)
  carGroup.position.set(Math.min(lotWidth * 0.34, 4.4), 0.04, 3.45)
  carGroup.rotation.set(0, Math.PI / 2, 0)
}

function normalizeCarModel(model) {
  normalizeImportedModelByBoundingBox(model, {
    y: CAR_HEIGHT_METERS,
    horizontalLength: CAR_LENGTH_METERS,
    horizontalWidth: CAR_WIDTH_METERS,
  })
}
