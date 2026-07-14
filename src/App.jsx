import React, { useCallback, useRef, useState } from 'react'
import Header from './components/Header'
import ConfigPanel from './components/ConfigPanel'
import Viewport3D from './components/Viewport3D'
import QuotePanel from './components/QuotePanel'
import { DEFAULT_CONFIG } from './data/config'

export default function App() {
  const [cfg, setCfg] = useState(DEFAULT_CONFIG)
  const screenshotCaptureRef = useRef(null)

  const onUpdate = (key, val) => {
    if (typeof key === 'object') {
      setCfg((prev) => ({ ...prev, ...key }))
      return
    }
    setCfg((prev) => ({ ...prev, [key]: val }))
  }

  const registerScreenshotCapture = useCallback((captureScreenshot) => {
    screenshotCaptureRef.current = captureScreenshot
  }, [])

  const getScreenshot = useCallback(() => screenshotCaptureRef.current?.(), [])

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
        <Viewport3D cfg={cfg} onCaptureScreenshot={registerScreenshotCapture} />
        <QuotePanel cfg={cfg} getScreenshot={getScreenshot} />
      </div>
    </div>
  )
}
