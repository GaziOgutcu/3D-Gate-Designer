import React, { useEffect, useRef } from 'react'
import { createScene, handleResize } from '../three/scene'
import { rebuildGate } from '../three/gateBuilder'

export default function Viewport3D({ cfg, priceStr }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const frameRef = useRef(null)
  const cfgRef = useRef(cfg)
  const loadedRef = useRef(false)

  const cam = useRef({
    angle: 0.4,
    y: 2.5,
    radius: 6,
    tAngle: 0.4,
    tY: 2.5,
    tR: 6,
    interacting: false,
    down: false,
    lx: 0,
    ly: 0,
  })

  cfgRef.current = cfg

  // Init scene once
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || loadedRef.current) return
    loadedRef.current = true

    const s = createScene(canvas)
    sceneRef.current = s
    rebuildGate(s.gateGroup, cfgRef.current)

    const c = cam.current

    // Mouse handlers
    const onDown = (e) => {
      c.down = true
      c.interacting = true
      const pt = e.touches ? e.touches[0] : e
      c.lx = pt.clientX
      c.ly = pt.clientY
    }
    const onMove = (e) => {
      if (!c.down) return
      e.preventDefault()
      const pt = e.touches ? e.touches[0] : e
      c.tAngle -= (pt.clientX - c.lx) * 0.006
      c.tY = Math.max(0.5, Math.min(6, c.tY + (pt.clientY - c.ly) * 0.01))
      c.lx = pt.clientX
      c.ly = pt.clientY
    }
    const onUp = () => {
      c.down = false
      setTimeout(() => {
        c.interacting = false
      }, 3000)
    }
    const onWheel = (e) => {
      e.preventDefault()
      c.tR = Math.max(3, Math.min(14, c.tR + e.deltaY * 0.005))
      c.interacting = true
      setTimeout(() => {
        c.interacting = false
      }, 3000)
    }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('touchstart', onDown, { passive: false })
    canvas.addEventListener('touchmove', onMove, { passive: false })
    canvas.addEventListener('touchend', onUp)

    const onResize = () => handleResize(canvas, s.camera, s.renderer)
    window.addEventListener('resize', onResize)

    // Observe parent resize (for flex layout changes)
    const ro = new ResizeObserver(() => handleResize(canvas, s.camera, s.renderer))
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      c.angle += (c.tAngle - c.angle) * 0.05
      c.y += (c.tY - c.y) * 0.05
      c.radius += (c.tR - c.radius) * 0.05

      s.camera.position.x = Math.sin(c.angle) * c.radius
      s.camera.position.z = Math.cos(c.angle) * c.radius
      s.camera.position.y = c.y
      s.camera.lookAt(0, cfgRef.current.height * 0.4, 0)
      s.renderer.render(s.scene, s.camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onUp)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('touchend', onUp)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      s.renderer.dispose()
    }
  }, [])

  // Rebuild on config change
  useEffect(() => {
    if (sceneRef.current) {
      rebuildGate(sceneRef.current.gateGroup, cfg)
    }
  }, [cfg])

  const setView = (view) => {
    const c = cam.current
    c.interacting = true
    if (view === 'front') {
      c.tAngle = 0
      c.tY = cfg.height * 0.6
      c.tR = Math.max(cfg.width * 1.5, 5)
    } else if (view === 'side') {
      c.tAngle = Math.PI / 2
      c.tY = cfg.height * 0.6
      c.tR = 5
    } else if (view === 'top') {
      c.tY = 8
      c.tR = 0.1
    } else {
      c.tAngle = 0.4
      c.tY = 2.5
      c.tR = 6
    }
  }

  const viewBtnStyle = {
    width: 36,
    height: 36,
    border: '1px solid #2a332e',
    borderRadius: 8,
    background: 'rgba(10,15,13,0.85)',
    color: '#9a9890',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
    backdropFilter: 'blur(12px)',
  }

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        background: '#0a0f0d',
        minHeight: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'grab',
        }}
      />

      {/* Top overlay */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      >
        <div
          style={{
            background: 'rgba(10,15,13,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #2a332e',
            borderRadius: 10,
            padding: '10px 16px',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '0.62rem',
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: '#6b6960',
              marginBottom: 3,
            }}
          >
            Live Dimensions
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#d4a017',
            }}
          >
            {cfg.width.toFixed(1)}
            <span
              style={{
                fontSize: '0.7rem',
                color: '#9a9890',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              m
            </span>{' '}
            × {cfg.height.toFixed(1)}
            <span
              style={{
                fontSize: '0.7rem',
                color: '#9a9890',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              m
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 5, pointerEvents: 'auto' }}>
          {[
            ['3D', 'persp'],
            ['F', 'front'],
            ['S', 'side'],
            ['T', 'top'],
          ].map(([lbl, view]) => (
            <button
              key={view}
              onClick={() => setView(view)}
              style={viewBtnStyle}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      >
        <div style={{ fontSize: '0.68rem', color: '#6b6960' }}>
          🖱 Drag to rotate · Scroll to zoom
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, #b8860b, #d4a017)',
            borderRadius: 12,
            padding: '12px 20px',
            textAlign: 'right',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '0.58rem',
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: 'rgba(10,15,13,0.6)',
              marginBottom: 2,
            }}
          >
            Estimated From
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0a0f0d',
            }}
          >
            {priceStr}
          </div>
          <div
            style={{
              fontSize: '0.58rem',
              color: 'rgba(10,15,13,0.5)',
              marginTop: 1,
            }}
          >
            Incl. GST · Final quote on-site
          </div>
        </div>
      </div>
    </div>
  )
}
