import { loadGlbModel, normalizeImportedModelByBoundingBox } from './modelLoader'

const HOUSE_MODEL_URL = '/models/house2.glb'
const HOUSE_WIDTH_METERS = 8.4
const HOUSE_HEIGHT_METERS = 4.35
const HOUSE_DEPTH_METERS = 5.8
const HOUSE_FRONT_YARD_RATIO = 0.3
const HOUSE_MIN_FRONT_YARD_METERS = 3.8
const HOUSE_MAX_FRONT_YARD_METERS = 4.6

function getLotMetrics(cfg, side) {
  const lotWidth = Math.max(cfg.width + 7, 12)
  const lotDepth = Math.max(14, cfg.width * 2.1)
  const lawnDepth = lotDepth + 1.2
  const lawnCenterZ = -lotDepth / 2
  const drivewayDepth = lotDepth + 6.2
  const drivewayCenterZ = -lotDepth / 2 - 2.55
  const grassFrontBoundaryZ = lawnCenterZ + lawnDepth / 2
  const drivewayFrontBoundaryZ = drivewayCenterZ + drivewayDepth / 2
  const frontBoundaryZ = Math.min(grassFrontBoundaryZ, drivewayFrontBoundaryZ)
  const xOffset = side * (lotWidth + 1.2)

  return {
    lotDepth,
    xOffset,
    frontBoundaryZ,
    grassBackBoundaryZ: lawnCenterZ - lawnDepth / 2,
  }
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
  const { lotDepth, xOffset, frontBoundaryZ, grassBackBoundaryZ } = getLotMetrics(cfg, side)
  const frontYardDepth = Math.min(
    HOUSE_MAX_FRONT_YARD_METERS,
    Math.max(HOUSE_MIN_FRONT_YARD_METERS, lotDepth * HOUSE_FRONT_YARD_RATIO)
  )
  const houseFrontZ = frontBoundaryZ - frontYardDepth
  const houseCenterZ = Math.max(
    grassBackBoundaryZ + HOUSE_DEPTH_METERS / 2 + 0.35,
    houseFrontZ - HOUSE_DEPTH_METERS / 2
  )

  houseGroup.position.set(xOffset, 0, houseCenterZ)
  houseGroup.rotation.set(0, 0, 0)
}

function normalizeHouseModel(model) {
  normalizeImportedModelByBoundingBox(model, {
    x: HOUSE_WIDTH_METERS,
    y: HOUSE_HEIGHT_METERS,
    z: HOUSE_DEPTH_METERS,
  })
}
