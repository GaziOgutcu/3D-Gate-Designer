import React from 'react'

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 18,
        padding: '10px 24px',
        background: 'rgba(10,15,13,0.97)',
        borderBottom: '1px solid #2a332e',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <a href="/" aria-label="Custom Auto Gates home" style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0 }}>
        <img
          src="/logo.png"
          alt="Custom Auto Gates"
          style={{
            display: 'block',
            width: 'clamp(600px, 88vw, 920px)',
            maxHeight: 108,
            objectFit: 'contain',
          }}
        />
      </a>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: '0.78rem',
          color: '#9a9890',
          whiteSpace: 'nowrap',
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
