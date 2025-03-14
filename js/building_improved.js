// building_improved.js - TerraGroupLabs研究施設の改良版モデル

/**
 * TerraGroupLabs研究施設を作成する
 * 企業イメージカラー: 青・白・黒
 */
function createBuilding() {
  return new Promise((resolve, reject) => {
    try {
      // 建物全体のグループ
      const buildingGroup = new THREE.Group();
      scene.add(buildingGroup);

      // メイン建物（中央ビル）- より大きくモダンな設計
      const mainBuildingGeometry = new THREE.BoxGeometry(120, 60, 120);
      const mainBuildingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // 白をベースカラーに
        metalness: 0.3,
        roughness: 0.1,
      });

      const mainBuilding = new THREE.Mesh(
        mainBuildingGeometry,
        mainBuildingMaterial
      );
      mainBuilding.position.set(0, 30, 0);
      mainBuilding.castShadow = true;
      mainBuilding.receiveShadow = true;
      buildingGroup.add(mainBuilding);

      // 副建物1（研究棟）- 左側
      const researchBuildingGeometry = new THREE.BoxGeometry(80, 40, 60);
      const researchBuildingMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8f8f8,
        metalness: 0.2,
        roughness: 0.2,
      });

      const researchBuilding = new THREE.Mesh(
        researchBuildingGeometry,
        researchBuildingMaterial
      );
      researchBuilding.position.set(-100, 20, 30);
      researchBuilding.castShadow = true;
      researchBuilding.receiveShadow = true;
      buildingGroup.add(researchBuilding);

      // 副建物2（実験棟）- 右側
      const labBuildingGeometry = new THREE.BoxGeometry(70, 30, 90);
      const labBuildingMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        metalness: 0.2,
        roughness: 0.3,
      });

      const labBuilding = new THREE.Mesh(
        labBuildingGeometry,
        labBuildingMaterial
      );
      labBuilding.position.set(90, 15, -20);
      labBuilding.castShadow = true;
      labBuilding.receiveShadow = true;
      buildingGroup.add(labBuilding);

      // 中央ビルと研究棟をつなぐ連絡通路
      const corridor1Geometry = new THREE.BoxGeometry(40, 10, 15);
      const corridorMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      });

      const corridor1 = new THREE.Mesh(corridor1Geometry, corridorMaterial);
      corridor1.position.set(-60, 20, 20);
      corridor1.castShadow = true;
      corridor1.receiveShadow = true;
      buildingGroup.add(corridor1);

      // 中央ビルと実験棟をつなぐ連絡通路
      const corridor2Geometry = new THREE.BoxGeometry(30, 10, 20);
      const corridor2 = new THREE.Mesh(corridor2Geometry, corridorMaterial);
      corridor2.position.set(55, 15, -10);
      corridor2.castShadow = true;
      corridor2.receiveShadow = true;
      buildingGroup.add(corridor2);

      // 特徴的な中央タワー（高層部）
      const towerGeometry = new THREE.BoxGeometry(40, 80, 40);
      const towerMaterial = new THREE.MeshStandardMaterial({
        color: 0x0056b3, // 企業カラーの青
        metalness: 0.6,
        roughness: 0.1,
      });

      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.set(0, 100, 0);
      tower.castShadow = true;
      tower.receiveShadow = true;
      buildingGroup.add(tower);

      // 塔の最上部（観測室）
      const observatoryGeometry = new THREE.CylinderGeometry(25, 20, 15, 12);
      const observatoryMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000, // 企業カラーの黒
        metalness: 0.7,
        roughness: 0.2,
      });

      const observatory = new THREE.Mesh(
        observatoryGeometry,
        observatoryMaterial
      );
      observatory.position.set(0, 147.5, 0);
      observatory.castShadow = true;
      observatory.receiveShadow = true;
      buildingGroup.add(observatory);

      // サブ施設（セキュリティゲート）
      const gateGeometry = new THREE.BoxGeometry(20, 15, 20);
      const gateMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.5,
        roughness: 0.3,
      });

      const gate = new THREE.Mesh(gateGeometry, gateMaterial);
      gate.position.set(0, 7.5, 130);
      gate.castShadow = true;
      gate.receiveShadow = true;
      buildingGroup.add(gate);

      // アクセス道路
      const roadGeometry = new THREE.PlaneGeometry(20, 100);
      const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9,
        metalness: 0.0,
      });

      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0.1, 200); // 地面よりわずかに上に
      road.receiveShadow = true;
      buildingGroup.add(road);

      // -----------------------------------------------
      // 建物の窓の追加
      // -----------------------------------------------

      // メインビルの窓（ガラス張りの外観）
      addBuildingWindows(mainBuilding, 120, 60, 120, 10, 0x88ccff);

      // 研究棟の窓
      addBuildingWindows(researchBuilding, 80, 40, 60, 8, 0x88ccff);

      // 実験棟の窓
      addBuildingWindows(labBuilding, 70, 30, 90, 8, 0x88ccff);

      // 中央タワーの窓
      addTowerWindows(tower, 40, 80, 40, 8, 0x0088dd);

      // -----------------------------------------------
      // 建物のディテール追加
      // -----------------------------------------------

      // 屋上設備（アンテナやサテライトディッシュ）
      addRoofEquipment(mainBuilding, 120, 60, 120);

      // 屋上ヘリポート
      createHelipad(buildingGroup, 0, 60, 0);

      // 実験棟のサイロ（特殊容器）
      createExperimentalSilos(labBuilding);

      // TerraGroupのロゴと社名
      createCompanyLogo(mainBuilding);

      // セキュリティカメラ
      addSecurityCameras(buildingGroup);

      // 照明効果
      addBuildingLights(buildingGroup);

      console.log("TerraGroup Labs研究施設の作成完了");
      resolve();
    } catch (error) {
      console.error("建物作成エラー:", error);
      reject(error);
    }
  });
}

