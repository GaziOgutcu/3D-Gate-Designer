import * as THREE from 'three'
import { fitModelToSize, loadGlbModel } from './modelLoader'

const HOUSE_MODEL_URL = '/models/house.glb'

export function loadHouseModel(scene, cfg, callbacks = {}) {
  return loadGlbModel({
    scene,
    cfg,
    url: HOUSE_MODEL_URL,
    name: 'Residential house',
    buildFallback: () => buildFallbackHouse(cfg),
    updateTransform: updateHouseModel,
    normalize: (model, activeCfg) => normalizeHouseModel(model, activeCfg),
    onReady: callbacks.onLoaded,
    onError: callbacks.onFallback,
  })
}

export function updateHouseModel(houseGroup, cfg) {
  if (!houseGroup) return
  const lotDepth = Math.max(13, cfg.width * 1.8)
  houseGroup.position.set(0, 0.015, -Math.max(6.2, lotDepth * 0.62))
  houseGroup.rotation.set(0, 0, 0)
}

function normalizeHouseModel(model, cfg) {
  fitModelToSize(model, {
    x: Math.max(cfg.width + 2.2, 6.4),
    y: 3.2,
    z: 4.6,
  })
}

function buildFallbackHouse(cfg) {
  const group = new THREE.Group()
  const width = Math.max(cfg.width + 1.6, 5.2)
  const depth = 3.4
  const wallHeight = 2.35
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xd6d0c3, roughness: 0.78 })
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x5a2f24, roughness: 0.65 })
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x89a8b5,
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.72,
  })
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x3e3327, roughness: 0.6 })

  addBox(group, [width, wallHeight, depth], [0, wallHeight / 2, 0], wallMat)
  addBox(group, [width + 0.5, 0.28, depth + 0.55], [0, wallHeight + 0.32, 0], roofMat, {
    rotation: [0.08, 0, 0],
  })
  addBox(group, [0.9, 1.35, 0.08], [0, 0.68, depth / 2 + 0.05], doorMat)

  ;[-width * 0.32, width * 0.32].forEach((x) => {
    addBox(group, [0.95, 0.72, 0.08], [x, 1.35, depth / 2 + 0.06], glassMat)
    addBox(group, [1.05, 0.06, 0.1], [x, 1.74, depth / 2 + 0.07], roofMat)
    addBox(group, [0.06, 0.78, 0.1], [x, 1.35, depth / 2 + 0.08], roofMat)
  })

  return group
}

function addBox(group, size, position, material, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  if (options.rotation) mesh.rotation.set(...options.rotation)
  group.add(mesh)
}
