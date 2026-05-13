import * as THREE from 'three'

/**
 * Completely rebuilds the 3D gate geometry inside `gateGroup`
 * based on the current configuration object.
 */
export function rebuildGate(gateGroup, cfg) {
  // ── Dispose previous children ──
  while (gateGroup.children.length) {
    const child = gateGroup.children[0]
    if (child.geometry) child.geometry.dispose()
    if (child.material) {
      if (Array.isArray(child.material))
        child.material.forEach((m) => m.dispose())
      else child.material.dispose()
    }
    gateGroup.remove(child)
  }

  const w = cfg.width
  const h = cfg.height
  const color = new THREE.Color(cfg.color)

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
    gateGroup.add(panel)

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8),
      pillarMat
    )
    pole.position.set(w / 2 + pW / 2, h + 0.4, 0)
    gateGroup.add(pole)
  }

  // ── Intercom ──
  if (cfg.intercom) {
    const iMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.2,
      metalness: 0.9,
    })
    const icom = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.18, 0.04),
      iMat
    )
    icom.position.set(-w / 2 - 0.3, 1.3, 0.15)
    gateGroup.add(icom)

    const scr = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    )
    scr.position.set(-w / 2 - 0.3, 1.35, 0.172)
    gateGroup.add(scr)
  }

  // ── Side fences ──
  buildSideFence(gateGroup, -w / 2 - pW - 0.02, -1, h, gateMat, pillarMat)
  buildSideFence(gateGroup, w / 2 + pW + 0.02, 1, h, gateMat, pillarMat)
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
function buildSideFence(group, startX, dir, h, gateMat, pillarMat) {
  const fLen = 2.2
  // End post
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, h * 0.8, 0.06),
    pillarMat
  )
  post.position.set(startX + dir * fLen, h * 0.4, 0)
  post.castShadow = true
  group.add(post)

  // Horizontal slats
  const sh = 0.045
  const gap = 0.01
  const cnt = Math.floor((h * 0.8) / (sh + gap))
  for (let i = 0; i < cnt; i++) {
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(fLen - 0.05, sh, 0.015),
      gateMat
    )
    s.position.set(
      startX + (dir * fLen) / 2,
      0.1 + i * (sh + gap) + sh / 2,
      0
    )
    s.castShadow = true
    group.add(s)
  }
}
