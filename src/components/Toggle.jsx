import React from 'react'

export default function Toggle({ checked, onChange, label, sub }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid rgba(42,51,46,0.5)',
      }}
    >
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.68rem', color: '#6b6960', marginTop: 2 }}>
          {sub}
        </div>
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 46,
          height: 24,
          borderRadius: 12,
          cursor: 'pointer',
          background: checked ? '#b8860b' : '#2a332e',
          position: 'relative',
          transition: 'background 0.3s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 3,
            left: checked ? 25 : 3,
            transition: 'left 0.3s',
          }}
        />
      </div>
    </div>
  )
}
