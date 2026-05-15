import * as THREE from 'three'

/**
 * Completely rebuilds the 3D gate geometry inside `gateGroup`
 * based on the current configuration object.
 */
export function rebuildGate(gateGroup, cfg) {
  disposeGroup(gateGroup)

  const w = cfg.width
  const h = cfg.height
  const color = new THREE.Color(cfg.color)
  const lotWidth = Math.max(w + 7, 12)
  const lotDepth = Math.max(14, w * 2.1)
  const wallHeight = Math.max(1.6, Math.min(1.8, h + 0.05))

  // ── Materials ──
  const gateMat = new THREE.MeshStandardMaterial({
    color,
    roughness:
      cfg.material === 'aluminium'
        ? 0.35
        : cfg.material === 'steel'
          ? 0.55
          : 0.7,
    metalness:
      cfg.material === 'aluminium'
        ? 0.85
        : cfg.material === 'steel'
          ? 0.75
          : 0.1,
  })

  const pillarMat = new THREE.MeshStandardMaterial({
    color: color.r + color.g + color.b > 2 ? 0x888888 : 0x333333,
    roughness: 0.5,
    metalness: 0.6,
  })

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xb3aa98,
    roughness: 0.88,
    metalness: 0.02,
  })
  const stoneCapMat = new THREE.MeshStandardMaterial({
    color: 0xd0c7b4,
    roughness: 0.72,
    metalness: 0,
  })
  const drivewayMat = new THREE.MeshStandardMaterial({
    color: 0x3b3a34,
    roughness: 0.9,
  })
  const lawnMat = new THREE.MeshStandardMaterial({
    color: 0x25482d,
    roughness: 0.96,
  })
  const mulchMat = new THREE.MeshStandardMaterial({
    color: 0x4a2c1f,
    roughness: 1,
  })
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x315d35,
    roughness: 0.8,
  })
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x6a442b,
    roughness: 0.9,
  })
  const roadAsphaltMat = new THREE.MeshStandardMaterial({
    color: 0x242424,
    roughness: 0.96,
    metalness: 0,
  })
  const curbMat = new THREE.MeshStandardMaterial({
    color: 0xc8c3b8,
    roughness: 0.82,
    metalness: 0,
  })
  const lineMat = new THREE.MeshStandardMaterial({
    color: 0xf3dc6a,
    roughness: 0.55,
    metalness: 0,
  })
  const tyreMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7,
    metalness: 0.05,
  })

  buildPropertyEnvironment(gateGroup, {
    w,
    h,
    lotWidth,
    lotDepth,
    wallHeight,
    stoneMat,
    stoneCapMat,
    drivewayMat,
    lawnMat,
    mulchMat,
    leafMat,
    trunkMat,
    roadAsphaltMat,
    curbMat,
    lineMat,
    tyreMat,
  })

  // ── Pillars ──
  const pW = 0.12
  const pH = h + 0.3
  const pD = 0.12
  const pillarGeo = new THREE.BoxGeometry(pW, pH, pD)
  const capGeo = new THREE.BoxGeometry(pW + 0.06, 0.05, pD + 0.06)

  const addPillar = (x) => {
    const p = new THREE.Mesh(pillarGeo, pillarMat)
    p.position.set(x, pH / 2, 0)
    p.castShadow = true
    gateGroup.add(p)
    const cap = new THREE.Mesh(capGeo, pillarMat)
    cap.position.set(x, pH + 0.025, 0)
    cap.castShadow = true
    gateGroup.add(cap)
  }

  if (cfg.gateType === 'swing-double') {
    addPillar(-w / 2 - pW / 2)
    addPillar(0) // center post
    addPillar(w / 2 + pW / 2)
  } else {
    addPillar(-w / 2 - pW / 2)
    addPillar(w / 2 + pW / 2)
  }

  // ── Gate panel(s) ──
  const ft = 0.04 // frame thickness
  const fd = 0.03 // frame depth

  if (cfg.gateType === 'swing-double') {
    buildPanel(gateGroup, -w / 4, w / 2, h, gateMat, ft, fd, cfg.slatStyle)
    buildPanel(gateGroup, w / 4, w / 2, h, gateMat, ft, fd, cfg.slatStyle)
  } else {
    buildPanel(gateGroup, 0, w, h, gateMat, ft, fd, cfg.slatStyle)
  }

  // ── Sliding rail ──
  if (cfg.gateType === 'sliding') {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(w + 1.5, 0.04, 0.06),
      pillarMat
    )
    rail.position.set(0.5, 0.02, 0)
    rail.castShadow = true
    gateGroup.add(rail)
  }

  // ── Motor box ──
  if (cfg.motor) {
    const motorMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.3,
      metalness: 0.8,
    })
    const motor = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.2, 0.18),
      motorMat
    )
    motor.position.set(
      cfg.gateType === 'sliding' ? w / 2 + 0.3 : -w / 2 - 0.2,
      0.35,
      cfg.gateType === 'sliding' ? 0 : 0.15
    )
    motor.castShadow = true
    gateGroup.add(motor)
  }

  // ── Solar panel ──
  if (cfg.solar) {
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x1a2744,
      roughness: 0.2,
      metalness: 0.5,
    })
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.35, 0.02),
      solarMat
    )
    panel.rotation.x = -0.5
    panel.position.set(w / 2 + pW / 2, h + 0.7, 0)
    panel.castShadow = true
    gateGroup.add(panel)

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8),
      pillarMat
    )
    pole.position.set(w / 2 + pW / 2, h + 0.4, 0)
    pole.castShadow = true
    gateGroup.add(pole)
  }

  // ── Intercom ──
  if (cfg.intercom) {
    buildWallMountedIntercom(gateGroup, -w / 2 - 0.48, wallHeight)
  }

  // ── Side fences ──
  buildSideFence(gateGroup, -w / 2 - pW - 0.02, -1, h, gateMat, pillarMat, lotWidth)
  buildSideFence(gateGroup, w / 2 + pW + 0.02, 1, h, gateMat, pillarMat, lotWidth)
}

