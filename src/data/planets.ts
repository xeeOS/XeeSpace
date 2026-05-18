/**
 * Planet data: HUD facts, background glow color, accent color, and spec table.
 * Add or edit entries here to extend the dropdown without touching any other file.
 */

interface PlanetData {
  title: string;
  desc: string;
  glowColor: string;
  accentColor: string;
  specs: { label: string; val: string }[];
}

export const PLANETS: Record<string, PlanetData> = {
  mercury: {
    title: 'MERCURY',
    desc: 'The smallest planet, scorched and closest to our sun.',
    glowColor: '#1a1310',
    accentColor: '#b8b8b8',
    specs: [
      { label: 'RADIUS', val: '2,439 KM' },
      { label: 'DIST', val: '58M KM' },
      { label: 'ORBIT', val: '88 DAYS' },
    ],
  },
  venus: {
    title: 'VENUS',
    desc: 'A toxic atmosphere causing a runaway greenhouse effect.',
    glowColor: '#1f1606',
    accentColor: '#ffc16b',
    specs: [
      { label: 'RADIUS', val: '6,052 KM' },
      { label: 'DIST', val: '108M KM' },
      { label: 'SURFACE TEMP', val: '465°C' },
    ],
  },
  earth: {
    title: 'EARTH',
    desc: 'Our home, the only known harbor of life.',
    glowColor: '#06131c',
    accentColor: '#6bb0ff',
    specs: [
      { label: 'RADIUS', val: '6,371 KM' },
      { label: 'DIST', val: '150M KM' },
      { label: 'AGE', val: '4.5B YEARS' },
    ],
  },
  mars: {
    title: 'MARS',
    desc: 'The Red Planet, dusty, cold, and desert-like.',
    glowColor: '#1f0804',
    accentColor: '#ff5e40',
    specs: [
      { label: 'RADIUS', val: '3,390 KM' },
      { label: 'DIST', val: '228M KM' },
      { label: 'MOONS', val: '2' },
    ],
  },
  jupiter: {
    title: 'JUPITER',
    desc: 'A massive gas giant, the largest planet in our system.',
    glowColor: '#1c120a',
    accentColor: '#ffaa70',
    specs: [
      { label: 'RADIUS', val: '69,911 KM' },
      { label: 'DIST', val: '778M KM' },
      { label: 'MOONS', val: '95' },
    ],
  },
  saturn: {
    title: 'SATURN',
    desc: 'Adorned with a dazzling, complex ring system of ice and rock.',
    glowColor: '#1a1708',
    accentColor: '#ffe170',
    specs: [
      { label: 'RADIUS', val: '58,232 KM' },
      { label: 'DIST', val: '1.4B KM' },
      { label: 'MAIN RINGS', val: '7' },
    ],
  },
  uranus: {
    title: 'URANUS',
    desc: 'An ice giant that rotates almost completely on its side.',
    glowColor: '#061517',
    accentColor: '#70fffa',
    specs: [
      { label: 'RADIUS', val: '25,362 KM' },
      { label: 'DIST', val: '2.9B KM' },
      { label: 'TILT', val: '97.7°' },
    ],
  },
  neptune: {
    title: 'NEPTUNE',
    desc: 'Dark, incredibly cold, and whipped by supersonic winds.',
    glowColor: '#070a24',
    accentColor: '#708cff',
    specs: [
      { label: 'RADIUS', val: '24,622 KM' },
      { label: 'DIST', val: '4.5B KM' },
      { label: 'WIND SPEED', val: '2,000 KM/H' },
    ],
  },
}
