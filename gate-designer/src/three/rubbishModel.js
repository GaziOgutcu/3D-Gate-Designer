import * as THREE from 'three'
import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const RUBBISH_MODEL_URL = '/models/rubbish.glb'
const BIN_COUNT = 4
const BIN_BASE_HEIGHT_METERS = 0.108
const BIN_BASE_WIDTH_METERS = 0.058
const BIN_BASE_DEPTH_METERS = 0.068
const BIN_COLORS = [0x2f6b3f, 0x263238, 0x2f6b3f, 0x263238]

export function loadRubbishModel(scene, cfg, callbacks = {}) {
  return loadGlbModel({
    scene,
    cfg,
    url: RUBBISH_MODEL_URL,
    name: callbacks.name ?? 'Four wheelie bin group',
    updateTransform: updateRubbishModel,
    normalize: normalizeRubbishModel,
    onReady: (group) => {
      buildBinRow(group)
      callbacks.onLoaded?.(group)
    },
    onError: callbacks.onError,
  })
}

export function updateRubbishModel(rubbishGroup, cfg) {
  if (!rubbishGroup) return

  const lotWidth = Math.max(cfg.width + 7, 12)
  const wallSafeX = -lotWidth / 2 + 1.25
  const binSpacing = 0.66
  const binGroupX = Math.min(-cfg.width / 2 - 1.75, wallSafeX + binSpacing * 1.5)
  const binGroupZ = -0.34

  rubbishGroup.position.set(binGroupX, 0.04, binGroupZ)
  rubbishGroup.rotation.set(0, 0, 0)
}

function normalizeRubbishModel(model) {
  const binScale = 10

  normalizeImportedModelByBoundingBox(model, {
    x: BIN_BASE_WIDTH_METERS * binScale,
    y: BIN_BASE_HEIGHT_METERS * binScale,
    z: BIN_BASE_DEPTH_METERS * binScale,
  })
}

function buildBinRow(group) {
  const sourceBin = group.children[0]
  if (!sourceBin) return

  group.clear()

  const binSpacing = 0.66
  const rowCenterOffset = ((BIN_COUNT - 1) * binSpacing) / 2

  for (let index = 0; index < BIN_COUNT; index += 1) {
    const bin = index === 0 ? sourceBin : sourceBin.clone(true)
    bin.position.set(index * binSpacing - rowCenterOffset, 0, 0)
    bin.rotation.set(0, Math.PI, 0)
    tintBin(bin, BIN_COLORS[index])
    group.add(bin)
  }
}

function tintBin(model, color) {
  model.traverse((child) => {
    if (!child.isMesh || !child.material) return

    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((sourceMaterial, index) => {
      if (!sourceMaterial.color) return
      const material = sourceMaterial.clone()
      const materialName = `${child.name ?? ''} ${sourceMaterial.name ?? ''}`.toLowerCase()
      if (!/(wheel|tyre|tire|rubber|axle|metal)/.test(materialName)) {
        material.color = new THREE.Color(color)
        material.roughness = Math.max(material.roughness ?? 0.55, 0.68)
        material.metalness = Math.min(material.metalness ?? 0.08, 0.12)
      }

      if (Array.isArray(child.material)) {
        child.material[index] = material
      } else {
        child.material = material
      }
    })
  })
}