/**
 * 建物に窓を追加する
 */
function addBuildingWindows(building, width, height, depth, spacing, color) {
  const windowGeometry = new THREE.PlaneGeometry(3, 5);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });

  // 窓の数を計算
  const widthCount = Math.floor(width / spacing);
  const heightCount = Math.floor(height / spacing);

  // 前面の窓
  for (let y = 0; y < heightCount; y++) {
    for (let x = 0; x < widthCount; x++) {
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(
        (x - (widthCount - 1) / 2) * spacing,
        (y - (heightCount - 1) / 2) * spacing,
        depth / 2 + 0.1
      );
      building.add(windowMesh);
    }
  }

  // 背面の窓
  for (let y = 0; y < heightCount; y++) {
    for (let x = 0; x < widthCount; x++) {
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(
        (x - (widthCount - 1) / 2) * spacing,
        (y - (heightCount - 1) / 2) * spacing,
        -depth / 2 - 0.1
      );
      windowMesh.rotation.y = Math.PI;
      building.add(windowMesh);
    }
  }

  // 左側面の窓
  const depthCount = Math.floor(depth / spacing);
  for (let y = 0; y < heightCount; y++) {
    for (let z = 0; z < depthCount; z++) {
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(
        -width / 2 - 0.1,
        (y - (heightCount - 1) / 2) * spacing,
        (z - (depthCount - 1) / 2) * spacing
      );
      windowMesh.rotation.y = -Math.PI / 2;
      building.add(windowMesh);
    }
  }

  // 右側面の窓
  for (let y = 0; y < heightCount; y++) {
    for (let z = 0; z < depthCount; z++) {
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(
        width / 2 + 0.1,
        (y - (heightCount - 1) / 2) * spacing,
        (z - (depthCount - 1) / 2) * spacing
      );
      windowMesh.rotation.y = Math.PI / 2;
      building.add(windowMesh);
    }
  }
}

/**
 * タワーに縦長の窓を追加する
 */
function addTowerWindows(tower, width, height, depth, spacing, color) {
  // より細長い窓
  const windowGeometry = new THREE.PlaneGeometry(2, 10);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });

  // 窓の数を計算
  const widthCount = Math.floor(width / spacing);
  const heightCount = Math.floor(height / spacing) - 1;

  // 全ての面に縦長の窓を配置
  const sides = [
    { rot: 0, x: 0, z: depth / 2 + 0.1 }, // 前面
    { rot: Math.PI, x: 0, z: -depth / 2 - 0.1 }, // 背面
    { rot: -Math.PI / 2, x: -width / 2 - 0.1, z: 0 }, // 左面
    { rot: Math.PI / 2, x: width / 2 + 0.1, z: 0 }, // 右面
  ];

  sides.forEach((side) => {
    for (let x = 0; x < widthCount; x++) {
      for (let y = 0; y < heightCount; y++) {
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);

        // 縦位置を計算（均等分配）
        const yPos = (y - (heightCount - 1) / 2) * spacing;

        // 基本位置を設定
        windowMesh.position.set(side.x, yPos, side.z);

        // X方向の位置調整（サイドによって異なる）
        if (side.rot === 0 || side.rot === Math.PI) {
          windowMesh.position.x = (x - (widthCount - 1) / 2) * spacing;
        } else {
          windowMesh.position.z = (x - (widthCount - 1) / 2) * spacing;
        }

        windowMesh.rotation.y = side.rot;
        tower.add(windowMesh);
      }
    }
  });
}

