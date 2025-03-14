// building.js - TerraGroup研究施設の作成
// 修正版：ロゴとマーク削除

/**
 * TerraGroup研究施設を作成する
 */
function createBuilding() {
  return new Promise((resolve, reject) => {
    try {
      // TerraGroupのカラーテーマ
      const terraColors = {
        primary: 0x0056b3, // 青 (メインカラー)
        secondary: 0xffffff, // 白 (サブカラー)
        accent: 0x222222, // 黒 (アクセントカラー)
        glass: 0x88ccff, // ガラス
        metal: 0xaaaaaa, // 金属部分
        glow: 0x0088ff, // 光るパーツ
      };

      // ====== メインビルディング ======
      const buildingGroup = new THREE.Group();
      // 床とのZ-fightingを防ぐため、建物を少し上に配置
      buildingGroup.position.set(0, 0.5, 0);
      scene.add(buildingGroup);

      // メイン本部棟（中央の大きな建物）
      const mainBuildingGeometry = new THREE.BoxGeometry(120, 50, 80);
      const mainBuildingMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.secondary,
        metalness: 0.2,
        roughness: 0.1,
      });

      const mainBuilding = new THREE.Mesh(
        mainBuildingGeometry,
        mainBuildingMaterial
      );
      mainBuilding.position.set(0, 25, 0);
      mainBuilding.castShadow = true;
      mainBuilding.receiveShadow = true;
      buildingGroup.add(mainBuilding);

      // 研究棟（右側の低い建物）
      const researchBuildingGeometry = new THREE.BoxGeometry(70, 30, 100);
      const researchBuildingMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.secondary,
        metalness: 0.2,
        roughness: 0.1,
      });

      const researchBuilding = new THREE.Mesh(
        researchBuildingGeometry,
        researchBuildingMaterial
      );
      researchBuilding.position.set(95, 15, 0);
      researchBuilding.castShadow = true;
      researchBuilding.receiveShadow = true;
      buildingGroup.add(researchBuilding);

      // 実験棟（左側の特徴的な円筒形建物）
      const labTowerGeometry = new THREE.CylinderGeometry(25, 25, 80, 16);
      const labTowerMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.secondary,
        metalness: 0.3,
        roughness: 0.2,
      });

      const labTower = new THREE.Mesh(labTowerGeometry, labTowerMaterial);
      labTower.position.set(-80, 40, 30);
      labTower.castShadow = true;
      labTower.receiveShadow = true;
      buildingGroup.add(labTower);

      // ドーム型建物（左側）
      const domeGeometry = new THREE.SphereGeometry(
        20,
        32,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
      );
      const domeMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.glass,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
      });

      const dome = new THREE.Mesh(domeGeometry, domeMaterial);
      dome.position.set(-80, 80, 30);
      dome.castShadow = true;
      dome.receiveShadow = false;
      buildingGroup.add(dome);

      // 中央タワー（本部棟の上に立つ高いタワー）
      const towerGeometry = new THREE.BoxGeometry(30, 80, 30);
      const towerMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.primary,
        metalness: 0.5,
        roughness: 0.3,
      });

      const centralTower = new THREE.Mesh(towerGeometry, towerMaterial);
      centralTower.position.set(0, 90, 0);
      centralTower.castShadow = true;
      centralTower.receiveShadow = true;
      buildingGroup.add(centralTower);

      // タワー上部（タワーのトップに位置する特徴的なデザイン）
      const towerTopGeometry = new THREE.CylinderGeometry(15, 20, 15, 8);
      const towerTopMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.accent,
        metalness: 0.8,
        roughness: 0.2,
      });

      const towerTop = new THREE.Mesh(towerTopGeometry, towerTopMaterial);
      towerTop.position.set(0, 137.5, 0);
      towerTop.castShadow = true;
      towerTop.receiveShadow = false;
      buildingGroup.add(towerTop);

      // ====== 建物の細部 ======

      // -- 窓 -- (座標修正)
      // メイン本部棟の窓
      createWindowGrid(mainBuilding, 7, 4, 14, 9, terraColors.glass);

      // 研究棟の窓
      createWindowGrid(researchBuilding, 7, 3, 8, 8, terraColors.glass);

      // 実験棟の窓（円形に配置）
      createCylindricalWindows(labTower, 16, 8, terraColors.glass);

      // -- 連絡通路 --
      // 本部棟と研究棟を結ぶ通路
      const corridor1Geometry = new THREE.BoxGeometry(30, 10, 15);
      const corridor1Material = new THREE.MeshStandardMaterial({
        color: terraColors.primary,
        metalness: 0.3,
        roughness: 0.2,
      });

      const corridor1 = new THREE.Mesh(corridor1Geometry, corridor1Material);
      corridor1.position.set(45, 20, 0);
      corridor1.castShadow = true;
      corridor1.receiveShadow = true;
      buildingGroup.add(corridor1);

      // 本部棟と実験棟を結ぶ通路（高架）
      const corridor2Geometry = new THREE.BoxGeometry(60, 8, 10);
      const corridor2Material = corridor1Material.clone();

      const corridor2 = new THREE.Mesh(corridor2Geometry, corridor2Material);
      corridor2.position.set(-40, 40, 15);
      corridor2.castShadow = true;
      corridor2.receiveShadow = true;
      buildingGroup.add(corridor2);

      // -- エントランス --
      // メインエントランス
      const entranceGeometry = new THREE.BoxGeometry(40, 15, 10);
      const entranceMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.accent,
        metalness: 0.5,
        roughness: 0.2,
      });

      const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
      entrance.position.set(0, 7.5, 45); // 建物の前面に配置
      entrance.castShadow = true;
      entrance.receiveShadow = true;
      buildingGroup.add(entrance);

      // エントランスのガラスドア
      const doorGeometry = new THREE.PlaneGeometry(30, 12);
      const doorMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.glass,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });

      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.set(0, 7.5, 50.1);
      door.castShadow = false;
      buildingGroup.add(door);

      // -- 施設設備 --
      // アンテナ塔（中央タワーの上）
      const antennaGeometry = new THREE.CylinderGeometry(1, 1, 30, 8);
      const antennaMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.metal,
        metalness: 0.8,
        roughness: 0.2,
      });

      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(0, 160, 0);
      antenna.castShadow = true;
      buildingGroup.add(antenna);

      // アンテナの先端ライト
      const antennaTipGeometry = new THREE.SphereGeometry(1.5, 8, 8);
      const antennaTipMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1,
      });

      const antennaTip = new THREE.Mesh(antennaTipGeometry, antennaTipMaterial);
      antennaTip.position.set(0, 175, 0);
      buildingGroup.add(antennaTip);

      // 衛星通信アンテナ（中央タワーの屋上）
      const satelliteDishGeometry = new THREE.SphereGeometry(
        8,
        16,
        16,
        0,
        Math.PI,
        0,
        Math.PI / 2
      );
      const satelliteDishMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.metal,
        metalness: 0.6,
        roughness: 0.3,
      });

      const satelliteDish = new THREE.Mesh(
        satelliteDishGeometry,
        satelliteDishMaterial
      );
      satelliteDish.rotation.x = Math.PI / 4;
      satelliteDish.position.set(10, 137, 10);
      satelliteDish.castShadow = true;
      buildingGroup.add(satelliteDish);

      // 研究棟の設備
      const equipmentGeometry = new THREE.BoxGeometry(40, 5, 30);
      const equipmentMaterial = new THREE.MeshStandardMaterial({
        color: terraColors.metal,
        metalness: 0.6,
        roughness: 0.4,
      });

      const equipment = new THREE.Mesh(equipmentGeometry, equipmentMaterial);
      equipment.position.set(95, 32.5, 0);
      equipment.castShadow = true;
      buildingGroup.add(equipment);

      // 注: ロゴとマークは削除しました

      console.log("TerraGroup研究施設の作成完了");
      resolve();
    } catch (error) {
      console.error("建物作成エラー:", error);
      reject(error);
    }
  });
}