function disposeGroup(group) {
  group.traverse((child) => {
    if (child.geometry) child.geometry.dispose()
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose())
      else child.material.dispose()
    }
  })
  group.clear()
}

function addBox(group, size, position, material, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.position.set(...position)
  mesh.castShadow = options.castShadow ?? true
  mesh.receiveShadow = options.receiveShadow ?? true
  if (options.rotation) mesh.rotation.set(...options.rotation)
  group.add(mesh)
  return mesh
}

function addCylinder(group, radiusTop, radiusBottom, height, position, material, options = {}) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, options.segments ?? 16),
    material
  )
  mesh.position.set(...position)
  mesh.castShadow = options.castShadow ?? true
  mesh.receiveShadow = options.receiveShadow ?? true
  if (options.rotation) mesh.rotation.set(...options.rotation)
  group.add(mesh)
  return mesh
}

function buildPropertyEnvironment(group, env) {
  const {
    w,
    h,
    lotWidth,
    lotDepth,
    wallHeight,
    stoneMat,
    stoneCapMat,
    drivewayMat,
    lawnMat,
    mulchMat,
    leafMat,
    trunkMat,
    roadAsphaltMat,
    curbMat,
    lineMat,
    tyreMat,
  } = env

  const drivewayWidth = Math.max(w + 1.1, 3.2)
  const streetZ = 3.35
  const streetDepth = 5.6
  const sidewalkZ = 0.82
  const streetWidth = lotWidth + 7

  addBox(group, [streetWidth, 0.035, streetDepth], [0, 0.018, streetZ], roadAsphaltMat, {
    receiveShadow: true,
    castShadow: false,
  })
  addBox(group, [streetWidth, 0.05, 0.72], [0, 0.045, sidewalkZ], curbMat, {
    receiveShadow: true,
    castShadow: false,
  })
  addBox(group, [streetWidth, 0.08, 0.16], [0, 0.075, 1.52], curbMat, {
    receiveShadow: true,
    castShadow: false,
  })
  addBox(group, [drivewayWidth + 0.55, 0.06, 1.35], [0, 0.07, 0.72], drivewayMat, {
    receiveShadow: true,
    castShadow: false,
  })
  for (let i = -3; i <= 3; i++) {
    addBox(group, [1.05, 0.012, 0.055], [i * 2.15, 0.045, streetZ + 0.18], lineMat, {
      receiveShadow: false,
      castShadow: false,
    })
  }

  addBox(group, [drivewayWidth, 0.018, lotDepth + 1.8], [0, 0.012, -lotDepth / 2 - 0.35], drivewayMat, {
    receiveShadow: true,
    castShadow: false,
  })

  const lawnWidth = Math.max(1.4, (lotWidth - drivewayWidth) / 2 - 0.35)
  addBox(group, [lawnWidth, 0.015, lotDepth + 1.2], [-(drivewayWidth + lawnWidth) / 2 - 0.2, 0.02, -lotDepth / 2], lawnMat, {
    receiveShadow: true,
    castShadow: false,
  })
  addBox(group, [lawnWidth, 0.015, lotDepth + 1.2], [(drivewayWidth + lawnWidth) / 2 + 0.2, 0.02, -lotDepth / 2], lawnMat, {
    receiveShadow: true,
    castShadow: false,
  })

  const wallDepth = 0.2
  const sideWallLength = Math.max(2.2, (lotWidth - w) / 2 - 0.25)
  const wallY = wallHeight / 2
  const leftWallCenter = -w / 2 - sideWallLength / 2 - 0.18
  const rightWallCenter = w / 2 + sideWallLength / 2 + 0.18
  addBox(group, [sideWallLength, wallHeight, wallDepth], [leftWallCenter, wallY, 0.08], stoneMat)
  addBox(group, [sideWallLength, wallHeight, wallDepth], [rightWallCenter, wallY, 0.08], stoneMat)
  addBox(group, [sideWallLength + 0.12, 0.08, wallDepth + 0.08], [leftWallCenter, wallHeight + 0.04, 0.08], stoneCapMat)
  addBox(group, [sideWallLength + 0.12, 0.08, wallDepth + 0.08], [rightWallCenter, wallHeight + 0.04, 0.08], stoneCapMat)

  const returnFenceDepth = Math.max(4, lotDepth * 0.55)
  ;[-1, 1].forEach((side) => {
    const x = side * (lotWidth / 2)
    addBox(group, [0.16, wallHeight * 0.9, returnFenceDepth], [x, wallHeight * 0.45, -returnFenceDepth / 2], stoneMat)
    addBox(group, [0.22, 0.07, returnFenceDepth + 0.08], [x, wallHeight * 0.9 + 0.035, -returnFenceDepth / 2], stoneCapMat)
  })

  addBox(group, [0.28, 0.42, 0.16], [-w / 2 - 0.86, 0.36, 1.15], new THREE.MeshStandardMaterial({
    color: 0x1f2933,
    roughness: 0.62,
    metalness: 0.25,
  }))
  addCylinder(group, 0.025, 0.025, 0.45, [-w / 2 - 0.86, 0.225, 1.15], stoneCapMat, { segments: 10 })
  ;[
    [-lotWidth * 0.36, 2.02, 0x1d5c4c],
    [-lotWidth * 0.36 - 0.34, 2.02, 0x28313a],
  ].forEach(([x, z, binColor]) => {
    addBox(group, [0.24, 0.42, 0.28], [x, 0.23, z], new THREE.MeshStandardMaterial({ color: binColor, roughness: 0.7 }))
    addBox(group, [0.27, 0.055, 0.31], [x, 0.475, z], tyreMat)
  })

  const gardenZ = -2.4
  ;[-1, 1].forEach((side) => {
    const bedX = side * (drivewayWidth / 2 + Math.max(0.45, lawnWidth * 0.32))
    addBox(group, [Math.max(0.8, lawnWidth * 0.65), 0.025, 2.2], [bedX, 0.045, gardenZ], mulchMat, {
      receiveShadow: true,
      castShadow: false,
    })
    for (let i = 0; i < 5; i++) {
      const shrubX = bedX + side * ((i % 2) * 0.16 - 0.08)
      const shrubZ = gardenZ - 0.85 + i * 0.42
      addShrub(group, shrubX, shrubZ, 0.17 + (i % 3) * 0.035, leafMat)
    }
  })

  addTree(group, -Math.max(w / 2 + 2.0, lotWidth * 0.34), -4.0, 0.85 + h * 0.18, trunkMat, leafMat)
  addTree(group, Math.max(w / 2 + 2.0, lotWidth * 0.34), -5.4, 0.75 + h * 0.16, trunkMat, leafMat)

  ;[-1, 1].forEach((side) => {
    const lampX = side * (w / 2 + 0.55)
    addCylinder(group, 0.025, 0.025, 1.35, [lampX, 0.675, -0.35], stoneCapMat, { segments: 12 })
    const lamp = addCylinder(group, 0.08, 0.065, 0.16, [lampX, 1.42, -0.35], new THREE.MeshStandardMaterial({
      color: 0xffe2a1,
      roughness: 0.25,
      emissive: 0xffb547,
      emissiveIntensity: 0.22,
    }), { segments: 12 })
    lamp.castShadow = false
  })
}


