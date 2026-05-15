import React, { useEffect, useRef, useState } from 'react'
import { createScene, handleResize } from '../three/scene'
import { rebuildGate } from '../three/gateBuilder'
import { loadCarModel, updateCarModel } from '../three/carModel'
import { loadHouseModel, updateHouseModel } from '../three/houseModel'
import { clearGroup } from '../three/modelLoader'

function positionCamera(sceneState, cfg, view) {
  const { camera, controls } = sceneState
  const targetY = Math.max(cfg.height * 0.55, 1.2)
  controls.target.set(0, targetY, -1.2)

  if (view === 'front') {
    camera.position.set(0, 2.8, Math.max(cfg.width * 2.2, 9.2))
  } else if (view === 'side') {
    camera.position.set(Math.max(cfg.width * 2.4, 10), 2.8, -0.8)
  } else if (view === 'top') {
    camera.position.set(0.01, 15, -0.4)
  } else {
    camera.position.set(9.2, 4.1, 10.8)
  }

  camera.lookAt(controls.target)
  controls.update()
}


export default function Viewport3D({ cfg, priceStr }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const frameRef = useRef(null)
  const cfgRef = useRef(cfg)
  const loadedRef = useRef(false)
  const carRef = useRef(null)
  const drivewayCarRef = useRef(null)
  const houseRef = useRef(null)
  const neighborHouseRefs = useRef([])
  const [sceneReady, setSceneReady] = useState(false)

  cfgRef.current = cfg

  // Init scene once
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || loadedRef.current) return undefined
    loadedRef.current = true

    const s = createScene(canvas)
    sceneRef.current = s
    rebuildGate(s.gateGroup, cfgRef.current)
    positionCamera(s, cfgRef.current, 'persp')

    setSceneReady(false)
    const carLoad = loadCarModel(s.scene, cfgRef.current)
    const drivewayCarLoad = loadCarModel(s.scene, cfgRef.current, {
      variant: 'driveway-right',
      name: 'Neighbour driveway car',
    })
    const houseLoad = loadHouseModel(s.scene, cfgRef.current)
    const leftHouseLoad = loadHouseModel(s.scene, cfgRef.current, {
      variant: 'left',
      name: 'Left neighbour house',
    })
    const rightHouseLoad = loadHouseModel(s.scene, cfgRef.current, {
      variant: 'right',
      name: 'Right neighbour house',
    })
    carRef.current = carLoad.group
    drivewayCarRef.current = drivewayCarLoad.group
    houseRef.current = houseLoad.group
    neighborHouseRefs.current = [
      { group: leftHouseLoad.group, variant: 'left' },
      { group: rightHouseLoad.group, variant: 'right' },
    ]

    let cancelled = false
    Promise.allSettled([
      carLoad.promise,
      houseLoad.promise,
      leftHouseLoad.promise,
      rightHouseLoad.promise,
    ]).then(() => {
      if (!cancelled) setSceneReady(true)
    })

    const onResize = () => handleResize(canvas, s.camera, s.renderer)
    window.addEventListener('resize', onResize)

    // Observe parent resize (for flex layout changes)
    const ro = new ResizeObserver(() => handleResize(canvas, s.camera, s.renderer))
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      s.controls.update()
      s.renderer.render(s.scene, s.camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      cancelled = true
      s.controls.dispose()
      if (carRef.current) {
        clearGroup(carRef.current)
        s.scene.remove(carRef.current)
      }
      if (drivewayCarRef.current) {
        clearGroup(drivewayCarRef.current)
        s.scene.remove(drivewayCarRef.current)
      }
      if (houseRef.current) {
        clearGroup(houseRef.current)
        s.scene.remove(houseRef.current)
      }
      neighborHouseRefs.current.forEach(({ group }) => {
        clearGroup(group)
        s.scene.remove(group)
      })
      s.renderer.dispose()
    }
  }, [])

  // Rebuild on config change
  useEffect(() => {
    if (sceneRef.current) {
      rebuildGate(sceneRef.current.gateGroup, cfg)
      updateCarModel(carRef.current, cfg)
      updateCarModel(drivewayCarRef.current, cfg, 'driveway-right')
      updateHouseModel(houseRef.current, cfg)
      neighborHouseRefs.current.forEach(({ group, variant }) => updateHouseModel(group, cfg, variant))
      sceneRef.current.controls.target.set(0, Math.max(cfg.height * 0.55, 1.2), -1.2)
      sceneRef.current.controls.update()
    }
  }, [cfg])

  const setView = (view) => {
    if (sceneRef.current) {
      positionCamera(sceneRef.current, cfg, view)
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
          pointerEvents: sceneReady ? 'auto' : 'none',
          opacity: sceneReady ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {!sceneReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0f0d, #16221c)',
            color: '#d4a017',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            zIndex: 20,
          }}
        >
          Preparing 3D scene…
        </div>
      )}

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
          opacity: sceneReady ? 1 : 0,
          transition: 'opacity 0.2s ease',
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
          opacity: sceneReady ? 1 : 0,
          transition: 'opacity 0.2s ease',
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
