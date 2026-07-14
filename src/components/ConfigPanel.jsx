import React, { useState } from 'react'
import {
  COLORS,
  DESIGN_CATEGORIES,
  GATE_TYPES,
  POWER_SUPPLIES,
  TIMELINES,
  getAutomationOptions,
  getDefaultAutomation,
  getDesignCategory,
} from '../data/config'

const sectionLabel = { fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#b8860b', marginBottom: 14, fontWeight: 700 }
const sectionTitle = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, marginBottom: 4 }
const sectionDesc = { fontSize: '0.78rem', color: '#9a9890', lineHeight: 1.5, marginBottom: 14 }
const panelSection = { padding: '20px 22px', borderBottom: '1px solid #2a332e' }
const optionButton = (active) => ({
  background: active ? '#1c2621' : '#161e1a',
  border: `2px solid ${active ? '#b8860b' : '#2a332e'}`,
  borderRadius: 10,
  padding: '10px 12px',
  cursor: 'pointer',
  color: active ? '#d4a017' : '#e8e6e1',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.76rem',
  fontWeight: 600,
  textAlign: 'left',
  transition: 'all 0.2s',
})
const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  background: '#161e1a',
  border: '1.5px solid #2a332e',
  borderRadius: 8,
  color: '#e8e6e1',
  fontSize: '0.83rem',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
}

export default function ConfigPanel({ cfg, onUpdate }) {
  const [previewDesign, setPreviewDesign] = useState(null)
  const automationOptions = getAutomationOptions(cfg.gateType)

  const updateDesign = (designId) => {
    const design = getDesignCategory(designId)
    onUpdate({ designCategory: design.id, material: design.material, slatStyle: design.slatStyle })
  }

  const updateGateType = (gateType) => {
    onUpdate({ gateType, automation: getDefaultAutomation(gateType), motor: true })
  }

  const updatePowerSupply = (powerSupply) => {
    onUpdate({ powerSupply, solar: powerSupply === 'solar-system' })
  }

  return (
    <>
    <div style={{ width: 360, minWidth: 360, background: '#111916', borderRight: '1px solid #2a332e', overflowY: 'auto', flexShrink: 0 }}>
      <div style={panelSection}>
        <div style={sectionLabel}>01 — Gate Design</div>
        <div style={sectionTitle}>Choose Your Design</div>
        <div style={sectionDesc}>Select from the same design categories used by the Instant Online Quote system.</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {DESIGN_CATEGORIES.map((design) => {
            const active = cfg.designCategory === design.id
            return (
              <div
                key={design.id}
                onClick={() => updateDesign(design.id)}
                style={{
                  ...optionButton(active),
                  padding: 0,
                  overflow: 'hidden',
                }}
              >
                {design.image && (
                  <img
                    src={design.image}
                    alt={`${design.label} example`}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 78,
                      objectFit: 'cover',
                      borderBottom: `1px solid ${active ? '#b8860b' : '#2a332e'}`,
                    }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px' }}>
                  <span>{design.label}</span>
                  {design.image && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setPreviewDesign(design)
                      }}
                      style={{
                        border: '1px solid #3d4b43',
                        borderRadius: 999,
                        background: '#0a0f0d',
                        color: '#d4a017',
                        cursor: 'pointer',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        padding: '5px 9px',
                        textTransform: 'uppercase',
                        letterSpacing: 0.8,
                      }}
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={panelSection}>
        <div style={sectionLabel}>02 — Gate Type and Size</div>
        <div style={sectionTitle}>Gate Type</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          {GATE_TYPES.map((gt) => (
            <button key={gt.id} onClick={() => updateGateType(gt.id)} style={{ ...optionButton(cfg.gateType === gt.id), textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{gt.icon}</div>
              {gt.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          <label style={{ fontSize: '0.75rem', color: '#9a9890' }}>
            Width in mm
            <input type="number" min="1500" max="8000" step="100" value={Math.round(cfg.width * 1000)} onChange={(e) => onUpdate('width', Number(e.target.value) / 1000)} style={{ ...inputStyle, marginTop: 6 }} />
          </label>
          <label style={{ fontSize: '0.75rem', color: '#9a9890' }}>
            Height in mm
            <input type="number" min="900" max="2400" step="100" value={Math.round(cfg.height * 1000)} onChange={(e) => onUpdate('height', Number(e.target.value) / 1000)} style={{ ...inputStyle, marginTop: 6 }} />
          </label>
        </div>
      </div>

      <div style={panelSection}>
        <div style={sectionLabel}>03 — Power Supply and Automation</div>
        <div style={sectionTitle}>Power Supply</div>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {POWER_SUPPLIES.map((power) => <button key={power.id} onClick={() => updatePowerSupply(power.id)} style={optionButton(cfg.powerSupply === power.id)}>{power.label}</button>)}
        </div>
        <div style={{ ...sectionTitle, marginTop: 18 }}>Automation</div>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {automationOptions.map((automation) => <button key={automation.id} onClick={() => onUpdate({ automation: automation.id, motor: true })} style={optionButton(cfg.automation === automation.id)}>{automation.label}</button>)}
        </div>
      </div>

      <div style={panelSection}>
        <div style={sectionLabel}>04 — Timeline</div>
        <div style={sectionTitle}>Project Timeline</div>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {TIMELINES.map((timeline) => <button key={timeline.id} onClick={() => onUpdate('timeline', timeline.id)} style={optionButton(cfg.timeline === timeline.id)}>{timeline.label}</button>)}
        </div>
      </div>

      <div style={{ ...panelSection, borderBottom: 'none' }}>
        <div style={sectionLabel}>Colour</div>
        <div style={sectionTitle}>Gate Colour</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          {COLORS.map((c) => {
            const active = cfg.color === c.hex
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => onUpdate({ color: c.hex, colorName: c.name })}
                title={`${c.name} ${c.hex}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 9px',
                  borderRadius: 10,
                  border: `2px solid ${active ? '#d4a017' : '#2a332e'}`,
                  background: active ? '#1c2621' : '#161e1a',
                  color: active ? '#d4a017' : '#e8e6e1',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: c.hex,
                    border: c.hex.toLowerCase() === '#f5f0e8' ? '1px solid #d8d2c7' : '1px solid rgba(255,255,255,0.22)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ display: 'grid', gap: 1 }}>
                  <span>{c.name}</span>
                  <span style={{ color: '#6b6960', fontSize: '0.58rem', letterSpacing: 0.6 }}>{c.hex.toUpperCase()}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#9a9890', marginTop: 8 }}>Selected powder coat: {cfg.colorName}</div>
      </div>
    </div>
    {previewDesign && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${previewDesign.label} preview`}
        onClick={() => setPreviewDesign(null)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            width: 'min(860px, 92vw)',
            background: '#111916',
            border: '1px solid #b8860b',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 18px', borderBottom: '1px solid #2a332e' }}>
            <div style={{ fontWeight: 700, color: '#d4a017' }}>{previewDesign.label}</div>
            <button type="button" onClick={() => setPreviewDesign(null)} style={{ background: '#1c2621', border: '1px solid #2a332e', borderRadius: 8, color: '#e8e6e1', cursor: 'pointer', padding: '6px 10px' }}>Close</button>
          </div>
          <img src={previewDesign.image} alt={`${previewDesign.label} full preview`} style={{ display: 'block', width: '100%', maxHeight: '72vh', objectFit: 'contain', background: '#0a0f0d' }} />
        </div>
      </div>
    )}
    </>
  )
}
