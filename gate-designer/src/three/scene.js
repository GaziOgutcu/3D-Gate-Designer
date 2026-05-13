import * as THREE from 'three'

export function createScene(canvas) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0f0d)
  scene.fog = new THREE.FogExp2(0x0a0f0d, 0.035)

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
  scene.add(new THREE.AmbientLight(0xffffff, 0.3))

  const hemi = new THREE.HemisphereLight(0xb0c4de, 0x2d4a2d, 0.45)
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
  const groundGeo = new THREE.PlaneGeometry(40, 40)
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x1a231e,
    roughness: 0.95,
    metalness: 0,
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // ── Driveway strip ──
  const driveGeo = new THREE.PlaneGeometry(5, 12)
  const driveMat = new THREE.MeshStandardMaterial({
    color: 0x252e28,
    roughness: 0.9,
  })
  const drive = new THREE.Mesh(driveGeo, driveMat)
  drive.rotation.x = -Math.PI / 2
  drive.position.set(0, 0.005, -3)
  scene.add(drive)

  // ── Grid helper ──
  const grid = new THREE.GridHelper(20, 40, 0x2a332e, 0x1e2722)
  grid.position.y = 0.01
  scene.add(grid)

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
