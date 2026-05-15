import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const RUBBISH_MODEL_URL = '/models/rubbish.glb'
const RUBBISH_HEIGHT_METERS = 0.62
const RUBBISH_WIDTH_METERS = 0.34
const RUBBISH_DEPTH_METERS = 0.42

export function loadRubbishModel(scene, cfg, callbacks = {}) {
  const variant = callbacks.variant ?? 'green-bin'
  return loadGlbModel({
    scene,
    cfg,
    url: RUBBISH_MODEL_URL,
    name: callbacks.name ?? `${variant} rubbish bin`,
    updateTransform: (group, currentCfg) => updateRubbishModel(group, currentCfg, variant),
    normalize: normalizeRubbishModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  })
}

export function updateRubbishModel(rubbishGroup, cfg, variant = 'green-bin') {
  if (!rubbishGroup) return

  const lotWidth = Math.max(cfg.width + 7, 12)
  const binIndex = variant === 'dark-bin' ? 1 : 0
  rubbishGroup.position.set(-lotWidth * 0.36 - binIndex * 0.38, 0.04, 2.02)
  rubbishGroup.rotation.set(0, Math.PI * (0.94 + binIndex * 0.025), 0)
}

function normalizeRubbishModel(model) {
  normalizeImportedModelByBoundingBox(model, {
    x: RUBBISH_WIDTH_METERS,
    y: RUBBISH_HEIGHT_METERS,
    z: RUBBISH_DEPTH_METERS,
  })
}
