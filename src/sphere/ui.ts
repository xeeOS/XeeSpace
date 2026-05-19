import { PLANETS } from '../data/planets'

const hudTitle = document.getElementById('hud-title') as HTMLElement
const hudDesc = document.getElementById('hud-desc') as HTMLElement
const hudSpecs = document.getElementById('hud-specs') as HTMLElement
const bgGlow = document.getElementById('bg-glow') as HTMLElement
const root = document.documentElement

let typeTimeouts: number[] = []

function clearTyper(): void {
  typeTimeouts.forEach(clearTimeout)
  typeTimeouts = []
}

function typeText(el: HTMLElement, text: string, speed: number, callback?: () => void): void {
  el.innerHTML = ''
  let i = 0
  function next() {
    if (i < text.length) {
      const cursor = Math.random() > 0.5
        ? '█'
        : '<span style="opacity:0">█</span>'
      el.innerHTML = text.substring(0, i + 1) + cursor
      i++
      typeTimeouts.push(window.setTimeout(next, speed))
    } else {
      el.innerHTML = text
      if (callback) callback()
    }
  }
  next()
}

export function animateFact(planetKey: string): void {
  const data = PLANETS[planetKey]
  if (!data) return

  root.style.setProperty('--accent', data.accentColor)
  bgGlow.style.color = data.glowColor

  clearTyper()
  hudTitle.innerHTML = ''
  hudDesc.innerHTML = ''
  hudSpecs.innerHTML = ''
  hudSpecs.classList.remove('visible')

  typeText(hudTitle, data.title, 40, () => {
    typeText(hudDesc, data.desc, 20, () => {
      hudSpecs.innerHTML = data.specs
        .map(s => `<div class="spec-item">${s.label} // <span>${s.val}</span></div>`)
        .join('')
      setTimeout(() => hudSpecs.classList.add('visible'), 50)
    })
  })
}

export function onPlanetSelect(fn: (planetKey: string) => void): void { }
