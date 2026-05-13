import React, { useState } from 'react'
import Header from './components/Header'
import ConfigPanel from './components/ConfigPanel'
import Viewport3D from './components/Viewport3D'
import QuotePanel from './components/QuotePanel'
import { DEFAULT_CONFIG, calcPrice } from './data/config'

export default function App() {
  const [cfg, setCfg] = useState(DEFAULT_CONFIG)

  const onUpdate = (key, val) => {
    setCfg((prev) => ({ ...prev, [key]: val }))
  }

  const price = calcPrice(cfg)
  const priceStr = '$' + price.toLocaleString()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#0a0f0d',
        color: '#e8e6e1',
      }}
    >
      <Header />

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <ConfigPanel cfg={cfg} onUpdate={onUpdate} />
        <Viewport3D cfg={cfg} priceStr={priceStr} />
        <QuotePanel cfg={cfg} priceStr={priceStr} />
      </div>
    </div>
  )
}
