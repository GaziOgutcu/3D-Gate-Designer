import * as THREE from 'three'

export function createScene(canvas) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfd4e8)
  scene.fog = new THREE.FogExp2(0xbfd4e8, 0.018)

  const camera = new THREE.PerspectiveCamera(
    40,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  )

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  // ── Lighting ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.42))

  const hemi = new THREE.HemisphereLight(0xddeeff, 0x405b35, 0.58)
  scene.add(hemi)

  const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.3)
  dirLight.position.set(8, 12, 6)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.set(2048, 2048)
  dirLight.shadow.camera.left = -10
  dirLight.shadow.camera.right = 10
  dirLight.shadow.camera.top = 10
  dirLight.shadow.camera.bottom = -10
  dirLight.shadow.bias = -0.0005
  scene.add(dirLight)

  const fillLight = new THREE.DirectionalLight(0xc0d8ff, 0.3)
  fillLight.position.set(-5, 4, -3)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xffd700, 0.15)
  rimLight.position.set(-2, 6, -8)
  scene.add(rimLight)

  // ── Ground plane ──
  const groundGeo = new THREE.PlaneGeometry(60, 60)
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x203625,
    roughness: 0.98,
    metalness: 0,
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)


  // ── Gate group (will be rebuilt on config change) ──
  const gateGroup = new THREE.Group()
  scene.add(gateGroup)

  return { scene, camera, renderer, gateGroup }
}

export function handleResize(canvas, camera, renderer) {
  const parent = canvas.parentElement
  if (!parent) return
  const w = parent.clientWidth
  const h = parent.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}
