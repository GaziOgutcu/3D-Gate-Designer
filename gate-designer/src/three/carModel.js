import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const CAR_MODEL_URL = '/models/car.glb'

export function loadCarModel(scene, cfg, callbacks = {}) {
  const carGroup = new THREE.Group()
  carGroup.name = 'Residential street car'
  scene.add(carGroup)
  updateCarModel(carGroup, cfg)

  callbacks.onLoading?.()

  const loader = new GLTFLoader()
  loader.load(
    CAR_MODEL_URL,
    (gltf) => {
      carGroup.clear()
      const model = gltf.scene
      prepareModel(model)
      normalizeModel(model)
      carGroup.add(model)
      callbacks.onLoaded?.()
    },
    undefined,
    () => {
      carGroup.clear()
      buildFallbackCar(carGroup)
      callbacks.onFallback?.()
    }
  )

  return carGroup
}

export function updateCarModel(carGroup, cfg) {
  if (!carGroup) return
  const lotWidth = Math.max(cfg.width + 8, cfg.width * 2.2)
  carGroup.position.set(lotWidth * 0.28, 0.065, 3.4)
  carGroup.rotation.set(0, Math.PI / 2, 0)
}

function prepareModel(model) {
  model.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = true
    child.receiveShadow = true
    if (child.material) {
      child.material.needsUpdate = true
    }
  })
}

function normalizeModel(model) {
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const maxHorizontalSize = Math.max(size.x, size.z, 0.001)
  const desiredLength = 1.65
  const scale = desiredLength / maxHorizontalSize

  model.position.sub(center)
  model.scale.setScalar(scale)

  const scaledBox = new THREE.Box3().setFromObject(model)
  model.position.y -= scaledBox.min.y
}

function buildFallbackCar(group) {
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

  addBox(group, [1.55, 0.34, 0.72], [0, 0.24, 0], paintMat)
  addBox(group, [0.82, 0.32, 0.58], [-0.08, 0.56, 0], glassMat)
  addBox(group, [0.18, 0.05, 0.74], [0.82, 0.33, 0], lightMat)

  ;[-0.52, 0.52].forEach((dx) => {
    ;[-0.34, 0.34].forEach((dz) => {
      const tyre = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16),
        tyreMat
      )
      tyre.position.set(dx, 0.13, dz)
      tyre.rotation.x = Math.PI / 2
      tyre.castShadow = true
      tyre.receiveShadow = true
      group.add(tyre)
    })
  })
}

function addBox(group, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)
}
