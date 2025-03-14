// research-area.js - TerraGroup研究施設の研究実験エリア

/**
 * 研究実験エリアを作成する
 */
function createResearchArea() {
  console.log("研究実験エリアの作成開始");
  
  // 研究エリアのグループ
  const researchGroup = new THREE.Group();
  
  // 施設の配置位置（南西側）
  const researchPosition = { x: -150, z: 150 };
  
  // 実験区画の基礎（コンクリート基礎）
  const baseGeometry = new THREE.BoxGeometry(100, 1, 80);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(researchPosition.x, 0.5, researchPosition.z);
  base.receiveShadow = true;
  researchGroup.add(base);
  
  // 実験エリアを区切るグリッド線
  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.1
  });
  
  // 横線
  for (let i = 0; i < 5; i++) {
    const gridLine = new THREE.Mesh(
      new THREE.BoxGeometry(100, 0.1, 0.5),
      gridMaterial
    );
    gridLine.position.set(
      researchPosition.x,
      1.01,
      researchPosition.z - 40 + i * 20
    );
    researchGroup.add(gridLine);
  }
  
  // 縦線
  for (let i = 0; i < 6; i++) {
    const gridLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 80),
      gridMaterial
    );
    gridLine.position.set(
      researchPosition.x - 50 + i * 20,
      1.01,
      researchPosition.z
    );
    researchGroup.add(gridLine);
  }
  
  // 実験用機器1（気象観測装置）
  const weatherStationGroup = new THREE.Group();
  weatherStationGroup.position.set(
    researchPosition.x - 30,
    0,
    researchPosition.z - 20
  );
  
  // 支柱
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.7
  });
  
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 10, 8),
    poleMaterial
  );
  pole.position.y = 5;
  weatherStationGroup.add(pole);
  
  // 測定器
  const sensorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.8
  });
  
  const sensor = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 2),
    sensorMaterial
  );
  sensor.position.y = 10;
  weatherStationGroup.add(sensor);
  
  // 風速計
  const anemometer = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    sensorMaterial
  );
  anemometer.position.set(0, 11, 0);
  weatherStationGroup.add(anemometer);
  
  // 風速計の腕
  for (let i = 0; i < 3; i++) {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.1, 0.1),
      sensorMaterial
    );
    arm.position.set(1.5, 11, 0);
    arm.rotation.y = (i * Math.PI * 2) / 3;
    anemometer.add(arm);
    
    const cup = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 8, 8),
      sensorMaterial
    );
    cup.position.set(3, 0, 0);
    arm.add(cup);
  }
  
  researchGroup.add(weatherStationGroup);
  
  // 実験用機器2（土壌サンプル分析装置）
  const soilAnalyzerGroup = new THREE.Group();
  soilAnalyzerGroup.position.set(
    researchPosition.x + 30,
    0,
    researchPosition.z - 20
  );
  
  // 基台
  const analyzerBase = new THREE.Mesh(
    new THREE.BoxGeometry(8, 1, 8),
    new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2
    })
  );
  analyzerBase.position.y = 0.5;
  soilAnalyzerGroup.add(analyzerBase);
  
  // 分析機本体
  const analyzerBody = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 6),
    new THREE.MeshStandardMaterial({
      color: 0x0056b3,
      roughness: 0.3,
      metalness: 0.8
    })
  );
  analyzerBody.position.y = 3;
  soilAnalyzerGroup.add(analyzerBody);
  
  // ディスプレイ
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 2),
    new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.1,
      metalness: 0.5,
      emissive: 0x00ff00,
      emissiveIntensity: 0.2
    })
  );
  display.position.set(0, 4, 3.01);
  soilAnalyzerGroup.add(display);
  
  // サンプルチューブ
  for (let i = 0; i < 4; i++) {
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 2, 8),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.9
      })
    );
    tube.position.set(-2 + i * 1.3, 5, 0);
    soilAnalyzerGroup.add(tube);
  }
  
  researchGroup.add(soilAnalyzerGroup);
  
  // 実験用機器3（放射線測定装置）
  const radiationDetectorGroup = new THREE.Group();
  radiationDetectorGroup.position.set(
    researchPosition.x,
    0,
    researchPosition.z + 20
  );
  
  // 三脚
  const tripodMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.7
  });
  
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 5, 8),
      tripodMaterial
    );
    leg.position.y = 2.5;
    leg.rotation.x = Math.PI / 6;
    leg.rotation.y = (i * Math.PI * 2) / 3;
    radiationDetectorGroup.add(leg);
  }
  
  // 測定器本体
  const detectorBody = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2, 5),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      roughness: 0.3,
      metalness: 0.5
    })
  );
  detectorBody.position.y = 5;
  radiationDetectorGroup.add(detectorBody);
  
  // アンテナ
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 3, 8),
    tripodMaterial
  );
  antenna.position.set(0, 7.5, 0);
  radiationDetectorGroup.add(antenna);
  
  researchGroup.add(radiationDetectorGroup);
  
  // 観測ポスト（小屋）
  const observationPostGeometry = new THREE.BoxGeometry(10, 8, 8);
  const observationPostMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.7,
    metalness: 0.2
  });
  
  const observationPost = new THREE.Mesh(observationPostGeometry, observationPostMaterial);
  observationPost.position.set(researchPosition.x - 40, 4, researchPosition.z + 30);
  observationPost.castShadow = true;
  observationPost.receiveShadow = true;
  researchGroup.add(observationPost);
  
  // 観測ポストに窓を追加
  addWindowsToBox(observationPost, 2, 1);
  
  // 警告サイン
  const warningSignGeometry = new THREE.BoxGeometry(10, 5, 0.5);
  const warningSignMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.3
  });
  
  const warningSign = new THREE.Mesh(warningSignGeometry, warningSignMaterial);
  warningSign.position.set(researchPosition.x, 3, researchPosition.z + 40);
  warningSign.castShadow = true;
  researchGroup.add(warningSign);
  
  // 警告サインの支柱
  const signPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 6, 8),
    new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.7
    })
  );
  signPole.position.set(0, -2.5, 0);
  warningSign.add(signPole);
  
  // 実験エリアの周囲にフェンスを設置
  const fence = createFacilityFence(researchPosition.x, researchPosition.z, 100, 80);
  researchGroup.add(fence.posts);
  researchGroup.add(fence.fences);
  
  console.log("研究実験エリアの作成完了");
  scene.add(researchGroup);
  return researchGroup;
}
