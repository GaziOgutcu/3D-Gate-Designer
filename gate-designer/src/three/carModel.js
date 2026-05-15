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
  const variant = callbacks.variant ?? 'central-driveway'
  return loadGlbModel({
    scene,
    cfg,
    url: CAR_MODEL_URL,
    name: callbacks.name ?? 'Central driveway car',
    updateTransform: updateCarModel,
    normalize: normalizeCarModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  })
}

export function updateCarModel(carGroup, cfg, variant = 'central-driveway') {
  if (!carGroup) return

  carGroup.position.set(Math.min(cfg.width * 0.18, 0.65), 0.04, -2.25)
  carGroup.rotation.set(0, 0, 0)
}

function normalizeCarModel(model, variant) {
  normalizeImportedModelByBoundingBox(model, {
    y: CAR_HEIGHT_METERS,
    horizontalLength: CAR_LENGTH_METERS,
    horizontalWidth: CAR_WIDTH_METERS,
  })

  applyWhiteCarPaint(model)
}

function applyWhiteCarPaint(model) {
  model.traverse((child) => {
    if (!child.isMesh || !child.material) return

    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((sourceMaterial, index) => {
      if (!sourceMaterial.color) return

      const materialName = `${child.name ?? ''} ${sourceMaterial.name ?? ''}`.toLowerCase()
      if (/(tyre|tire|wheel|rubber|window|glass|windscreen|windshield)/.test(materialName)) return

      const whiteMaterial = sourceMaterial.clone()
      whiteMaterial.color.set(0xf6f4ec)
      whiteMaterial.roughness = Math.max(whiteMaterial.roughness ?? 0.35, 0.42)
      whiteMaterial.metalness = Math.min(whiteMaterial.metalness ?? 0.2, 0.25)

      if (Array.isArray(child.material)) {
        child.material[index] = whiteMaterial
      } else {
        child.material = whiteMaterial
      }
    })
  })
}
