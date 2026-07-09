export const DESIGN_CATEGORIES = [
  { id: 'bare-frame', label: 'Bare Frame', material: 'aluminium', slatStyle: 'bare' },
  { id: 'bare-frame-powder-coated', label: 'Bare Frame Powder Coated', material: 'aluminium', slatStyle: 'bare' },
  { id: 'vertical-tube-gate', label: 'Vertical Tube Gate', material: 'aluminium', slatStyle: 'vertical' },
  { id: 'curve-top-tube-gate', label: 'Curve Top Tube Gate', material: 'aluminium', slatStyle: 'curve-tube' },
  { id: 'slat-gate-horizontal', label: 'Slat Gate Horizontal', material: 'aluminium', slatStyle: 'horizontal' },
  { id: 'slat-gate-vertical', label: 'Slat Gate Vertical', material: 'aluminium', slatStyle: 'vertical' },
  { id: 'architectural-face-weld', label: 'Architectural Face Weld', material: 'steel', slatStyle: 'architectural' },
  { id: 'hampton-style', label: 'Hampton Style', material: 'aluminium', slatStyle: 'hampton' },
  { id: 'colorbond-infill', label: 'Colorbond Infill', material: 'colorbond', slatStyle: 'flat' },
  { id: 'security-gate', label: 'Security Gate', material: 'steel', slatStyle: 'security' },
]

export const GATE_TYPES = [
  { id: 'sliding', label: 'Sliding Gate', sub: 'Space-saving', icon: '⇥' },
  { id: 'swing-double', label: 'Dual Swing Gates', sub: 'Wide entrance', icon: '⟺' },
]

export const POWER_SUPPLIES = [
  { id: 'low-voltage', label: 'Low Voltage' },
  { id: 'solar-system', label: 'Solar System' },
  { id: '240-volt-plug-in', label: '240 Volt Plug In' },
]

export const AUTOMATION_OPTIONS = [
  { id: 'residential-slide-motor', label: 'Residential Slide Motor', gateTypes: ['sliding'] },
  { id: 'residential-dual-swing-motors', label: 'Residential Dual Swing Motors', gateTypes: ['swing-double'] },
]

export const TIMELINES = [
  { id: 'budgeting-and-planning', label: 'Budgeting and Planning' },
  { id: 'site-visit-within-2-weeks', label: 'Ready to get a site visit within 2 weeks' },
  { id: 'need-this-yesterday', label: 'Need this yesterday!' },
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
  designCategory: 'slat-gate-horizontal',
  gateType: 'sliding',
  material: 'aluminium',
  slatStyle: 'horizontal',
  color: '#1a1a1a',
  colorName: 'Satin Black',
  width: 4.0,
  height: 1.8,
  powerSupply: 'low-voltage',
  automation: 'residential-slide-motor',
  timeline: 'budgeting-and-planning',
  motor: true,
  solar: false,
  intercom: false,
  sensors: false,
}

export function getDesignCategory(id) {
  return DESIGN_CATEGORIES.find((design) => design.id === id) ?? DESIGN_CATEGORIES[0]
}

export function getAutomationOptions(gateType) {
  return AUTOMATION_OPTIONS.filter((option) => option.gateTypes.includes(gateType))
}

export function getDefaultAutomation(gateType) {
  return getAutomationOptions(gateType)[0]?.id ?? ''
}

export function normaliseQuoteConfig(cfg) {
  const design = getDesignCategory(cfg.designCategory)
  const validAutomation = getAutomationOptions(cfg.gateType).some((option) => option.id === cfg.automation)
  return {
    ...cfg,
    material: design.material,
    slatStyle: design.slatStyle,
    automation: validAutomation ? cfg.automation : getDefaultAutomation(cfg.gateType),
    motor: Boolean(validAutomation ? cfg.automation : getDefaultAutomation(cfg.gateType)),
    solar: cfg.powerSupply === 'solar-system',
  }
}

export function calcPrice(cfg) {
  const quoteCfg = normaliseQuoteConfig(cfg)
  let base = 0
  const area = quoteCfg.width * quoteCfg.height
  if (quoteCfg.gateType === 'sliding') base = 2200
  else if (quoteCfg.gateType === 'swing-double') base = 2800
  base += area * 280
  if (quoteCfg.material === 'steel') base *= 1.15
  else if (quoteCfg.material === 'colorbond') base *= 0.95
  if (quoteCfg.motor) base += 950
  if (quoteCfg.solar) base += 750
  if (quoteCfg.intercom) base += 450
  if (quoteCfg.sensors) base += 220
  return Math.round(base / 10) * 10
}

export function calcQuoteTotals(cfg) {
  const total = calcPrice(cfg)
  const tax = Math.round(total / 11)
  const subtotal = total - tax
  return { subtotal, tax, total }
}
