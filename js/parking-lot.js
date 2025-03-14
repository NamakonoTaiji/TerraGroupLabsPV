// parking-lot.js - TerraGroup研究施設の駐車場

/**
 * 駐車場を作成する
 */
function createParkingLot() {
  console.log("駐車場の作成開始");
  
  // 駐車場のグループ
  const parkingGroup = new THREE.Group();
  
  // 施設の配置位置（南側）
  const parkingPosition = { x: 0, z: 200 };
  
  // 駐車場の基礎（アスファルト）
  const baseGeometry = new THREE.BoxGeometry(120, 1, 60);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(parkingPosition.x, 0.5, parkingPosition.z);
  base.receiveShadow = true;
  parkingGroup.add(base);
  
  // 駐車スペースのマーキング
  const parkingSpotMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  
  // 駐車スペースを2列に配置
  const spotWidth = 10;
  const spotDepth = 20;
  const spotsPerRow = 5;
  
  for (let row = 0; row < 2; row++) {
    for (let spot = 0; spot < spotsPerRow; spot++) {
      // 駐車スペースの枠線（左側）
      const leftLine = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, spotDepth),
        parkingSpotMaterial
      );
      leftLine.rotation.x = -Math.PI / 2;
      leftLine.position.set(
        parkingPosition.x - 55 + spot * spotWidth,
        1.01,
        parkingPosition.z - 15 + row * 30
      );
      parkingGroup.add(leftLine);
      
      // 駐車スペースの枠線（右側）
      const rightLine = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, spotDepth),
        parkingSpotMaterial
      );
      rightLine.rotation.x = -Math.PI / 2;
      rightLine.position.set(
        parkingPosition.x - 55 + (spot + 1) * spotWidth,
        1.01,
        parkingPosition.z - 15 + row * 30
      );
      parkingGroup.add(rightLine);
      
      // 駐車スペースの枠線（奥側）
      const backLine = new THREE.Mesh(
        new THREE.PlaneGeometry(spotWidth, 0.3),
        parkingSpotMaterial
      );
      backLine.rotation.x = -Math.PI / 2;
      backLine.position.set(
        parkingPosition.x - 55 + spot * spotWidth + spotWidth / 2,
        1.01,
        parkingPosition.z - 15 + row * 30 - spotDepth / 2
      );
      parkingGroup.add(backLine);
      
      // 駐車スペースの枠線（手前側）
      const frontLine = new THREE.Mesh(
        new THREE.PlaneGeometry(spotWidth, 0.3),
        parkingSpotMaterial
      );
      frontLine.rotation.x = -Math.PI / 2;
      frontLine.position.set(
        parkingPosition.x - 55 + spot * spotWidth + spotWidth / 2,
        1.01,
        parkingPosition.z - 15 + row * 30 + spotDepth / 2
      );
      parkingGroup.add(frontLine);
    }
  }
  
  // 中央の通路
  const centralPath = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 20),
    new THREE.MeshBasicMaterial({
      color: 0x333333
    })
  );
  centralPath.rotation.x = -Math.PI / 2;
  centralPath.position.set(parkingPosition.x, 1.02, parkingPosition.z);
  parkingGroup.add(centralPath);
  
  // 照明ポール
  const lightPoleMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.7
  });
  
  const lightFixtureMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.8
  });
  
  // 4つの照明ポールを配置
  const lightPositions = [
    { x: -40, z: -20 },
    { x: 40, z: -20 },
    { x: -40, z: 20 },
    { x: 40, z: 20 }
  ];
  
  lightPositions.forEach(pos => {
    // ポール
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 15, 8),
      lightPoleMaterial
    );
    pole.position.set(
      parkingPosition.x + pos.x,
      7.5,
      parkingPosition.z + pos.z
    );
    parkingGroup.add(pole);
    
    // 照明器具
    const fixture = new THREE.Mesh(
      new THREE.BoxGeometry(3, 1, 3),
      lightFixtureMaterial
    );
    fixture.position.set(0, 8, 0);
    pole.add(fixture);
    
    // 照明（発光部分）
    const light = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 2.5),
      new THREE.MeshStandardMaterial({
        color: 0xffffcc,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0xffffcc,
        emissiveIntensity: 0.5
      })
    );
    light.rotation.x = Math.PI / 2;
    light.position.set(0, -0.51, 0);
    fixture.add(light);
    
    // 実際の光源
    const pointLight = new THREE.PointLight(0xffffcc, 0.8, 50);
    pointLight.position.set(0, -1, 0);
    fixture.add(pointLight);
  });
  
  // 電気自動車充電ステーション
  const chargingStationGroup = new THREE.Group();
  chargingStationGroup.position.set(
    parkingPosition.x + 50,
    0,
    parkingPosition.z - 20
  );
  
  // 充電ステーションの基台
  const stationBase = new THREE.Mesh(
    new THREE.BoxGeometry(5, 1, 5),
    new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2
    })
  );
  stationBase.position.y = 0.5;
  chargingStationGroup.add(stationBase);
  
  // 充電ステーション本体
  const stationBody = new THREE.Mesh(
    new THREE.BoxGeometry(3, 6, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0056b3,
      roughness: 0.3,
      metalness: 0.8
    })
  );
  stationBody.position.set(0, 4, 0);
  chargingStationGroup.add(stationBody);
  
  // 充電コネクタ
  const connector = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 0.5),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.3,
      metalness: 0.8
    })
  );
  connector.position.set(0, 3, 1);
  chargingStationGroup.add(connector);
  
  // 充電ケーブル
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 3, 1),
    new THREE.Vector3(1, 2.5, 1.5),
    new THREE.Vector3(2, 1.5, 2),
    new THREE.Vector3(3, 0.5, 2)
  ]);
  
  const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.1, 8, false);
  const cable = new THREE.Mesh(
    cableGeometry,
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.8,
      metalness: 0.2
    })
  );
  chargingStationGroup.add(cable);
  
  // ディスプレイ
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1),
    new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.1,
      metalness: 0.5,
      emissive: 0x00ff00,
      emissiveIntensity: 0.2
    })
  );
  display.position.set(0, 5, 0.51);
  chargingStationGroup.add(display);
  
  parkingGroup.add(chargingStationGroup);
  
  // 駐車場の入口サイン
  const parkingSignGeometry = new THREE.BoxGeometry(15, 5, 0.5);
  const parkingSignMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.5,
    metalness: 0.3
  });
  
  const parkingSign = new THREE.Mesh(parkingSignGeometry, parkingSignMaterial);
  parkingSign.position.set(parkingPosition.x, 3, parkingPosition.z + 30);
  parkingSign.castShadow = true;
  parkingGroup.add(parkingSign);
  
  // サインの支柱
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
    pole.position.set(i * 6, -2.5, 0);
    signPoles.add(pole);
  }
  
  parkingSign.add(signPoles);
  
  // Pのマーク
  const pMarkGeometry = new THREE.PlaneGeometry(3, 4);
  const pMarkMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  
  const pMark = new THREE.Mesh(pMarkGeometry, pMarkMaterial);
  pMark.position.set(0, 0, 0.26);
  parkingSign.add(pMark);
  
  console.log("駐車場の作成完了");
  scene.add(parkingGroup);
  return parkingGroup;
}
