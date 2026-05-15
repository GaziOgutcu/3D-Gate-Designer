import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const HOUSE_MODEL_URL = '/models/house.glb'
const HOUSE_WIDTH_METERS = 9.5
const HOUSE_HEIGHT_METERS = 4.8
const HOUSE_DEPTH_METERS = 7.0

export function loadHouseModel(scene, cfg, callbacks = {}) {
  return loadGlbModel({
    scene,
    cfg,
    url: HOUSE_MODEL_URL,
    name: 'Residential house',
    updateTransform: updateHouseModel,
    normalize: normalizeHouseModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  })
}

export function updateHouseModel(houseGroup) {
  if (!houseGroup) return
  houseGroup.position.set(0, 0.02, -5.8)
  houseGroup.rotation.set(0, 0, 0)
}

function normalizeHouseModel(model) {
  normalizeImportedModelByBoundingBox(model, {
    x: HOUSE_WIDTH_METERS,
    y: HOUSE_HEIGHT_METERS,
    z: HOUSE_DEPTH_METERS,
  })
}
