import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const TREE_MODEL_URL = '/models/tree.glb'
const TREE_HEIGHT_METERS = 4.2

const TREE_LAYOUT = [
  { side: -1, z: -3.6, offset: 2.8 },
  { side: 1, z: -4.7, offset: 3.1 },
]

export function loadTreeModels(scene, cfg, callbacks = {}) {
  const loads = TREE_LAYOUT.map((layout, index) => loadGlbModel({
    scene,
    cfg: { ...cfg, layout, index },
    url: TREE_MODEL_URL,
    name: `Residential tree ${index + 1}`,
    updateTransform: updateTreeModel,
    normalize: normalizeTreeModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onError,
  }))

  return {
    groups: loads.map((load) => load.group),
    promise: Promise.allSettled(loads.map((load) => load.promise)),
  }
}

export function updateTreeModels(treeGroups, cfg) {
  if (!treeGroups) return
  treeGroups.forEach((treeGroup, index) => {
    updateTreeModel(treeGroup, { ...cfg, layout: TREE_LAYOUT[index], index })
  })
}

function updateTreeModel(treeGroup, cfg) {
  if (!treeGroup) return
  const layout = cfg.layout ?? TREE_LAYOUT[cfg.index ?? 0]
  const lotWidth = Math.max(cfg.width + 7, 12)
  const x = layout.side * Math.max(cfg.width / 2 + layout.offset, lotWidth * 0.36)
  treeGroup.position.set(x, 0.02, layout.z)
  treeGroup.rotation.set(0, layout.side > 0 ? -0.25 : 0.25, 0)
}

function normalizeTreeModel(model) {
  normalizeImportedModelByBoundingBox(model, { y: TREE_HEIGHT_METERS })
}