/**
 * 屋上設備を追加する
 */
function addRoofEquipment(building, width, height, depth) {
  // アンテナタワー
  const antennaTowerGeometry = new THREE.CylinderGeometry(1, 1, 25, 8);
  const antennaTowerMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.8,
    roughness: 0.2,
  });

  const antennaTower = new THREE.Mesh(
    antennaTowerGeometry,
    antennaTowerMaterial
  );
  antennaTower.position.set(width * 0.3, height / 2 + 12.5, depth * 0.25);
  building.add(antennaTower);

  // アンテナの先端
  const antennaTipGeometry = new THREE.ConeGeometry(0.5, 5, 8);
  const antennaTipMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.5,
  });

  const antennaTip = new THREE.Mesh(antennaTipGeometry, antennaTipMaterial);
  antennaTip.position.y = 15;
  antennaTower.add(antennaTip);

  // 通信機器
  const commGeometry = new THREE.BoxGeometry(3, 2, 5);
  const commMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.3,
  });

  // 複数の通信機器を配置
  for (let i = 0; i < 3; i++) {
    const commEquipment = new THREE.Mesh(commGeometry, commMaterial);
    commEquipment.position.set(
      -width * 0.3,
      height / 2 + 1,
      -depth * 0.3 + i * 8
    );
    building.add(commEquipment);

    // 小さなライト
    const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.9,
    });

    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(1, 1, 0);
    commEquipment.add(light);
  }

  // 空調設備
  const hvacGeometry = new THREE.BoxGeometry(15, 5, 20);
  const hvacMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.4,
    roughness: 0.6,
  });

  const hvacUnit = new THREE.Mesh(hvacGeometry, hvacMaterial);
  hvacUnit.position.set(0, height / 2 + 2.5, -depth * 0.2);
  building.add(hvacUnit);

  // 換気ファン
  const fanGeometry = new THREE.CylinderGeometry(2, 2, 1, 16);
  const fanMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.5,
    roughness: 0.8,
  });

  // 複数の換気ファン
  for (let i = 0; i < 3; i++) {
    const fan = new THREE.Mesh(fanGeometry, fanMaterial);
    fan.rotation.x = Math.PI / 2;
    fan.position.set(-5 + i * 5, 3, 0);
    hvacUnit.add(fan);
  }

  // パラボラアンテナ（衛星通信用）
  const dishGeometry = new THREE.SphereGeometry(6, 16, 16, 0, Math.PI);
  const dishMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.5,
    roughness: 0.3,
    side: THREE.DoubleSide,
  });

  const dish = new THREE.Mesh(dishGeometry, dishMaterial);
  dish.rotation.x = Math.PI / 3; // 上方を向くように傾ける
  dish.position.set(width * 0.25, height / 2 + 5, -depth * 0.25);
  building.add(dish);

  // アンテナの支柱
  const supportGeometry = new THREE.CylinderGeometry(1, 1, 5, 8);
  const support = new THREE.Mesh(supportGeometry, antennaTowerMaterial);
  support.position.set(0, -3, 0);
  dish.add(support);
}

/**
 * ヘリポートを作成する
 */
function createHelipad(group, x, y, z) {
  // ヘリポート基盤
  const padGeometry = new THREE.CylinderGeometry(15, 15, 1, 32);
  const padMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.9,
    metalness: 0.1,
  });

  const helipad = new THREE.Mesh(padGeometry, padMaterial);
  helipad.position.set(x, y, z);
  group.add(helipad);

  // 「H」マーク
  const markGeometry = new THREE.PlaneGeometry(20, 20);
  const markTexture = new THREE.CanvasTexture(createHelipadTexture());
  const markMaterial = new THREE.MeshBasicMaterial({
    map: markTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const mark = new THREE.Mesh(markGeometry, markMaterial);
  mark.rotation.x = -Math.PI / 2;
  mark.position.y = 0.51;
  helipad.add(mark);

  // ヘリポート照明
  const lightCount = 12;
  const radius = 14;

  for (let i = 0; i < lightCount; i++) {
    const angle = (i / lightCount) * Math.PI * 2;

    const lightGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });

    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius);
    helipad.add(light);
  }
}

