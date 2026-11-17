
import * as THREE from 'three';

export function createFish(texture, species = 'lubina') {
  const positions = [];
  const colors = [];

// Paletas de colores por especie
const palettes = {
    lubina: {
      silver: '#c5f7ff',
      cyan: '#62d6ed',
      blue: '#2c79a6',
      fin: '#4ec7de'
    },
    pargo: {
      silver: '#ffd5a1',
      cyan: '#ff875e',
      blue: '#b73554',
      fin: '#ffb15e'
    }
  };
  
  const palette = palettes[species];
  
  const silver = new THREE.Color(palette.silver);
  const cyan = new THREE.Color(palette.cyan);
  const blue = new THREE.Color(palette.blue);
  const finColor = new THREE.Color(palette.fin);
  const eyeColor = new THREE.Color('#fff3cc');

  function addPoint(x, y, z, color) {
    positions.push(x, y, z);
    colors.push(color.r, color.g, color.b);
  }

  // CUERPO DEL PEZ
  // Distribuimos partículas sobre una superficie 3D.

  for (let i = 0; i < 9000; i++) {
    const t = Math.random();

    const x = -2.75 + t * 5.5;

    const profile = Math.pow(
      Math.max(0, Math.sin(Math.PI * t)),
      0.85
    );

    const radiusY = 0.12 + profile * 1.05;
    const radiusZ = 0.10 + profile * 0.48;

    const angle = Math.random() * Math.PI * 2;

    const y = Math.cos(angle) * radiusY;
    const z = Math.sin(angle) * radiusZ;

    const color =
      y > 0.25 ? blue :
      y < -0.3 ? silver : cyan;

    addPoint(x, y, z, color);
  }

  // FUNCIÓN PARA CREAR ALETAS TRIANGULARES

  function addTriangle(a, b, c, count, color) {
    for (let i = 0; i < count; i++) {
      const r1 = Math.sqrt(Math.random());
      const r2 = Math.random();

      const u = 1 - r1;
      const v = r1 * (1 - r2);
      const w = r1 * r2;

      addPoint(
        u * a[0] + v * b[0] + w * c[0],
        u * a[1] + v * b[1] + w * c[1],
        u * a[2] + v * b[2] + w * c[2],
        color
      );
    }
  }

  // COLA BIFURCADA
  addTriangle(
    [-2.65, 0.1, 0],
    [-4.15, 1.35, 0],
    [-3.55, 0.12, 0],
    850,
    finColor
  );

  addTriangle(
    [-2.65, -0.1, 0],
    [-3.55, -0.12, 0],
    [-4.15, -1.35, 0],
    850,
    finColor
  );

  // ALETA DORSAL
  addTriangle(
    [-2.0, 0.7, 0],
    [-1.25, 1.85, 0],
    [0.5, 1.05, 0],
    700,
    blue
  );

  addTriangle(
    [0.1, 0.9, 0],
    [0.75, 1.45, 0],
    [1.45, 0.65, 0],
    450,
    finColor
  );

  // ALETA INFERIOR
  addTriangle(
    [-1.8, -0.7, 0],
    [-1.2, -1.45, 0],
    [-0.3, -0.9, 0],
    450,
    finColor
  );

  // ALETA PECTORAL
  addTriangle(
    [1.1, -0.1, 0.35],
    [-0.5, -0.85, 0.8],
    [0.4, -0.25, 0.85],
    450,
    silver
  );

  // OJO LUMINOSO
  for (let i = 0; i < 180; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.11 + Math.random() * 0.035;

    addPoint(
      1.95 + Math.cos(angle) * radius,
      0.26 + Math.sin(angle) * radius,
      0.5,
      eyeColor
    );
  }

  // PUPILA
  for (let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 0.045;

    addPoint(
      1.95 + Math.cos(angle) * radius,
      0.26 + Math.sin(angle) * radius,
      0.52,
      blue
    );
  }

  // LÍNEA DE LAS BRANQUIAS
  for (let i = 0; i < 220; i++) {
    const t = Math.random();

    addPoint(
      1.2 + Math.sin((t - 0.5) * Math.PI) * 0.16,
      0.45 - t * 0.9,
      0.44,
      silver
    );
  }

  // CONSTRUIR BUFFERGEOMETRY
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3)
  );

  // MATERIAL DE PARTÍCULAS
  const material = new THREE.PointsMaterial({
    size: 0.09,
    map: texture,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const fish = new THREE.Points(geometry, material);

  fish.scale.setScalar(1.5);
  fish.position.z = 2;

  return fish;
}