function addShrub(group, x, z, radius, mat) {
  const shrub = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 8), mat)
  shrub.scale.y = 0.65
  shrub.position.set(x, radius * 0.48 + 0.04, z)
  shrub.castShadow = true
  shrub.receiveShadow = true
  group.add(shrub)
}

function addTree(group, x, z, scale, trunkMat, leafMat) {
  addCylinder(group, 0.08 * scale, 0.11 * scale, 1.25 * scale, [x, 0.62 * scale, z], trunkMat, { segments: 10 })
  const crownY = 1.28 * scale
  ;[
    [0, 0, 0.46],
    [-0.22, 0.03, 0.34],
    [0.24, 0.02, 0.36],
    [0.06, 0.22, 0.31],
  ].forEach(([ox, oy, r]) => {
    const crown = new THREE.Mesh(new THREE.SphereGeometry(r * scale, 14, 10), leafMat)
    crown.position.set(x + ox * scale, crownY + oy * scale, z + (ox * 0.2) * scale)
    crown.castShadow = true
    crown.receiveShadow = true
    group.add(crown)
  })
}

function buildWallMountedIntercom(group, x, wallHeight) {
  const mountY = Math.min(Math.max(0.92, wallHeight * 0.72), wallHeight - 0.16)
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x151515,
    roughness: 0.25,
    metalness: 0.8,
  })
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x2e3232,
    roughness: 0.35,
    metalness: 0.7,
  })
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 })

  addBox(group, [0.13, 0.28, 0.035], [x, mountY, 0.205], trimMat)
  addBox(group, [0.09, 0.2, 0.035], [x, mountY, 0.23], plateMat)

  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.052, 0.038), screenMat)
  scr.position.set(x, mountY + 0.045, 0.249)
  group.add(scr)

  ;[-0.035, 0, 0.035].forEach((dx, row) => {
    ;[-0.025, 0.025].forEach((dy) => {
      addCylinder(group, 0.006, 0.006, 0.006, [x + dx, mountY - 0.052 + dy - row * 0.002, 0.252], trimMat, {
        rotation: [Math.PI / 2, 0, 0],
        segments: 8,
      })
    })
  })
}

