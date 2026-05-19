import './style.css'
import { renderer, scene, camera, group, morphTo, updateText, tick as tickParticles } from './sphere/particles'

import { init as initControls, tick as tickControls, state } from './sphere/controls'
//import { renderer, scene, camera, group, morphTo, tick as tickParticles } from './sphere/particles'
import { animateFact, onPlanetSelect } from './sphere/ui'

initControls()

// 1. Initial State (Light Theme / B&W / Sphere)
document.documentElement.style.setProperty('--accent', '#000000')
const bgGlow = document.getElementById('bg-glow')
if (bgGlow) bgGlow.style.color = 'transparent'

morphTo('sphere') // Boot cleanly into monochrome shape

const shapeButtons = document.querySelectorAll('.sidebar-nav .nav-item[data-shape]')

shapeButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Remove active class from all shape buttons
    shapeButtons.forEach(b => b.classList.remove('active'))

    // Add active class to clicked button
    const target = e.currentTarget as HTMLElement
    target.classList.add('active')

    // Morph to the selected shape
    const shape = target.getAttribute('data-shape')
    if (shape) morphTo(shape)
  })
})

const textInput = document.querySelector('.text-input') as HTMLInputElement
const textGroupEl = document.querySelector('.nav-item-group') as HTMLElement
const textHeaderEl = document.querySelector('.nav-item-header') as HTMLElement

function activateText(): void {
  updateText(textInput?.value.trim() || 'XEE')
  shapeButtons.forEach(b => b.classList.remove('active'))
  textGroupEl?.classList.add('active')
  morphTo('text')
}

textHeaderEl?.addEventListener('click', activateText)

textInput?.addEventListener('input', () => {
  updateText(textInput.value.trim() || 'XEE')
  shapeButtons.forEach(b => b.classList.remove('active'))
  textGroupEl?.classList.add('active')
  morphTo('text')
})

// Enter key as shortcut
textInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') activateText()
})

// Deactivate text group when another shape is picked
shapeButtons.forEach(btn => {
  btn.addEventListener('click', () => textGroupEl?.classList.remove('active'))
})

const btnEnterPlanets = document.getElementById('btn-enter-planets') as HTMLElement
const btnExitPlanets = document.getElementById('btn-exit-planets') as HTMLElement

btnEnterPlanets.addEventListener('click', () => {
  document.body.classList.replace('theme-light', 'theme-dark')
  planetButtons.forEach(b => b.classList.remove('active'))
  document.querySelector('.planet-nav-item[data-target="mercury"]')?.classList.add('active')
  morphTo('mercury')
  animateFact('mercury')
})

btnExitPlanets.addEventListener('click', () => {
  document.body.classList.replace('theme-dark', 'theme-light')

  // Strip colors, return to purely Black & White
  document.documentElement.style.setProperty('--accent', '#000000')
  if (bgGlow) bgGlow.style.color = 'transparent'

  // Return to whatever shape was active in the light UI (default to sphere)
  const activeBtn = document.querySelector('.sidebar-nav .nav-item.active') as HTMLElement
  const shape = activeBtn ? activeBtn.getAttribute('data-shape') : 'sphere'
  morphTo(shape || 'sphere')
})

const planetButtons = document.querySelectorAll('.planet-nav-item')
planetButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    planetButtons.forEach(b => b.classList.remove('active'))
    const target = e.currentTarget as HTMLElement
    target.classList.add('active')
    const planet = target.getAttribute('data-target')
    if (planet) {
      morphTo(planet)
      animateFact(planet)
    }
  })
})

//Render loop
function animate(time: number = 0): void {
  requestAnimationFrame(animate)

  const t = time * 0.001

  tickControls()

  group.rotation.x = state.rotX + (group.userData.swayX || 0)
  group.rotation.y = state.rotY + (group.userData.swayY || 0)

  camera.position.z = state.zoom

  tickParticles(t, state.mouse.x, state.mouse.y, state.isDrag)

  // Render the scene
  renderer.render(scene, camera)
}

// Start the loop
animate()
