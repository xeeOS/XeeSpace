/**
 * Controls module — owns all pointer/touch/wheel state.
 * Call init() once, then read the exported state object every frame.
 */

import * as THREE from 'three'

export const state = {
  mouse:       new THREE.Vector2(-99, -99),
  isDrag:      false,
  rotX:        0.18,
  rotY:        0,
  vRotX:       0,
  vRotY:       0,
  targetZoom:  10,
  zoom:        10,
}

let lastMX: number = 0
let lastMY: number = 0
let lastTouchDist: number = 0

export function init(): void {
  window.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('#planet-button')) return
    state.isDrag = true
    lastMX = e.clientX
    lastMY = e.clientY
  })

  window.addEventListener('mouseup', () => {
    state.isDrag = false
  })

  window.addEventListener('mousemove', (e: MouseEvent) => {
    if (state.isDrag) {
      const dx = e.clientX - lastMX
      const dy = e.clientY - lastMY
      
      // FIX: Changed -= to +=
      state.rotY  += dx * 0.005
      state.rotX  += dy * 0.005
      
      state.vRotY  = dx * 0.005
      state.vRotX  = dy * 0.005
      
      lastMX = e.clientX
      lastMY = e.clientY
      state.mouse.set(-99, -99)
      return
    }
    state.mouse.set(
      (e.clientX / window.innerWidth)  * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    )
  })

  window.addEventListener('mouseleave', () => {
    state.mouse.set(-99, -99)
    state.isDrag  = false
  })

  window.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault()
    state.targetZoom = Math.max(3.5, Math.min(15, state.targetZoom + e.deltaY * 0.006))
  }, { passive: false })

  //Touch
  window.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length === 1) {
      state.isDrag = true
      lastMX = e.touches[0].clientX
      lastMY = e.touches[0].clientY
    }
    if (e.touches.length === 2) {
      lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
    }
  }, { passive: true })

  window.addEventListener('touchmove', (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 1 && state.isDrag) {
      const dx = e.touches[0].clientX - lastMX
      const dy = e.touches[0].clientY - lastMY
      
      state.rotY += dx * 0.005
      state.rotX += dy * 0.005
      
      state.vRotY = dx * 0.005
      state.vRotX = dy * 0.005
      
      lastMX = e.touches[0].clientX
      lastMY = e.touches[0].clientY
    }
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      state.targetZoom = Math.max(3.5, Math.min(15, state.targetZoom - (d - lastTouchDist) * 0.02))
      lastTouchDist = d
    }
  }, { passive: false })

  window.addEventListener('touchend', () => {
    state.isDrag = false
  })
}

/**
 * Call once per frame (before rendering) to apply inertia and zoom easing.
 */
export function tick(): void {
  if (state.isDrag) {
    state.vRotX *= 0.8
    state.vRotY *= 0.8
  } else {
    state.vRotX *= 0.94
    state.vRotY *= 0.94
    state.rotX  += state.vRotX
    state.rotY  += state.vRotY + 0.0018   // auto-spin
  }

  state.zoom += (state.targetZoom - state.zoom) * 0.07
}
