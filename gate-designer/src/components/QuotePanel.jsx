import React, { useState } from 'react'
import { GATE_TYPES, MATERIALS, SLAT_STYLES } from '../data/config'

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
}

const labelStyle = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#9a9890',
  textTransform: 'uppercase',
  letterSpacing: 1,
  display: 'block',
  marginBottom: 5,
}

export default function QuotePanel({ cfg, priceStr }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.email) return
    setSending(true)
    // Simulate API call — replace with real endpoint
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
    }, 1500)
  }

  const summaryRows = [
    ['Gate Type', GATE_TYPES.find((g) => g.id === cfg.gateType)?.label],
    ['Material', MATERIALS.find((m) => m.id === cfg.material)?.label],
    ['Infill', SLAT_STYLES.find((s) => s.id === cfg.slatStyle)?.label],
    ['Colour', cfg.colorName],
    ['Size', `${cfg.width.toFixed(1)}m × ${cfg.height.toFixed(1)}m`],
    ['Motor', cfg.motor ? 'Yes' : 'No'],
    ['Solar', cfg.solar ? 'Yes' : 'No'],
    ['Intercom', cfg.intercom ? 'Yes' : 'No'],
  ]

  const fields = [
    { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'John Smith' },
    { key: 'phone', label: 'Phone *', type: 'tel', placeholder: '04XX XXX XXX' },
    { key: 'email', label: 'Email *', type: 'email', placeholder: 'you@example.com' },
    { key: 'address', label: 'Property Address', type: 'text', placeholder: '123 Street, Suburb QLD' },
  ]

  return (
    <div
      style={{
        width: 320,
        minWidth: 320,
        background: '#111916',
        borderLeft: '1px solid #2a332e',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 22px', borderBottom: '1px solid #2a332e' }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            margin: 0,
            marginBottom: 4,
          }}
        >
          Request a Quote
        </h2>
        <p style={{ fontSize: '0.73rem', color: '#9a9890', margin: 0 }}>
          Send your 3D design for an obligation-free quote.
        </p>
      </div>

      {/* Summary */}
      <div
        style={{
          padding: '16px 22px',
          borderBottom: '1px solid #2a332e',
          fontSize: '0.78rem',
        }}
      >
        {summaryRows.map(([k, v]) => (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
            }}
          >
            <span style={{ color: '#9a9890' }}>{k}</span>
            <span style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #2a332e',
            paddingTop: 12,
            marginTop: 8,
          }}
        >
          <span style={{ fontWeight: 600 }}>Estimate</span>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#d4a017',
            }}
          >
            {priceStr}
          </span>
        </div>
      </div>

      {/* Form */}
      <div
        style={{
          padding: '16px 22px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={(e) =>
                setForm((p) => ({ ...p, [f.key]: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
        ))}

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            placeholder="Any specific requirements..."
            value={form.notes}
            onChange={(e) =>
              setForm((p) => ({ ...p, notes: e.target.value }))
            }
            style={{
              ...inputStyle,
              minHeight: 60,
              resize: 'vertical',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={sending}
          style={{
            width: '100%',
            padding: 13,
            marginTop: 'auto',
            background: submitted
              ? '#4a9e6d'
              : 'linear-gradient(135deg, #b8860b, #d4a017)',
            color: '#0a0f0d',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: '0.88rem',
            border: 'none',
            borderRadius: 10,
            cursor: sending ? 'wait' : 'pointer',
            letterSpacing: 0.5,
            transition: 'all 0.3s',
            opacity: sending ? 0.6 : 1,
          }}
        >
          {sending
            ? 'Sending...'
            : submitted
              ? '✓ Quote Sent!'
              : 'Send Quote Request →'}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 14,
            padding: '10px 12px',
            background: 'rgba(74,158,109,0.08)',
            border: '1px solid rgba(74,158,109,0.2)',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              background: 'rgba(74,158,109,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: '0.68rem', color: '#4a9e6d', lineHeight: 1.4 }}>
            <strong>10-Year Structural Warranty</strong>
            <br />
            All aluminium gates quality guaranteed.
          </div>
        </div>
      </div>
    </div>
  )
}
