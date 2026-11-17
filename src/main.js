
import * as THREE from 'three';
import './style.css';
import { createFish } from './fish.js';

// ==========================================
// 1. ESCENA
// ==========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color('#020510');

// ==========================================
// 2. CÁMARA
// ==========================================

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 16;

// ==========================================
// 3. RENDERIZADOR
// ==========================================

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

document.querySelector('#app').appendChild(
  renderer.domElement
);





 // FRASE DEL OCÉANO
 const quote = document.createElement('div');

 quote.textContent =
   'Qué suerte coincidir en este océano infinito.';
 
 quote.style.cssText = `
   position: fixed;
   bottom: 8%;
   left: 0;
   width: 100%;
   padding: 0 20px;
   box-sizing: border-box;
   z-index: 2147483647;
   color: #a3aebb;
   font-family: Georgia, serif;
   font-size: clamp(17px, 2.2vw, 25px);
   font-style: italic;
   text-align: center;
   letter-spacing: 1px;
   text-shadow: 0 0 12px rgba(120, 160, 190, 0.15);   pointer-events: none;
   opacity: 1;
 `;
 
 document.body.appendChild(quote);
 




// ==========================================
// 4. TEXTURA PROCEDURAL
// ==========================================

function createParticleTexture() {
  const canvas = document.createElement('canvas');

  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(
    32, 32, 0,
    32, 32, 32
  );

  gradient.addColorStop(
    0,
    'rgba(255,255,255,1)'
  );

  gradient.addColorStop(
    0.2,
    'rgba(180,240,255,0.9)'
  );

  gradient.addColorStop(
    0.5,
    'rgba(60,170,255,0.3)'
  );

  gradient.addColorStop(
    1,
    'rgba(0,0,0,0)'
  );

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

// ==========================================
// 5. PARTÍCULAS DEL OCÉANO
// ==========================================

const particleCount = 2000;

const positions = new Float32Array(
  particleCount * 3
);

const colors = new Float32Array(
  particleCount * 3
);

const palette = [
  new THREE.Color('#53dfff'),
  new THREE.Color('#548bff'),
  new THREE.Color('#b18cff')
];

for (let i = 0; i < particleCount; i++) {
  const index = i * 3;

  positions[index] =
    (Math.random() - 0.5) * 28;

  positions[index + 1] =
    (Math.random() - 0.5) * 18;

  positions[index + 2] =
    (Math.random() - 0.5) * 16;

  const color = palette[
    Math.floor(Math.random() * palette.length)
  ];

  colors[index] = color.r;
  colors[index + 1] = color.g;
  colors[index + 2] = color.b;
}

// Crear geometría
const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3)
);

// ==========================================
// 6. MATERIAL LUMINOSO
// ==========================================

// Este bloque faltaba en el código anterior
const material = new THREE.PointsMaterial({
  size: 0.18,
  map: createParticleTexture(),
  transparent: true,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true
});

// Crear océano
const particles = new THREE.Points(
  geometry,
  material
);

scene.add(particles);

// Guardar posiciones originales del océano
const originalPositions = positions.slice();

// ==========================================
// 7. CREAR NUESTROS DOS PECES
// ==========================================

// Lubina azul
const fish = createFish(
  material.map,
  'lubina'
);

// Pargo coral
const pargo = createFish(
  material.map,
  'pargo'
);


 // ADAPTAR LOS PECES A CADA PANTALLA

 function adjustFishLayout() {
  const isPortrait =
    window.innerWidth / window.innerHeight < 0.85;

  if (isPortrait) {
    // Celulares y pantallas verticales
    fish.scale.setScalar(0.58);
    pargo.scale.setScalar(0.58);

    fish.position.x = -1.8;
    pargo.position.x = 1.8;
  } else {
    // Computadoras y pantallas horizontales
    fish.scale.setScalar(1.05);
    pargo.scale.setScalar(1.05);

    fish.position.x = -4.4;
    pargo.position.x = 4.4;
  }
}


