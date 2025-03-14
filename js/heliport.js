// heliport.js - TerraGroup研究施設のヘリポート

/**
 * ヘリポートを作成する
 */
function createHeliport() {
  console.log("ヘリポートの作成開始");
  
  // ヘリポートのグループ
  const heliportGroup = new THREE.Group();
  
  // 施設の配置位置（北西側）
  const heliportPosition = { x: -150, z: -150 };
  
  // ヘリポートの基礎（コンクリート基礎）
  const baseGeometry = new THREE.CylinderGeometry(30, 30, 1, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(heliportPosition.x, 0.5, heliportPosition.z);
  base.receiveShadow = true;
  heliportGroup.add(base);
  
  // ヘリポートのマーキング（H）
  const markingGeometry = new THREE.PlaneGeometry(20, 20);
  const markingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.1
  });
  
  const marking = new THREE.Mesh(markingGeometry, markingMaterial);
  marking.rotation.x = -Math.PI / 2;
  marking.position.set(heliportPosition.x, 1.01, heliportPosition.z);
  marking.receiveShadow = true;
  heliportGroup.add(marking);
  
  // Hの形を作成
  const hBarGeometry = new THREE.PlaneGeometry(4, 16);
  const hBarMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.5,
    metalness: 0.1
  });
  
  // 左縦棒
  const leftBar = new THREE.Mesh(hBarGeometry, hBarMaterial);
  leftBar.rotation.x = -Math.PI / 2;
  leftBar.position.set(heliportPosition.x - 5, 1.02, heliportPosition.z);
  heliportGroup.add(leftBar);
  
  // 右縦棒
  const rightBar = new THREE.Mesh(hBarGeometry, hBarMaterial);
  rightBar.rotation.x = -Math.PI / 2;
  rightBar.position.set(heliportPosition.x + 5, 1.02, heliportPosition.z);
  heliportGroup.add(rightBar);
  
  // 横棒
  const crossBarGeometry = new THREE.PlaneGeometry(10, 4);
  const crossBar = new THREE.Mesh(crossBarGeometry, hBarMaterial);
  crossBar.rotation.x = -Math.PI / 2;
  crossBar.position.set(heliportPosition.x, 1.02, heliportPosition.z);
  heliportGroup.add(crossBar);
  
  // 着陸灯（周囲に配置）
  const lightGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    roughness: 0.3,
    metalness: 0.8,
    emissive: 0xffff00,
    emissiveIntensity: 0.5
  });
  
  // 周囲に12個の着陸灯を配置
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const x = heliportPosition.x + Math.sin(angle) * 28;
    const z = heliportPosition.z + Math.cos(angle) * 28;
    
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(x, 1, z);
    heliportGroup.add(light);
  }
  
  // 管制小屋
  const controlHutGeometry = new THREE.BoxGeometry(10, 5, 8);
  const controlHutMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const controlHut = new THREE.Mesh(controlHutGeometry, controlHutMaterial);
  controlHut.position.set(heliportPosition.x - 35, 2.5, heliportPosition.z);
  controlHut.castShadow = true;
  controlHut.receiveShadow = true;
  heliportGroup.add(controlHut);
  
  // 管制小屋に窓を追加
  addWindowsToBox(controlHut, 2, 1);
  
  // 風向計
  const windSockPoleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 8);
  const windSockPoleMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.7
  });
  
  const windSockPole = new THREE.Mesh(windSockPoleGeometry, windSockPoleMaterial);
  windSockPole.position.set(heliportPosition.x + 25, 4, heliportPosition.z + 25);
  windSockPole.castShadow = true;
  heliportGroup.add(windSockPole);
  
  // 風袋（円錐）
  const windSockGeometry = new THREE.ConeGeometry(1, 4, 8, 1, true);
  const windSockMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  
  const windSock = new THREE.Mesh(windSockGeometry, windSockMaterial);
  windSock.rotation.x = Math.PI / 2;
  windSock.rotation.y = Math.PI / 4; // 風の方向
  windSock.position.set(0, 8, 0);
  windSockPole.add(windSock);
  
  console.log("ヘリポートの作成完了");
  scene.add(heliportGroup);
  return heliportGroup;
}
