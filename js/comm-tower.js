// comm-tower.js - TerraGroup研究施設の通信塔

/**
 * 通信塔を作成する
 */
function createCommunicationTower() {
  console.log("通信塔の作成開始");
  
  // 通信塔のグループ
  const towerGroup = new THREE.Group();
  
  // 施設の配置位置（北側の高台）
  const towerPosition = { x: 0, z: -250 };
  
  // 通信塔の基礎（コンクリート基礎）
  const baseGeometry = new THREE.BoxGeometry(20, 2, 20);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(towerPosition.x, 1, towerPosition.z);
  base.receiveShadow = true;
  towerGroup.add(base);
  
  // 通信塔の本体（格子状の塔）
  const towerHeight = 100;
  const towerSegments = 10;
  const segmentHeight = towerHeight / towerSegments;
  
  // 塔の支柱
  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.7
  });
  
  // 4本の主要な支柱
  const pillarPositions = [
    { x: -5, z: -5 },
    { x: 5, z: -5 },
    { x: -5, z: 5 },
    { x: 5, z: 5 }
  ];
  
  pillarPositions.forEach(pos => {
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.8, towerHeight, 8),
      pillarMaterial
    );
    pillar.position.set(
      towerPosition.x + pos.x,
      towerHeight / 2 + 2,
      towerPosition.z + pos.z
    );
    towerGroup.add(pillar);
  });
  
  // 塔の横桁（各セグメントに配置）
  for (let i = 0; i <= towerSegments; i++) {
    const y = i * segmentHeight + 2;
    
    // 横方向の桁
    for (let j = 0; j < 4; j++) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.5, 0.5),
        pillarMaterial
      );
      beam.position.set(
        towerPosition.x,
        y,
        towerPosition.z + (j < 2 ? -5 : 5)
      );
      if (j % 2 === 1) {
        beam.rotation.y = Math.PI / 2;
      }
      towerGroup.add(beam);
    }
    
    // 斜めの補強材（X型）
    if (i < towerSegments) {
      for (let j = 0; j < 4; j++) {
        // 斜め補強材の長さを計算
        const diagonalLength = Math.sqrt(10 * 10 + segmentHeight * segmentHeight);
        
        const diagonal = new THREE.Mesh(
          new THREE.BoxGeometry(diagonalLength, 0.3, 0.3),
          pillarMaterial
        );
        
        // 回転角度を計算
        const angle = Math.atan2(segmentHeight, 10);
        
        // 面ごとに配置
        if (j === 0) {
          diagonal.position.set(towerPosition.x, y + segmentHeight / 2, towerPosition.z - 5);
          diagonal.rotation.x = angle;
        } else if (j === 1) {
          diagonal.position.set(towerPosition.x, y + segmentHeight / 2, towerPosition.z + 5);
          diagonal.rotation.x = -angle;
        } else if (j === 2) {
          diagonal.position.set(towerPosition.x - 5, y + segmentHeight / 2, towerPosition.z);
          diagonal.rotation.z = angle;
          diagonal.rotation.y = Math.PI / 2;
        } else {
          diagonal.position.set(towerPosition.x + 5, y + segmentHeight / 2, towerPosition.z);
          diagonal.rotation.z = -angle;
          diagonal.rotation.y = Math.PI / 2;
        }
        
        towerGroup.add(diagonal);
        
        // X型にするための反対方向の斜め材
        const diagonal2 = diagonal.clone();
        if (j === 0) {
          diagonal2.rotation.x = -angle;
        } else if (j === 1) {
          diagonal2.rotation.x = angle;
        } else if (j === 2) {
          diagonal2.rotation.z = -angle;
        } else {
          diagonal2.rotation.z = angle;
        }
        towerGroup.add(diagonal2);
      }
    }
  }
  
  // 通信アンテナ（塔の上部）
  const antennaGroup = new THREE.Group();
  antennaGroup.position.set(towerPosition.x, towerHeight + 2, towerPosition.z);
  
  // メインアンテナ
  const mainAntenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 15, 8),
    new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.3,
      metalness: 0.9
    })
  );
  mainAntenna.position.y = 7.5;
  antennaGroup.add(mainAntenna);
  
  // アンテナ上部の球体
  const antennaBall = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xff0000,
      roughness: 0.3,
      metalness: 0.9,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    })
  );
  antennaBall.position.y = 15;
  antennaGroup.add(antennaBall);
  
  // 衛星放送用パラボラアンテナ
  const dishGeometry = new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const dishMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.9,
    side: THREE.DoubleSide
  });
  
  const dish = new THREE.Mesh(dishGeometry, dishMaterial);
  dish.position.set(0, 0, -5);
  dish.rotation.x = -Math.PI / 4;
  antennaGroup.add(dish);
  
  // パラボラアンテナの受信部
  const receiver = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 3, 8),
    new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.7
    })
  );
  receiver.position.set(0, 3, -8);
  receiver.rotation.x = Math.PI / 4;
  antennaGroup.add(receiver);
  
  // 複数の小型アンテナ
  const smallAntennaPositions = [
    { x: -3, y: 0, z: 3, rotation: Math.PI / 6 },
    { x: 3, y: 0, z: 3, rotation: -Math.PI / 6 },
    { x: -3, y: 0, z: -3, rotation: Math.PI / 4 },
    { x: 3, y: 0, z: -3, rotation: -Math.PI / 4 }
  ];
  
  smallAntennaPositions.forEach(pos => {
    const smallAntenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.3,
        metalness: 0.9
      })
    );
    smallAntenna.position.set(pos.x, pos.y + 4, pos.z);
    smallAntenna.rotation.x = pos.rotation;
    antennaGroup.add(smallAntenna);
  });
  
  towerGroup.add(antennaGroup);
  
  // 通信機器室（塔の下部）
  const equipmentRoomGeometry = new THREE.BoxGeometry(15, 8, 15);
  const equipmentRoomMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const equipmentRoom = new THREE.Mesh(equipmentRoomGeometry, equipmentRoomMaterial);
  equipmentRoom.position.set(towerPosition.x, 4, towerPosition.z);
  equipmentRoom.castShadow = true;
  equipmentRoom.receiveShadow = true;
  towerGroup.add(equipmentRoom);
  
  // 機器室に窓を追加
  addWindowsToBox(equipmentRoom, 2, 1);
  
  // 機器室のドア
  const doorGeometry = new THREE.PlaneGeometry(3, 6);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.5,
    metalness: 0.7
  });
  
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, -1, 7.51);
  equipmentRoom.add(door);
  
  // ドアハンドル
  const handleGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.3,
    metalness: 0.9
  });
  
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(1, 0, 0.1);
  door.add(handle);
  
  // 警告サイン
  const warningSignGeometry = new THREE.PlaneGeometry(10, 5);
  const warningSignMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.3
  });
  
  const warningSign = new THREE.Mesh(warningSignGeometry, warningSignMaterial);
  warningSign.position.set(towerPosition.x, 3, towerPosition.z - 15);
  warningSign.castShadow = true;
  towerGroup.add(warningSign);
  
  // 警告サインの支柱
  const signPoles = new THREE.Group();
  
  for (let i = -1; i <= 1; i += 2) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 6, 8),
      new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.5,
        metalness: 0.7
      })
    );
    pole.position.set(i * 4, -2.5, 0);
    signPoles.add(pole);
  }
  
  warningSign.add(signPoles);
  
  // 通信塔の周囲にフェンスを設置
  const fence = createFacilityFence(towerPosition.x, towerPosition.z, 40, 40);
  towerGroup.add(fence.posts);
  towerGroup.add(fence.fences);
  
  console.log("通信塔の作成完了");
  scene.add(towerGroup);
  return towerGroup;
}