function adjustFishLayout() {
  const aspect = window.innerWidth / window.innerHeight;
  const isMobile = aspect < 0.85;

  if (isMobile) {
    // Composición vertical para celulares
    camera.position.z = 26;

    // Ajustar escala según el ancho disponible
    const scale = Math.min(1, aspect / 0.58);

    fish.scale.setScalar(scale);
    pargo.scale.setScalar(scale);

    // Peces en diagonal
    fish.position.x = -2.7 * scale;
    pargo.position.x = 2.7 * scale;

    // Altura base de cada pez
    fish.userData.baseY = 1.7 * scale;
    pargo.userData.baseY = -1.7 * scale;

  } else {
    // Composición original de computadora
    camera.position.z = 16;

    fish.scale.setScalar(1.05);
    pargo.scale.setScalar(1.05);

    fish.position.x = -4.4;
    pargo.position.x = 4.4;

    fish.userData.baseY = 0;
    pargo.userData.baseY = 0;
  }
}


// ==========================================
// 8. INTERACTIVIDAD CON EL CURSOR
// ==========================================

const mouse = {
  x: 0,
  y: 0
};

window.addEventListener('pointermove', (event) => {
  mouse.x =
    (event.clientX / window.innerWidth) * 2 - 1;

  mouse.y =
    -(event.clientY / window.innerHeight) * 2 + 1;
});

// ==========================================
// 9. ANIMACIÓN
// ==========================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // ----------------------------------------
  // ANIMACIÓN DE LOS PECES
  // ----------------------------------------

  for (const swimmer of swimmers) {
    const mesh = swimmer.mesh;
    const original = swimmer.original;
    const phase = swimmer.phase;


// Flotación suave respetando la posición inicial
mesh.position.y =
  (mesh.userData.baseY ?? 0) +
  Math.sin(time * 0.7 + phase) * 0.12;


    // Rotación suave
    mesh.rotation.y =
      swimmer.baseRotation +
      Math.sin(time * 0.5 + phase) * 0.18;

    // Movimiento procedural de la cola
    const attribute =
      mesh.geometry.attributes.position;

    for (let i = 0; i < attribute.count; i++) {
      const index = i * 3;

      const x = original[index];
      const originalZ = original[index + 2];

      // Intensidad hacia la cola
      const tailInfluence =
        THREE.MathUtils.smoothstep(
          -x,
          0.8,
          4.2
        );

      // Onda de natación
      const wave = Math.sin(
        time * 3 + phase + x * 0.7
      );

      attribute.array[index + 2] =
        originalZ +
        wave * 0.28 * tailInfluence;
    }

    attribute.needsUpdate = true;
  }

  // ----------------------------------------
  // ANIMACIÓN DEL OCÉANO
  // ----------------------------------------

  const positionAttribute =
    geometry.attributes.position;

  for (let i = 0; i < particleCount; i++) {
    const index = i * 3;

    positionAttribute.array[index] =
      originalPositions[index] +
      Math.sin(time * 0.4 + i) * 0.12;

    positionAttribute.array[index + 1] =
      originalPositions[index + 1] +
      Math.cos(time * 0.3 + i) * 0.18;
  }

  positionAttribute.needsUpdate = true;

  // Rotación del océano
  particles.rotation.y += 0.0003;

  // ----------------------------------------
  // MOVIMIENTO DE CÁMARA
  // ----------------------------------------

  camera.position.x +=
    (mouse.x * 1.2 - camera.position.x) * 0.02;

  camera.position.y +=
    (mouse.y * 0.8 - camera.position.y) * 0.02;

  camera.lookAt(0, 0, 0);

  // Dibujar escena
  renderer.render(scene, camera);
}

// Iniciar animación
animate();

// ==========================================
// 10. ADAPTACIÓN A PANTALLA
// ==========================================

window.addEventListener('resize', () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );
  
  // Adaptar los peces al tamaño de pantalla
  adjustFishLayout();
  });
  
