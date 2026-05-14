import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const sharedLoader = new GLTFLoader()

export function loadGlbModel({
  scene,
  url,
  name,
  cfg,
  buildFallback,
  updateTransform,
  normalize,
  onReady,
  onError,
}) {
  const group = new THREE.Group()
  group.name = name
  scene.add(group)

  if (buildFallback) {
    group.add(buildFallback())
  }
  updateTransform?.(group, cfg)

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
    },
    undefined,
    (error) => {
      console.warn(`Unable to load ${name} model from ${url}; using fallback geometry.`, error)
      onError?.(error)
    }
  )

  return group
}

export function fitModelToSize(model, desiredSize) {
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const scaleX = desiredSize.x ? desiredSize.x / Math.max(size.x, 0.001) : Infinity
  const scaleY = desiredSize.y ? desiredSize.y / Math.max(size.y, 0.001) : Infinity
  const scaleZ = desiredSize.z ? desiredSize.z / Math.max(size.z, 0.001) : Infinity
  const scale = Math.min(scaleX, scaleY, scaleZ)

  model.position.sub(center)
  model.scale.setScalar(Number.isFinite(scale) ? scale : 1)

  const scaledBox = new THREE.Box3().setFromObject(model)
  model.position.y -= scaledBox.min.y
}


export function fitModelToHorizontalLength(model, desiredLength) {
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const horizontalLength = Math.max(size.x, size.z, 0.001)
  const scale = desiredLength / horizontalLength

  model.position.sub(center)
  model.scale.setScalar(scale)

  const scaledBox = new THREE.Box3().setFromObject(model)
  model.position.y -= scaledBox.min.y
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
