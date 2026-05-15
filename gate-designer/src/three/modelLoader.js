import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const sharedLoader = new GLTFLoader()

export function loadGlbModel({
  scene,
  url,
  name,
  cfg,
  updateTransform,
  normalize,
  onReady,
  onError,
}) {
  const group = new THREE.Group()
  group.name = name
  scene.add(group)
  updateTransform?.(group, cfg)

  const promise = new Promise((resolve) => {
    sharedLoader.load(
      url,
      (gltf) => {
        clearGroup(group)
        const model = gltf.scene
        prepareModel(model)
        normalize?.(model, cfg)
        group.add(model)
        updateTransform?.(group, cfg)
        onReady?.(group)
        resolve({ group, loaded: true })
      },
      undefined,
      (error) => {
        console.warn(`Unable to load ${name} model from ${url}; continuing without it.`, error)
        onError?.(error)
        resolve({ group, loaded: false, error })
      }
    )
  })

  return { group, promise }
}

export function normalizeImportedModelByBoundingBox(model, targetSize, options = {}) {
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const scales = []
  if (targetSize.x) scales.push(targetSize.x / Math.max(size.x, 0.001))
  if (targetSize.y) scales.push(targetSize.y / Math.max(size.y, 0.001))
  if (targetSize.z) scales.push(targetSize.z / Math.max(size.z, 0.001))
  if (targetSize.horizontalLength) {
    scales.push(targetSize.horizontalLength / Math.max(size.x, size.z, 0.001))
  }
  if (targetSize.horizontalWidth) {
    scales.push(targetSize.horizontalWidth / Math.max(Math.min(size.x, size.z), 0.001))
  }

  const scale = options.mode === 'cover' ? Math.max(...scales) : Math.min(...scales)

  model.position.sub(center)
  model.scale.setScalar(Number.isFinite(scale) ? scale : 1)

  const scaledBox = new THREE.Box3().setFromObject(model)
  model.position.y -= scaledBox.min.y
}

export function fitModelToSize(model, desiredSize) {
  normalizeImportedModelByBoundingBox(model, desiredSize)
}

export function fitModelToHorizontalLength(model, desiredLength) {
  normalizeImportedModelByBoundingBox(model, { horizontalLength: desiredLength })
}

export function clearGroup(group) {
  group.traverse((child) => {
    if (child.geometry) child.geometry.dispose()
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose())
      else child.material.dispose()
    }
  })
  group.clear()
}

function prepareModel(model) {
  model.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = true
    child.receiveShadow = true
    child.frustumCulled = true
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        material.needsUpdate = true
      })
    }
  })
}