/**
 * 建物の壁面に窓のグリッドを作成する（座標ずれ修正版）
 */
function createWindowGrid(
  building,
  cols,
  rows,
  windowSpacingX,
  windowSpacingY,
  color
) {
  const buildingWidth = building.geometry.parameters.width;
  const buildingHeight = building.geometry.parameters.height;
  const buildingDepth = building.geometry.parameters.depth;

  const windowWidth = 5;
  const windowHeight = 8;

  const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });

  // 窓の配置をより正確に
  const startX = -buildingWidth / 2 + windowWidth + 12;
  const startY = -buildingHeight / 2 + windowHeight * 1.5 - 2;
  const startZ = buildingDepth / 2;

  // 前面（Z+方向）の窓
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const x = startX + col * windowSpacingX;
      const y = startY + row * windowSpacingY;

      const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      // Z方向にわずかにオフセットして、壁面のZ-fightingを防ぐ
      frontWindow.position.set(x, y, startZ + 0.1);
      building.add(frontWindow);

      // 背面の窓も追加（反対側）
      const backWindow = frontWindow.clone();
      backWindow.position.z = -startZ - 0.1;
      backWindow.rotation.y = Math.PI;
      building.add(backWindow);
    }
  }

  // 左右の窓
  const sideStartZ = -buildingDepth / 2 + windowWidth;

  for (let col = 0; col < Math.min(cols / 2, 4); col++) {
    for (let row = 0; row < rows; row++) {
      const z = sideStartZ + col * windowSpacingX;
      const y = startY + row * windowSpacingY;

      // 左側面の窓
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.position.set(-buildingWidth / 2 - 0.1, y, z);
      leftWindow.rotation.y = Math.PI / 2;
      building.add(leftWindow);

      // 右側面の窓
      const rightWindow = leftWindow.clone();
      rightWindow.position.x = buildingWidth / 2 + 0.1;
      rightWindow.rotation.y = -Math.PI / 2;
      building.add(rightWindow);
    }
  }
}

/**
 * 円筒形の建物に窓を配置する（座標修正版）
 */
function createCylindricalWindows(cylinder, segments, rows, color) {
  const radius = cylinder.geometry.parameters.radiusTop;
  const height = cylinder.geometry.parameters.height;

  const windowWidth = 4;
  const windowHeight = 6;

  const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });

  // 窓の配置をより正確に - 高さ方向の間隔を調整
  const startY = -height / 2 + windowHeight;
  const stepY = (height - windowHeight * 2) / (rows - 1);

  // 各層ごとに円周上に窓を配置
  for (let row = 0; row < rows; row++) {
    const y = startY + row * stepY;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      // 円柱表面から少しだけ外側にオフセット
      const x = Math.sin(angle) * (radius + 0.1);
      const z = Math.cos(angle) * (radius + 0.1);

      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(x, y, z);

      // 窓を円周の接線方向を向かせる
      window.lookAt(0, window.position.y, 0);

      cylinder.add(window);
    }
  }
}