// ── Panel builder ──
function buildPanel(group, cx, pw, h, mat, ft, fd, slatStyle) {
  // Frame edges
  const top = new THREE.Mesh(new THREE.BoxGeometry(pw, ft, fd), mat)
  top.position.set(cx, h - ft / 2, 0)
  top.castShadow = true
  group.add(top)

  const bot = new THREE.Mesh(new THREE.BoxGeometry(pw, ft, fd), mat)
  bot.position.set(cx, ft / 2 + 0.08, 0)
  bot.castShadow = true
  group.add(bot)

  const left = new THREE.Mesh(new THREE.BoxGeometry(ft, h - 0.08, fd), mat)
  left.position.set(cx - pw / 2 + ft / 2, h / 2 + 0.04, 0)
  left.castShadow = true
  group.add(left)

  const right = new THREE.Mesh(new THREE.BoxGeometry(ft, h - 0.08, fd), mat)
  right.position.set(cx + pw / 2 - ft / 2, h / 2 + 0.04, 0)
  right.castShadow = true
  group.add(right)

  const innerW = pw - ft * 2
  const innerH = h - ft * 2 - 0.08
  const innerBot = ft + 0.08

  // Infill patterns
  if (slatStyle === 'horizontal') {
    const sh = 0.055
    const gap = 0.012
    const cnt = Math.floor(innerH / (sh + gap))
    for (let i = 0; i < cnt; i++) {
      const s = new THREE.Mesh(
        new THREE.BoxGeometry(innerW, sh, fd * 0.6),
        mat
      )
      s.position.set(cx, innerBot + ft / 2 + i * (sh + gap) + sh / 2, 0)
      s.castShadow = true
      group.add(s)
    }
  } else if (slatStyle === 'vertical') {
    const sw = 0.032
    const gap = 0.022
    const cnt = Math.floor(innerW / (sw + gap))
    const total = cnt * (sw + gap) - gap
    const sx = cx - total / 2 + sw / 2
    for (let i = 0; i < cnt; i++) {
      const s = new THREE.Mesh(
        new THREE.BoxGeometry(sw, innerH, fd * 0.6),
        mat
      )
      s.position.set(sx + i * (sw + gap), innerBot + ft / 2 + innerH / 2, 0)
      s.castShadow = true
      group.add(s)
    }
  } else if (slatStyle === 'louvre') {
    const sh = 0.065
    const gap = 0.028
    const cnt = Math.floor(innerH / (sh + gap))
    for (let i = 0; i < cnt; i++) {
      const s = new THREE.Mesh(
        new THREE.BoxGeometry(innerW, sh, fd * 1.5),
        mat
      )
      s.position.set(cx, innerBot + ft / 2 + i * (sh + gap) + sh / 2, 0)
      s.rotation.x = 0.35
      s.castShadow = true
      group.add(s)
    }
  } else if (slatStyle === 'spear') {
    const sw = 0.018
    const gap = 0.075
    const cnt = Math.floor(innerW / (sw + gap))
    const total = cnt * (sw + gap) - gap
    const sx = cx - total / 2 + sw / 2
    for (let i = 0; i < cnt; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(sw, innerH, sw),
        mat
      )
      bar.position.set(
        sx + i * (sw + gap),
        innerBot + ft / 2 + innerH / 2,
        0
      )
      bar.castShadow = true
      group.add(bar)
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(sw * 1.3, 0.08, 4),
        mat
      )
      tip.position.set(
        sx + i * (sw + gap),
        innerBot + ft / 2 + innerH + 0.04,
        0
      )
      group.add(tip)
    }
    ;[0.3, 0.6].forEach((ry) => {
      if (ry * h < innerH) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(innerW, 0.025, sw),
          mat
        )
        rail.position.set(cx, innerBot + ft / 2 + ry * innerH, 0)
        group.add(rail)
      }
    })
  } else if (slatStyle === 'flat') {
    const p = new THREE.Mesh(
      new THREE.BoxGeometry(innerW, innerH, fd * 0.5),
      mat
    )
    p.position.set(cx, innerBot + ft / 2 + innerH / 2, 0)
    p.castShadow = true
    group.add(p)
  }
}

// ── Side fence builder ──
function buildSideFence(group, startX, dir, h, gateMat, pillarMat, lotWidth) {
  const fLen = Math.max(2.2, lotWidth * 0.22)
  const fenceH = Math.max(0.9, h * 0.8)
  // End post
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, fenceH, 0.06),
    pillarMat
  )
  post.position.set(startX + dir * fLen, fenceH / 2, -0.03)
  post.castShadow = true
  group.add(post)

  // Horizontal slats
  const sh = 0.045
  const gap = 0.01
  const cnt = Math.floor(fenceH / (sh + gap))
  for (let i = 0; i < cnt; i++) {
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(fLen - 0.05, sh, 0.015),
      gateMat
    )
    s.position.set(
      startX + (dir * fLen) / 2,
      0.1 + i * (sh + gap) + sh / 2,
      -0.03
    )
    s.castShadow = true
    group.add(s)
  }
}
