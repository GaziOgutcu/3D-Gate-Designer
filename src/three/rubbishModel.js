import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const RUBBISH_MODEL_URL = '/models/rubbish.glb'
const BIN_BASE_HEIGHT_METERS = 0.108

export function loadRubbishModel(scene, cfg, callbacks = {}) {
  return loadGlbModel({
    scene,
    cfg,
    url: RUBBISH_MODEL_URL,
    name: callbacks.name ?? 'Wheelie bin group',
    updateTransform: updateRubbishModel,
    normalize: normalizeRubbishModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  })
}

export function updateRubbishModel(rubbishGroup, cfg) {
  if (!rubbishGroup) return

  const lotWidth = Math.max(cfg.width + 7, 12)
  const binScale = 10
  const binSpacing = 0.66
  const binGroupX = -lotWidth / 2 + 1.45
  const binGroupZ = 0.82

  rubbishGroup.position.set(binGroupX, 0.04, binGroupZ)
  rubbishGroup.rotation.set(0, Math.PI / 2, 0)

  rubbishGroup.userData.binScale = binScale
  rubbishGroup.userData.binSpacing = binSpacing
}

function normalizeRubbishModel(model) {
  const binScale = 10

  normalizeImportedModelByBoundingBox(model, {
    y: BIN_BASE_HEIGHT_METERS * binScale,
  })
}
