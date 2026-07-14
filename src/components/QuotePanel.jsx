import React, { useState } from 'react'
import {
  AUTOMATION_OPTIONS,
  DESIGN_CATEGORIES,
  GATE_TYPES,
  POWER_SUPPLIES,
  TIMELINES,
} from '../data/config'
import { emailConfig, isEmailConfigured, sendInquiryEmail } from '../services/email'

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

function buildInquiryEmail(form, summaryRows) {
  const summary = summaryRows.map(([label, value]) => `${label}: ${value ?? 'Not selected'}`).join('\n')
  const body = [
    'New 3D gate design inquiry',
    '',
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `Customer email: ${form.email}`,
    `Address: ${form.address || 'Not provided'}`,
    '',
    'Design summary:',
    summary,
    '',
    'Customer notes:',
    form.notes || 'None',
  ].join('\n')

  return `mailto:${emailConfig.toEmail}?subject=${encodeURIComponent('New 3D gate design inquiry')}&body=${encodeURIComponent(body)}`
}

export default function QuotePanel({ cfg }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const summaryRows = [
    ['Gate Design', DESIGN_CATEGORIES.find((design) => design.id === cfg.designCategory)?.label],
    ['Gate Type', GATE_TYPES.find((g) => g.id === cfg.gateType)?.label],
    ['Size', `${Math.round(cfg.width * 1000)}mm × ${Math.round(cfg.height * 1000)}mm`],
    ['Power Supply', POWER_SUPPLIES.find((power) => power.id === cfg.powerSupply)?.label],
    ['Automation', AUTOMATION_OPTIONS.find((automation) => automation.id === cfg.automation)?.label],
    ['Timeline', TIMELINES.find((timeline) => timeline.id === cfg.timeline)?.label],
    ['Colour', cfg.colorName],
  ]

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || sending) return
    setSending(true)
    setSendError('')
    const result = await sendInquiryEmail({ form, summaryRows })
    setSending(false)

    if (result.ok) {
      setSubmitted(true)
      return
    }

    if (result.reason === 'missing-email-config') {
      window.open(buildInquiryEmail(form, summaryRows), '_blank', 'noopener,noreferrer')
      setSubmitted(true)
      return
    }

    console.error('EmailJS inquiry send failed:', result.reason)
    setSendError(`Email could not be sent. EmailJS returned: ${result.reason || 'unknown error'}`)
  }

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
          Send Inquiry
        </h2>
        <p style={{ fontSize: '0.73rem', color: '#9a9890', margin: 0 }}>
          Submit your 3D design and we will email your quote after review.
          {isEmailConfigured() ? '' : ' EmailJS setup is required for direct notifications.'}
        </p>
      </div>

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
              gap: 12,
              padding: '6px 0',
            }}
          >
            <span style={{ color: '#9a9890' }}>{k}</span>
            <span style={{ fontWeight: 600, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: '1px solid #2a332e',
            paddingTop: 12,
            marginTop: 8,
            color: '#d4a017',
            fontSize: '0.74rem',
            lineHeight: 1.45,
            fontWeight: 700,
          }}
        >
          No online price is shown. A reviewed quote will be sent to the customer email address.
        </div>
      </div>

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

        {sendError && (
          <div style={{ marginBottom: 12, color: '#ff8a8a', fontSize: '0.72rem', lineHeight: 1.4 }}>
            {sendError}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: 13,
            marginTop: 'auto',
            background: 'linear-gradient(135deg, #b8860b, #d4a017)',
            color: '#0a0f0d',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: '0.88rem',
            border: 'none',
            borderRadius: 10,
            cursor: sending ? 'wait' : 'pointer',
            opacity: sending ? 0.65 : 1,
            letterSpacing: 0.5,
            transition: 'all 0.3s',
          }}
        >
          {sending ? 'Sending inquiry...' : 'Send Inquiry →'}
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
            ✉
          </div>
          <div style={{ fontSize: '0.68rem', color: '#4a9e6d', lineHeight: 1.4 }}>
            <strong>Quote by email</strong>
            <br />
            Our team will review the design before sending quote details.
          </div>
        </div>
      </div>

      {submitted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Inquiry submitted"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              width: 'min(420px, 92vw)',
              background: '#111916',
              border: '1px solid #4a9e6d',
              borderRadius: 16,
              padding: 22,
              boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>✓</div>
            <h3 style={{ margin: 0, marginBottom: 8, color: '#d4a017' }}>Inquiry received</h3>
            <p style={{ margin: 0, color: '#e8e6e1', fontSize: '0.86rem', lineHeight: 1.5 }}>
              Thanks {form.name}. Your design inquiry has been sent to {emailConfig.toEmail}. A reviewed quote will be sent to {form.email}.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                marginTop: 18,
                padding: '9px 14px',
                border: 'none',
                borderRadius: 9,
                background: '#4a9e6d',
                color: '#0a0f0d',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
