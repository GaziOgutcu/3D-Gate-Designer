import React from 'react'

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(10,15,13,0.97)',
        borderBottom: '1px solid #2a332e',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #b8860b, #d4a017)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: 17,
            color: '#0a0f0d',
          }}
        >
          CA
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.1rem',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Custom Auto <span style={{ color: '#b8860b' }}>Gates</span>
          </div>
          <div
            style={{
              fontSize: '0.55rem',
              letterSpacing: 2,
              color: '#6b6960',
              textTransform: 'uppercase',
            }}
          >
            3D Gate Designer
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: '0.78rem',
          color: '#9a9890',
        }}
      >
        <span style={{ opacity: 0.6 }}>Brisbane · Logan · Ipswich</span>
        <div
          style={{
            background: '#161e1a',
            padding: '6px 14px',
            borderRadius: 20,
            border: '1px solid #2a332e',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          📞{' '}
          <a
            href="tel:0731021801"
            style={{
              color: '#d4a017',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            (07) 3102 1801
          </a>
        </div>
      </div>
    </header>
  )
}
