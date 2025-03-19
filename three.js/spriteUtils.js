import * as THREE from './three.module.js';

export function createSprite(material, scale, position, scene) {
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(...scale);
    sprite.position.set(...position);
    scene.add(sprite);

    return sprite;
}