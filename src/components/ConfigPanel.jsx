import React from 'react'
import Toggle from './Toggle'
import { GATE_TYPES, MATERIALS, SLAT_STYLES, COLORS } from '../data/config'

const sectionLabel = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '2.5px',
  color: '#b8860b',
  marginBottom: 14,
  fontWeight: 700,
}

const sectionTitle = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '1.05rem',
  fontWeight: 600,
  marginBottom: 4,
}

const sectionDesc = {
  fontSize: '0.78rem',
  color: '#9a9890',
  lineHeight: 1.5,
  marginBottom: 14,
}

const panelSection = {
  padding: '20px 22px',
  borderBottom: '1px solid #2a332e',
}

export default function ConfigPanel({ cfg, onUpdate }) {
  return (
    <div
      style={{
        width: 360,
        minWidth: 360,
        background: '#111916',
        borderRight: '1px solid #2a332e',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Gate Type */}
      <div style={panelSection}>
        <div style={sectionLabel}>01 — Gate Type</div>
        <div style={sectionTitle}>Choose Your Style</div>
        <div style={sectionDesc}>
          Select the gate that suits your property.
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          {GATE_TYPES.map((gt) => (
            <div
              key={gt.id}
              onClick={() => {
                onUpdate('gateType', gt.id)
                if (gt.id === 'pedestrian') onUpdate('width', 1.2)
              }}
              style={{
                background:
                  cfg.gateType === gt.id ? '#1c2621' : '#161e1a',
                border: `2px solid ${cfg.gateType === gt.id ? '#b8860b' : '#2a332e'}`,
                borderRadius: 10,
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>
                {gt.icon}
              </div>
              <div style={{ fontSize: '0.76rem', fontWeight: 600 }}>
                {gt.label}
              </div>
              <div
                style={{ fontSize: '0.63rem', color: '#6b6960', marginTop: 2 }}
              >
                {gt.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material */}
      <div style={panelSection}>
        <div style={sectionLabel}>02 — Material</div>
        <div style={sectionTitle}>Select Material</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            marginTop: 12,
          }}
        >
          {MATERIALS.map((m) => (
            <div
              key={m.id}
              onClick={() => onUpdate('material', m.id)}
              style={{
                background:
                  cfg.material === m.id ? '#1c2621' : '#161e1a',
                border: `2px solid ${cfg.material === m.id ? '#b8860b' : '#2a332e'}`,
                borderRadius: 10,
                padding: '12px 8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>
                {m.icon}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                {m.label}
              </div>
              <div
                style={{ fontSize: '0.62rem', color: '#6b6960', marginTop: 2 }}
              >
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slat Style */}
      <div style={panelSection}>
        <div style={sectionLabel}>03 — Infill Design</div>
        <div style={sectionTitle}>Panel Style</div>
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginTop: 12,
          }}
        >
          {SLAT_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => onUpdate('slatStyle', s.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '0.73rem',
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                background:
                  cfg.slatStyle === s.id
                    ? 'rgba(184,134,11,0.12)'
                    : '#161e1a',
                border: `2px solid ${cfg.slatStyle === s.id ? '#b8860b' : '#2a332e'}`,
                color:
                  cfg.slatStyle === s.id ? '#d4a017' : '#e8e6e1',
                transition: 'all 0.2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colour */}
      <div style={panelSection}>
        <div style={sectionLabel}>04 — Colour</div>
        <div style={sectionTitle}>Gate Colour</div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 12,
          }}
        >
          {COLORS.map((c) => (
            <div
              key={c.hex}
              onClick={() => {
                onUpdate('color', c.hex)
                onUpdate('colorName', c.name)
              }}
              title={c.name}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: c.hex,
                cursor: 'pointer',
                border: `3px solid ${cfg.color === c.hex ? '#d4a017' : '#2a332e'}`,
                boxShadow:
                  cfg.color === c.hex
                    ? '0 0 0 3px rgba(184,134,11,0.25)'
                    : 'none',
                transform:
                  cfg.color === c.hex ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
        <div
          style={{ fontSize: '0.7rem', color: '#9a9890', marginTop: 8 }}
        >
          Selected: {cfg.colorName}
        </div>
      </div>

      {/* Dimensions */}
      <div style={panelSection}>
        <div style={sectionLabel}>05 — Dimensions</div>
        <div style={sectionTitle}>Gate Size</div>

        <div style={{ marginTop: 14 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>Width</span>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#d4a017',
                background: 'rgba(184,134,11,0.12)',
                padding: '2px 10px',
                borderRadius: 12,
              }}
            >
              {cfg.width.toFixed(1)}m
            </span>
          </div>
          <input
            type="range"
            min="1.5"
            max="8"
            step="0.1"
            value={cfg.width}
            onChange={(e) => onUpdate('width', parseFloat(e.target.value))}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>Height</span>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#d4a017',
                background: 'rgba(184,134,11,0.12)',
                padding: '2px 10px',
                borderRadius: 12,
              }}
            >
              {cfg.height.toFixed(1)}m
            </span>
          </div>
          <input
            type="range"
            min="0.9"
            max="2.4"
            step="0.1"
            value={cfg.height}
            onChange={(e) =>
              onUpdate('height', parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      {/* Extras */}
      <div style={{ ...panelSection, borderBottom: 'none' }}>
        <div style={sectionLabel}>06 — Extras & Automation</div>
        <div style={sectionTitle}>Add-ons</div>
        <div style={{ marginTop: 10 }}>
          <Toggle
            checked={cfg.motor}
            onChange={(v) => onUpdate('motor', v)}
            label="Gate Motor"
            sub="Electric automation system"
          />
          <Toggle
            checked={cfg.solar}
            onChange={(v) => onUpdate('solar', v)}
            label="Solar Power"
            sub="Off-grid solar kit"
          />
          <Toggle
            checked={cfg.intercom}
            onChange={(v) => onUpdate('intercom', v)}
            label="Intercom / Keypad"
            sub="Access control entry"
          />
          <Toggle
            checked={cfg.sensors}
            onChange={(v) => onUpdate('sensors', v)}
            label="Safety Sensors"
            sub="Photo beam sensors"
          />
        </div>
      </div>
    </div>
  )
}