/**
 * ヘリポートテクスチャを作成する
 */
function createHelipadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  // 背景を透明に
  context.clearRect(0, 0, 256, 256);

  // 円を描画
  context.strokeStyle = "white";
  context.lineWidth = 10;
  context.beginPath();
  context.arc(128, 128, 100, 0, Math.PI * 2);
  context.stroke();

  // 「H」文字を描画
  context.fillStyle = "white";
  context.font = "bold 120px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("H", 128, 128);

  return canvas;
}

/**
 * 実験棟のサイロ（特殊容器）を作成
 */
function createExperimentalSilos(labBuilding) {
  // サイロの設定
  const siloCount = 3;
  const siloRadius = 5;
  const siloHeight = 25;

  for (let i = 0; i < siloCount; i++) {
    const siloGeometry = new THREE.CylinderGeometry(
      siloRadius,
      siloRadius,
      siloHeight,
      16
    );
    const siloMaterial = new THREE.MeshStandardMaterial({
      color: 0x3388cc, // 青系の色
      metalness: 0.7,
      roughness: 0.3,
    });

    const silo = new THREE.Mesh(siloGeometry, siloMaterial);
    silo.position.set(
      0,
      labBuilding.position.y + siloHeight / 2 - 5,
      20 + i * 15
    );
    labBuilding.parent.add(silo);

    // サイロの上部（ドーム）
    const domeGeometry = new THREE.SphereGeometry(
      siloRadius,
      16,
      8,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    const domeMaterial = new THREE.MeshStandardMaterial({
      color: 0x2277bb,
      metalness: 0.8,
      roughness: 0.2,
    });

    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = siloHeight / 2;
    silo.add(dome);

    // パイプ接続
    const pipeGeometry = new THREE.CylinderGeometry(1, 1, 10, 8);
    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0x777777,
      metalness: 0.6,
      roughness: 0.4,
    });

    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-siloRadius - 5, 5, 0);
    silo.add(pipe);

    // 警告マーキング
    const warningGeometry = new THREE.PlaneGeometry(5, 3);
    const warningMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });

    const warning = new THREE.Mesh(warningGeometry, warningMaterial);
    warning.position.set(0, 0, siloRadius + 0.1);
    warning.rotation.y = Math.PI / 2;
    silo.add(warning);

    // ステータスライト
    const lightGeometry = new THREE.SphereGeometry(0.8, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
    });

    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(0, siloHeight / 2 + 2, 0);
    dome.add(light);
  }
}

/**
 * 企業ロゴと社名を作成する
 */
function createCompanyLogo(building) {
  // ロゴ用のグループ
  const logoGroup = new THREE.Group();
  logoGroup.position.set(0, 20, 61); // 建物正面に配置
  building.add(logoGroup);

  // テキスト「TerraGroup Labs」
  const textSettings = [
    { text: "TERRA", y: 5, size: 6 },
    { text: "GROUP", y: -2, size: 6 },
    { text: "LABS", y: -9, size: 5 },
  ];

  textSettings.forEach((settings) => {
    createTextMesh(settings.text, 0, settings.y, 0, settings.size, logoGroup);
  });

  // 企業シンボル（簡易化したロゴ）
  // 地球を表す円
  const earthGeometry = new THREE.TorusGeometry(8, 1, 16, 32);
  const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3, // 企業カラーの青
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x0056b3,
    emissiveIntensity: 0.5,
  });

  const earthRing = new THREE.Mesh(earthGeometry, earthMaterial);
  earthRing.position.set(0, 15, 0);
  logoGroup.add(earthRing);

  // 中央の「T」
  const tVerticalGeometry = new THREE.BoxGeometry(2, 10, 1);
  const tMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // 白
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0xffffff,
    emissiveIntensity: 0.3,
  });

  const tVertical = new THREE.Mesh(tVerticalGeometry, tMaterial);
  tVertical.position.set(0, 15, 0.5);
  logoGroup.add(tVertical);

  const tHorizontalGeometry = new THREE.BoxGeometry(8, 2, 1);
  const tHorizontal = new THREE.Mesh(tHorizontalGeometry, tMaterial);
  tHorizontal.position.set(0, 20, 0.5);
  logoGroup.add(tHorizontal);
}

