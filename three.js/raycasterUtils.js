import * as THREE from './three.module.js';
 
// Configurar o raio para a interseção do mouse
const mouse = new THREE.Vector2();

// Adicionar um ouvinte de eventos de movimento do mouse
document.addEventListener('mousemove', onDocumentMouseMove, false);

// Função para lidar com o movimento do mouse
export function onDocumentMouseMove(event) {
    // Normalizar a coordenada do mouse entre -1 e 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}