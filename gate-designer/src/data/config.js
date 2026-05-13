export const GATE_TYPES = [
  { id: 'sliding', label: 'Sliding Gate', sub: 'Space-saving', icon: '⇥' },
  { id: 'swing-single', label: 'Swing Single', sub: 'Classic entry', icon: '⤺' },
  { id: 'swing-double', label: 'Swing Double', sub: 'Wide entrance', icon: '⟺' },
  { id: 'pedestrian', label: 'Pedestrian', sub: 'Walk-through', icon: '🚶' },
]

export const MATERIALS = [
  { id: 'aluminium', label: 'Aluminium', sub: 'Rust-free', icon: '◇' },
  { id: 'steel', label: 'Steel', sub: 'Heavy-duty', icon: '◆' },
  { id: 'colorbond', label: 'Colorbond', sub: 'Weather-proof', icon: '▣' },
]

export const SLAT_STYLES = [
  { id: 'horizontal', label: 'Horizontal Slat' },
  { id: 'vertical', label: 'Vertical Slat' },
  { id: 'louvre', label: 'Louvre' },
  { id: 'spear', label: 'Spear Top' },
  { id: 'flat', label: 'Flat Panel' },
]

export const COLORS = [
  { hex: '#1a1a1a', name: 'Satin Black' },
  { hex: '#2c2c2c', name: 'Charcoal' },
  { hex: '#f5f0e8', name: 'Surfmist' },
  { hex: '#3d4637', name: 'Woodland Grey' },
  { hex: '#6a5b4e', name: 'Jasper' },
  { hex: '#c0b69f', name: 'Evening Haze' },
  { hex: '#384048', name: 'Monument' },
  { hex: '#8b0000', name: 'Manor Red' },
]

export const DEFAULT_CONFIG = {
  gateType: 'sliding',
  material: 'aluminium',
  slatStyle: 'horizontal',
  color: '#1a1a1a',
  colorName: 'Satin Black',
  width: 4.0,
  height: 1.8,
  motor: true,
  solar: false,
  intercom: false,
  sensors: false,
}

export function calcPrice(cfg) {
  let base = 0
  const area = cfg.width * cfg.height
  if (cfg.gateType === 'sliding') base = 2200
  else if (cfg.gateType === 'swing-single') base = 1800
  else if (cfg.gateType === 'swing-double') base = 2800
  else base = 1200
  base += area * 280
  if (cfg.material === 'steel') base *= 1.15
  else if (cfg.material === 'colorbond') base *= 0.95
  if (cfg.slatStyle === 'louvre') base *= 1.1
  else if (cfg.slatStyle === 'spear') base *= 1.08
  if (cfg.motor) base += 950
  if (cfg.solar) base += 750
  if (cfg.intercom) base += 450
  if (cfg.sensors) base += 220
  return Math.round(base / 10) * 10
}
