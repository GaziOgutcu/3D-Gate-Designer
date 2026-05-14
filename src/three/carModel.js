import * as THREE from 'three'
import { fitModelToHorizontalLength, loadGlbModel } from './modelLoader'

const CAR_MODEL_URL = '/models/car.glb'
const CAR_LENGTH_METERS = 4.6
const CAR_WIDTH_METERS = 1.85
const CAR_HEIGHT_METERS = 1.45

export function loadCarModel(scene, cfg, callbacks = {}) {
  return loadGlbModel({
    scene,
    cfg,
    url: CAR_MODEL_URL,
    name: 'Residential street car',
    buildFallback: buildFallbackCar,
    updateTransform: updateCarModel,
    normalize: normalizeCarModel,
    onReady: callbacks.onLoaded,
    onError: callbacks.onFallback,
  })
}

export function updateCarModel(carGroup, cfg) {
  if (!carGroup) return
  const lotWidth = Math.max(cfg.width + 8, cfg.width * 2.2)
  carGroup.position.set(lotWidth * 0.24, 0.045, 3.4)
  carGroup.rotation.set(0, Math.PI / 2, 0)
}

function normalizeCarModel(model) {
  fitModelToHorizontalLength(model, CAR_LENGTH_METERS)
}

function buildFallbackCar() {
  const group = new THREE.Group()
  const paintMat = new THREE.MeshStandardMaterial({
    color: 0x52677c,
    roughness: 0.38,
    metalness: 0.35,
  })
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x89a8b5,
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.72,
  })
  const tyreMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7,
    metalness: 0.05,
  })
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xf5e7c7,
    roughness: 0.35,
    emissive: 0xf4d28a,
    emissiveIntensity: 0.12,
  })

  addBox(group, [CAR_WIDTH_METERS, 0.6, CAR_LENGTH_METERS], [0, 0.55, 0], paintMat)
  addBox(group, [1.35, 0.55, 1.55], [-0.08, 1.08, -0.2], glassMat)
  addBox(group, [CAR_WIDTH_METERS + 0.04, 0.08, 0.18], [0, 0.64, CAR_LENGTH_METERS / 2 + 0.02], lightMat)

  ;[-CAR_WIDTH_METERS * 0.47, CAR_WIDTH_METERS * 0.47].forEach((x) => {
    ;[-CAR_LENGTH_METERS * 0.33, CAR_LENGTH_METERS * 0.33].forEach((z) => {
      const tyre = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.34, 0.18, 20),
        tyreMat
      )
      tyre.position.set(x, 0.34, z)
      tyre.rotation.z = Math.PI / 2
      tyre.castShadow = true
      tyre.receiveShadow = true
      group.add(tyre)
    })
  })

  return group
}

function addBox(group, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)
}
