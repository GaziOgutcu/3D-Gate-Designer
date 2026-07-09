import React from 'react'
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
    <div style={{ width: 360, minWidth: 360, background: '#111916', borderRight: '1px solid #2a332e', overflowY: 'auto', flexShrink: 0 }}>
      <div style={panelSection}>
        <div style={sectionLabel}>01 — Gate Design</div>
        <div style={sectionTitle}>Choose Your Design</div>
        <div style={sectionDesc}>Select from the same design categories used by the Instant Online Quote system.</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {DESIGN_CATEGORIES.map((design) => (
            <button key={design.id} onClick={() => updateDesign(design.id)} style={optionButton(cfg.designCategory === design.id)}>
              {design.label}
            </button>
          ))}
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
        <div style={sectionLabel}>04 — Timeline / Estimate</div>
        <div style={sectionTitle}>Project Timeline</div>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {TIMELINES.map((timeline) => <button key={timeline.id} onClick={() => onUpdate('timeline', timeline.id)} style={optionButton(cfg.timeline === timeline.id)}>{timeline.label}</button>)}
        </div>
      </div>

      <div style={{ ...panelSection, borderBottom: 'none' }}>
        <div style={sectionLabel}>Colour</div>
        <div style={sectionTitle}>Gate Colour</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          {COLORS.map((c) => (
            <div key={c.hex} onClick={() => onUpdate({ color: c.hex, colorName: c.name })} title={c.name} style={{ width: 36, height: 36, borderRadius: '50%', background: c.hex, cursor: 'pointer', border: `3px solid ${cfg.color === c.hex ? '#d4a017' : '#2a332e'}`, boxShadow: cfg.color === c.hex ? '0 0 0 3px rgba(184,134,11,0.25)' : 'none', transform: cfg.color === c.hex ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.2s' }} />
          ))}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#9a9890', marginTop: 8 }}>Selected: {cfg.colorName}</div>
      </div>
    </div>
  )
}
