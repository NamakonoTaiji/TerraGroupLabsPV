import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';

/**
 * シーンの照明を設定する
 * @param {THREE.Scene} scene - Three.jsのシーンオブジェクト
 */
export function createLighting(scene) {
    // 環境光（全体を均一に照らす）
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // 主光源（太陽光を表現）
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(300, 300, 300);
    mainLight.castShadow = true;
    
    // シャドウマップの設定
    const d = 300;
    mainLight.shadow.camera.left = -d;
    mainLight.shadow.camera.right = d;
    mainLight.shadow.camera.top = d;
    mainLight.shadow.camera.bottom = -d;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 1000;
    mainLight.shadow.bias = -0.001;
    
    // シャドウマップのクオリティ
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    
    scene.add(mainLight);
    
    // 補助光（影を和らげる）
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-100, 100, -100);
    scene.add(fillLight);
    
    // 縁取り光（被写体と背景を分離）
    const rimLight = new THREE.DirectionalLight(0xffffaa, 0.2);
    rimLight.position.set(0, 0, -100);
    scene.add(rimLight);
    
    // 薄いフォグ（奥行き感を強化）
    scene.fog = new THREE.FogExp2(0xCCCCDD, 0.001);
    
    return {
        ambientLight,
        mainLight,
        fillLight,
        rimLight
    };
}
