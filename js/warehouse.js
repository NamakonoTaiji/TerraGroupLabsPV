// warehouse.js - TerraGroup研究施設の倉庫施設

/**
 * 倉庫施設を作成する
 */
function createWarehouse() {
  console.log("倉庫施設の作成開始");
  
  // 倉庫のグループ
  const warehouseGroup = new THREE.Group();
  
  // 施設の配置位置（北東側）
  const warehousePosition = { x: 150, z: 150 };
  
  // 倉庫の基礎（コンクリート基礎）
  const baseGeometry = new THREE.BoxGeometry(80, 1, 60);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(warehousePosition.x, 0.5, warehousePosition.z);
  base.receiveShadow = true;
  warehouseGroup.add(base);
  
  // 倉庫の本体
  const buildingGeometry = new THREE.BoxGeometry(70, 15, 50);
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(warehousePosition.x, 8, warehousePosition.z);
  building.castShadow = true;
  building.receiveShadow = true;
  warehouseGroup.add(building);
  
  // 屋根
  const roofGeometry = new THREE.BoxGeometry(72, 2, 52);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 8, 0);
  building.add(roof);
  
  // 窓を追加
  // 左側面の窓
  for (let i = 0; i < 5; i++) {
    const window = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 2),
      new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7
      })
    );
    window.position.set(-35.01, 3 + i * 3, 0);
    window.rotation.y = Math.PI / 2;
    building.add(window);
  }
  
  // 右側面の窓
  for (let i = 0; i < 5; i++) {
    const window = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 2),
      new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7
      })
    );
    window.position.set(35.01, 3 + i * 3, 0);
    window.rotation.y = -Math.PI / 2;
    building.add(window);
  }
  
  // 荷積みドック
  const dockGeometry = new THREE.BoxGeometry(30, 5, 10);
  const dockMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const dock = new THREE.Mesh(dockGeometry, dockMaterial);
  dock.position.set(warehousePosition.x, 2.5, warehousePosition.z + 30);
  dock.castShadow = true;
  dock.receiveShadow = true;
  warehouseGroup.add(dock);
  
  // ドックの階段
  const stairsGeometry = new THREE.BoxGeometry(10, 5, 5);
  const stairs = new THREE.Mesh(stairsGeometry, dockMaterial);
  stairs.position.set(warehousePosition.x - 20, 2.5, warehousePosition.z + 30);
  stairs.castShadow = true;
  stairs.receiveShadow = true;
  warehouseGroup.add(stairs);
  
  // 階段のステップ
  for (let i = 0; i < 5; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.9,
        metalness: 0.1
      })
    );
    step.position.set(0, -2 + i, 2 - i);
    stairs.add(step);
  }
  
  // 倉庫のドア
  const doorGeometry = new THREE.BoxGeometry(8, 8, 0.5);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.5,
    metalness: 0.7
  });
  
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(warehousePosition.x, 4, warehousePosition.z + 25.01);
  door.castShadow = true;
  warehouseGroup.add(door);
  
  // ドアハンドル
  const handleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.3,
    metalness: 0.9
  });
  
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(2, 0, 0.3);
  door.add(handle);
  
  // 荷積みドックの大きなシャッター
  const shutterGeometry = new THREE.PlaneGeometry(10, 8);
  const shutterMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.7,
    metalness: 0.5
  });
  
  // 3つのシャッターを横に並べる
  for (let i = -1; i <= 1; i++) {
    const shutter = new THREE.Mesh(shutterGeometry, shutterMaterial);
    shutter.position.set(
      warehousePosition.x + i * 12,
      4,
      warehousePosition.z + 25.02
    );
    
    // シャッターのパネル線
    for (let j = 0; j < 8; j++) {
      const line = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x555555 })
      );
      line.position.set(0, -4 + j * 1, 0.01);
      shutter.add(line);
    }
    
    warehouseGroup.add(shutter);
  }
  
  // フォークリフト
  const forkliftGroup = new THREE.Group();
  forkliftGroup.position.set(
    warehousePosition.x + 20,
    0,
    warehousePosition.z + 15
  );
  
  // フォークリフトの本体
  const forkliftBodyGeometry = new THREE.BoxGeometry(4, 3, 6);
  const forkliftBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const forkliftBody = new THREE.Mesh(forkliftBodyGeometry, forkliftBodyMaterial);
  forkliftBody.position.y = 2;
  forkliftGroup.add(forkliftBody);
  
  // フォークリフトのフォーク部分
  const forkGeometry = new THREE.BoxGeometry(4, 0.5, 0.5);
  const forkMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.7
  });
  
  // 2本のフォークを作成
  for (let i = -1; i <= 1; i += 2) {
    const fork = new THREE.Mesh(forkGeometry, forkMaterial);
    fork.position.set(0, 0.5, 3 + i * 0.8);
    forkliftGroup.add(fork);
  }
  
  // フォークリフトのマスト
  const mastGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
  const mast = new THREE.Mesh(mastGeometry, forkMaterial);
  mast.position.set(0, 3, 3);
  forkliftGroup.add(mast);
  
  // フォークリフトのキャビン
  const cabinGeometry = new THREE.BoxGeometry(4, 2, 3);
  const cabinMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.3
  });
  
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.set(0, 3.5, -1);
  forkliftGroup.add(cabin);
  
  // フォークリフトのタイヤ
  const wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.9,
    metalness: 0.1
  });
  
  // 4つのタイヤを配置
  const wheelPositions = [
    { x: -1.5, z: -2 },
    { x: 1.5, z: -2 },
    { x: -1.5, z: 2 },
    { x: 1.5, z: 2 }
  ];
  
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, 1, pos.z);
    forkliftGroup.add(wheel);
  });
  
  warehouseGroup.add(forkliftGroup);
  
  // 保管コンテナ
  const containerColors = [
    0xcc0000, // 赤
    0x0066cc, // 青
    0x009900, // 緑
    0xffcc00  // 黄
  ];
  
  // 複数のコンテナを配置
  for (let i = 0; i < 6; i++) {
    const containerGeometry = new THREE.BoxGeometry(8, 8, 12);
    const containerMaterial = new THREE.MeshStandardMaterial({
      color: containerColors[i % containerColors.length],
      roughness: 0.7,
      metalness: 0.3
    });
    
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    
    // コンテナの位置を決定（一部は積み重ねる）
    if (i < 3) {
      container.position.set(
        warehousePosition.x - 25 + i * 10,
        4,
        warehousePosition.z - 15
      );
    } else {
      container.position.set(
        warehousePosition.x - 25 + (i - 3) * 10,
        12,
        warehousePosition.z - 15
      );
    }
    
    container.castShadow = true;
    container.receiveShadow = true;
    
    // コンテナのリブ（補強材）
    for (let j = 0; j < 3; j++) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(8.1, 0.5, 0.2),
        new THREE.MeshStandardMaterial({
          color: 0x333333,
          roughness: 0.5,
          metalness: 0.7
        })
      );
      rib.position.set(0, -3.5 + j * 3.5, 6.01);
      container.add(rib);
      
      const ribBack = rib.clone();
      ribBack.position.z = -6.01;
      container.add(ribBack);
    }
    
    warehouseGroup.add(container);
  }
  
  // 倉庫施設の周囲にフェンスを設置
  const fence = createFacilityFence(warehousePosition.x, warehousePosition.z, 90, 70);
  warehouseGroup.add(fence.posts);
  warehouseGroup.add(fence.fences);
  
  console.log("倉庫施設の作成完了");
  scene.add(warehouseGroup);
  return warehouseGroup;
}