/**
 * テキストメッシュを作成する（簡易版）
 */
function createTextMesh(text, x, y, z, size, parent) {
  // 単純な平面で近似（実際のプロジェクトではテクスチャやフォントローダーを使用）
  const textGeometry = new THREE.PlaneGeometry(text.length * size * 0.8, size);
  const textMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // 白
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
  });

  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(x, y, z);
  parent.add(textMesh);

  return textMesh;
}

/**
 * セキュリティカメラを追加する
 */
function addSecurityCameras(group) {
  // カメラの設置場所
  const cameraPositions = [
    { x: 60, y: 55, z: 60, rot: Math.PI / 4 },
    { x: -60, y: 55, z: 60, rot: -Math.PI / 4 },
    { x: 60, y: 55, z: -60, rot: (3 * Math.PI) / 4 },
    { x: -60, y: 55, z: -60, rot: (-3 * Math.PI) / 4 },
    { x: 0, y: 55, z: 60, rot: 0 },
    { x: 0, y: 55, z: -60, rot: Math.PI },
    { x: 60, y: 55, z: 0, rot: Math.PI / 2 },
    { x: -60, y: 55, z: 0, rot: -Math.PI / 2 },
  ];

  cameraPositions.forEach((pos) => {
    // カメラ本体
    const cameraBodyGeometry = new THREE.BoxGeometry(3, 2, 4);
    const cameraBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.7,
      roughness: 0.3,
    });

    const cameraBody = new THREE.Mesh(cameraBodyGeometry, cameraBodyMaterial);
    cameraBody.position.set(pos.x, pos.y, pos.z);
    cameraBody.rotation.y = pos.rot;
    group.add(cameraBody);

    // カメラレンズ
    const lensGeometry = new THREE.CylinderGeometry(0.7, 1, 1.5, 8);
    const lensMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.9,
      roughness: 0.1,
    });

    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 2;
    cameraBody.add(lens);

    // ステータスLED
    const ledGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const ledMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8,
    });

    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(1, 0.5, 1);
    cameraBody.add(led);
  });
}

/**
 * 建物照明効果を追加する
 */
function addBuildingLights(group) {
  // 建物周辺のスポットライト
  const spotLightPositions = [
    { x: 100, y: 20, z: 100, target: { x: 0, y: 0, z: 0 } },
    { x: -100, y: 20, z: 100, target: { x: 0, y: 0, z: 0 } },
    { x: 100, y: 20, z: -100, target: { x: 0, y: 0, z: 0 } },
    { x: -100, y: 20, z: -100, target: { x: 0, y: 0, z: 0 } },
  ];

  spotLightPositions.forEach((pos, index) => {
    // スポットライト基盤
    const baseGeometry = new THREE.CylinderGeometry(2, 2, 2, 8);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.7,
      roughness: 0.3,
    });

    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(pos.x, pos.y, pos.z);
    group.add(base);

    // スポットライト本体
    const spotGeometry = new THREE.ConeGeometry(3, 4, 16);
    const spotMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.8,
      roughness: 0.2,
    });

    const spot = new THREE.Mesh(spotGeometry, spotMaterial);
    spot.rotation.x = Math.PI;

    // 中心を向く
    const dx = pos.target.x - pos.x;
    const dz = pos.target.z - pos.z;
    const angle = Math.atan2(dz, dx);
    spot.rotation.y = -angle + Math.PI / 2;

    spot.position.y = 2;
    base.add(spot);

    // 光源
    const lightGeometry = new THREE.SphereGeometry(1, 8, 8);
    const lightColor = index % 2 === 0 ? 0x0088ff : 0xffffff;
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: lightColor,
      transparent: true,
      opacity: 0.9,
    });

    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.y = -2;
    spot.add(light);

    // スポットライト光の放射表現（平面）
    const beamGeometry = new THREE.ConeGeometry(20, 50, 16);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: lightColor,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });

    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.y = -25;
    light.add(beam);
  });
}
