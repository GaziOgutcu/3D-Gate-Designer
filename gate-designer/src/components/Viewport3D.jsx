import React, { useEffect, useRef, useState } from 'react'
import { createScene, handleResize } from '../three/scene'
import { rebuildGate } from '../three/gateBuilder'
import { loadCarModel, updateCarModel } from '../three/carModel'
import { loadHouseModel, updateHouseModel } from '../three/houseModel'
import { clearGroup } from '../three/modelLoader'

function positionCamera(sceneState, cfg, view) {
  const { camera, controls } = sceneState
  const targetY = cfg.height * 0.45
  controls.target.set(0, targetY, 0)

  if (view === 'front') {
    camera.position.set(0, cfg.height * 0.6, Math.max(cfg.width * 1.5, 5))
  } else if (view === 'side') {
    camera.position.set(Math.max(cfg.width * 1.25, 5), cfg.height * 0.6, 0)
  } else if (view === 'top') {
    camera.position.set(0.01, 8, 0.01)
  } else {
    const radius = 6
    const angle = 0.4
    camera.position.set(Math.sin(angle) * radius, 2.5, Math.cos(angle) * radius)
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
  const houseRef = useRef(null)

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

    carRef.current = loadCarModel(s.scene, cfgRef.current)
    houseRef.current = loadHouseModel(s.scene, cfgRef.current)

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
      s.controls.dispose()
      if (carRef.current) {
        clearGroup(carRef.current)
        s.scene.remove(carRef.current)
      }
      if (houseRef.current) {
        clearGroup(houseRef.current)
        s.scene.remove(houseRef.current)
      }
      s.renderer.dispose()
    }
  }, [])

  // Rebuild on config change
  useEffect(() => {
    if (sceneRef.current) {
      rebuildGate(sceneRef.current.gateGroup, cfg)
      updateCarModel(carRef.current, cfg)
      updateHouseModel(houseRef.current, cfg)
      sceneRef.current.controls.target.set(0, cfg.height * 0.45, 0)
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
        }}
      />

      {carStatus === 'loading' && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(10,15,13,0.82)',
            border: '1px solid #2a332e',
            borderRadius: 10,
            color: '#d4a017',
            padding: '10px 14px',
            fontSize: '0.72rem',
            letterSpacing: 1,
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          Loading car model…
        </div>
      )}

      {carStatus === 'fallback' && (
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: 14,
            background: 'rgba(10,15,13,0.78)',
            border: '1px solid #4b3b18',
            borderRadius: 10,
            color: '#d4a017',
            padding: '8px 12px',
            fontSize: '0.68rem',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          Add /public/models/car.glb to use the GLB car model.
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
