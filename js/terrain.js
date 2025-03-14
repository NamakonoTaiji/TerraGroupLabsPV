// terrain.js - TerraGroup研究施設の地形・環境生成
// 修正版：柵のみ復活

/**
 * 環境（地形、空、水など）を作成する
 */
function createEnvironment() {
  return new Promise((resolve, reject) => {
    try {
      // 地形の作成
      createTerrain();

      // 空と太陽の作成
      createSkyAndSun();

      // 森林の作成
      createForest();

      // 柵を復活
      createPerimeterFence();
      
      // 太陽光パネルを追加
      createSolarPanels();
      
      // 大規模浄水施設を追加
      createLargeWaterTreatmentFacility();

      resolve();
    } catch (error) {
      console.error("環境作成エラー:", error);
      reject(error);
    }
  });
}

/**
 * 地形（地面）を作成する
 */
function createTerrain() {
  // 大地のサイズを拡大（4000x4000）
  const groundGeometry = new THREE.PlaneGeometry(6000, 6000, 120, 120);

  // 草地テクスチャの作成
  function getTerrainMaterial() {
    return new THREE.MeshStandardMaterial({
      color: 0x558833,
      roughness: 0.8,
      metalness: 0.1,
    });
  }

  const ground = new THREE.Mesh(groundGeometry, getTerrainMaterial());
  ground.rotation.x = -Math.PI / 2; // 水平に配置
  ground.receiveShadow = true;
  ground.position.y = 0; // 地面の基準位置
  scene.add(ground);

  // 地形の起伏を作る（頂点を少しランダムに動かす）
  for (let i = 0; i < groundGeometry.attributes.position.count; i++) {
    // 中心から距離を計算
    const x = groundGeometry.attributes.position.getX(i);
    const z = groundGeometry.attributes.position.getZ(i);
    const distFromCenter = Math.sqrt(x * x + z * z);

    // 中心付近は平坦に、周囲は起伏をつける
    if (distFromCenter > 5000) {
      const noise = (Math.sin(x * 0.02) + Math.cos(z * 0.02)) * 5;
      const noise2 = Math.cos(x * 0.05) * Math.sin(z * 0.03) * 3;
      const height = noise + noise2;
      groundGeometry.attributes.position.setY(i, height);
    }
  }

  // バッファを更新
  groundGeometry.computeVertexNormals();
  groundGeometry.attributes.position.needsUpdate = true;

  // 施設の基礎部分（白いプラットフォーム）- Z-fightingを防ぐため少し上に配置
  const platformSize = 600; // より大きなプラットフォーム
  const platformGeometry = new THREE.BoxGeometry(platformSize, 1, platformSize);
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.6,
    metalness: 0.1,
  });

  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.set(0, 0.2, 0); // 床を地面より少し上に
  platform.receiveShadow = true;
  platform.castShadow = false;
  scene.add(platform);

  // 周囲の山々（より自然な形状）をさらに遠くに配置
  const mountainPositions = [
    { x: 2500, z: 1000, scale: 1.8 },
    { x: 2200, z: -1400, scale: 1.4 },
    { x: 1200, z: 2600, scale: 1.6 },
    { x: -2000, z: 2400, scale: 2.0 },
    { x: -2600, z: 0, scale: 1.9 },
    { x: -2200, z: -2200, scale: 1.5 },
    { x: 0, z: -2600, scale: 1.7 },
    { x: 1800, z: -2200, scale: 1.3 },
  ];

  mountainPositions.forEach((pos) => {
    createMountain(pos.x, pos.z, pos.scale);
  });

  console.log("地形作成完了");
}

/**
 * 山を作成する
 */
function createMountain(x, z, scale) {
  // よりランダムな形状の山
  const segments = 24;
  const mountainGeometry = new THREE.ConeGeometry(150, 300, segments);
  const mountainMaterial = new THREE.MeshStandardMaterial({
    color: 0x555566,
    roughness: 0.9,
    metalness: 0.1,
  });

  // 頂点をランダムに動かして自然な山に
  for (let i = 0; i < mountainGeometry.attributes.position.count; i++) {
    const vx = mountainGeometry.attributes.position.getX(i);
    const vy = mountainGeometry.attributes.position.getY(i);
    const vz = mountainGeometry.attributes.position.getZ(i);

    // 頂点のY座標が高いほど変形を少なく
    const yFactor = 1 - (vy + 150) / 300;

    if (vy < 150) {
      // 山頂付近は変形しない
      const noise = Math.sin(vx * 0.1) * Math.cos(vz * 0.1) * 15 * yFactor;
      mountainGeometry.attributes.position.setX(i, vx + noise);
      mountainGeometry.attributes.position.setZ(i, vz + noise);
    }
  }

  mountainGeometry.computeVertexNormals();
  mountainGeometry.attributes.position.needsUpdate = true;

  const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
  mountain.position.set(x, 0, z);
  mountain.scale.set(scale, scale, scale);
  mountain.rotation.y = Math.random() * Math.PI * 2;

  mountain.castShadow = true;
  mountain.receiveShadow = true;
  scene.add(mountain);
}

/**
 * 空と太陽を作成する
 */
function createSkyAndSun() {
  // 空のセットアップ
  sky = new THREE.Sky();
  sky.scale.setScalar(4000); // 大地に合わせて空も拡大
  scene.add(sky);

  // 太陽の位置パラメータ
  const sunPosition = new THREE.Vector3();
  const sunElevation = 35; // 高度（度）
  const sunAzimuth = -160; // 方位角（度）

  // 太陽の位置を極座標から設定
  const phi = THREE.MathUtils.degToRad(90 - sunElevation);
  const theta = THREE.MathUtils.degToRad(sunAzimuth);

  sunPosition.setFromSphericalCoords(1, phi, theta);

  // 空の効果を設定
  const uniforms = sky.material.uniforms;
  uniforms["sunPosition"].value.copy(sunPosition);
  uniforms["turbidity"].value = 8; // 濁り
  uniforms["rayleigh"].value = 1.5; // レイリー散乱
  uniforms["mieCoefficient"].value = 0.005; // ミー散乱係数
  uniforms["mieDirectionalG"].value = 0.8; // ミー指向性

  // 線形フォグ（霧）- 距離感を出す
  scene.fog = new THREE.FogExp2(0xccddff, 0.0005); // フォグを薄くして遠くまで見えるように

  console.log("空と太陽作成完了");
}

/**
 * 木々の森を作成する
 */
function createForest() {
  // 木のバリエーション
  const treeTypes = [
    createPineTree, // 針葉樹
    createOakTree, // 広葉樹
    createBushTree, // 低木
  ];

  // 施設周辺に木々を配置（排除ゾーン外）
  const treeCount = 800; // 木の総数を増加
  const exclusionRadius = 450; // 建物周辺の木を置かない半径
  const forestRadius = 3000; // 森林半径を拡大

  // 木のグループ（同じ種類の木をバッチ処理するため）
  const treeGroups = treeTypes.map(() => new THREE.Group());
  treeGroups.forEach((group) => scene.add(group));

  // 木々をランダムに配置
  for (let i = 0; i < treeCount; i++) {
    // ランダムな位置（極座標で）
    const angle = Math.random() * Math.PI * 2;
    // 排除ゾーンの外側からforestRadiusまでの範囲
    const radius =
      exclusionRadius + Math.random() * (forestRadius - exclusionRadius);

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // 地形の高さに合わせる（簡易的）
    let y = 0;
    // 中心から離れるほど地形が少し高くなる
    if (radius > 200) {
      const distFactor = (radius - 200) / 1800;
      const noise = (Math.sin(x * 0.02) + Math.cos(z * 0.02)) * 5;
      y = noise * distFactor;
    }

    // ランダムに木のタイプを選択
    const treeTypeIndex = Math.floor(Math.random() * treeTypes.length);
    const treeCreateFunc = treeTypes[treeTypeIndex];

    // 木を作成し、グループに追加
    const tree = treeCreateFunc();

    // スケールをランダム化して変化を出す
    const scale = 0.8 + Math.random() * 0.4;
    tree.scale.set(scale, scale, scale);

    // 少しだけランダムに回転
    tree.rotation.y = Math.random() * Math.PI * 2;

    // 位置設定
    tree.position.set(x, y, z);

    // 対応するグループに追加
    treeGroups[treeTypeIndex].add(tree);
  }

  console.log("森林作成完了");
}

/**
 * 針葉樹を作成する
 */
function createPineTree() {
  const tree = new THREE.Group();

  // 幹
  const trunkGeometry = new THREE.CylinderGeometry(1, 1.5, 20, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513, // 茶色
    roughness: 0.9,
    metalness: 0.0,
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 10;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  // 葉（円錐形）- 複数層で表現
  const leavesLayers = 4;
  const leavesColor = 0x004400; // 濃い緑

  for (let i = 0; i < leavesLayers; i++) {
    const radiusFactor = 1 - i * 0.2;
    const heightFactor = 1 - i * 0.15;

    const leavesGeometry = new THREE.ConeGeometry(
      8 * radiusFactor,
      15 * heightFactor,
      8
    );
    const leavesMaterial = new THREE.MeshStandardMaterial({
      color: leavesColor,
      roughness: 0.8,
      metalness: 0.0,
    });

    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 20 + i * 8;
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    tree.add(leaves);
  }

  return tree;
}

/**
 * 広葉樹を作成する
 */
function createOakTree() {
  const tree = new THREE.Group();

  // 幹
  const trunkGeometry = new THREE.CylinderGeometry(1.2, 2, 16, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x926239, // 茶色
    roughness: 0.8,
    metalness: 0.0,
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 8;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  // 葉（球体）- 少し変形させて不規則に
  const leavesGeometry = new THREE.SphereGeometry(10, 10, 10);

  // 頂点をランダムに動かして不規則な形状に
  for (let i = 0; i < leavesGeometry.attributes.position.count; i++) {
    const x = leavesGeometry.attributes.position.getX(i);
    const y = leavesGeometry.attributes.position.getY(i);
    const z = leavesGeometry.attributes.position.getZ(i);

    const noise = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 1.5;

    leavesGeometry.attributes.position.setX(i, x + (Math.random() - 0.5) * 2);
    leavesGeometry.attributes.position.setY(i, y + noise);
    leavesGeometry.attributes.position.setZ(i, z + (Math.random() - 0.5) * 2);
  }

  leavesGeometry.computeVertexNormals();

  const leavesMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d5e21, // 緑
    roughness: 0.8,
    metalness: 0.0,
  });

  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 20;
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  tree.add(leaves);

  return tree;
}

/**
 * 低木を作成する
 */
function createBushTree() {
  const bush = new THREE.Group();

  // 幹（短い）
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 6);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.9,
    metalness: 0.0,
  });

  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  bush.add(trunk);

  // 葉（複数の球体）
  const foliageCount = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < foliageCount; i++) {
    const foliageSize = 2 + Math.random() * 3;
    const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x466b2f, // 暗めの緑
      roughness: 0.8,
      metalness: 0.0,
    });

    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);

    // ランダムな位置に配置（幹の上部周辺）
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 2;
    foliage.position.set(
      Math.cos(angle) * radius,
      4 + Math.random() * 3,
      Math.sin(angle) * radius
    );

    foliage.castShadow = true;
    foliage.receiveShadow = true;
    bush.add(foliage);
  }

  return bush;
}

/**
 * 周囲のフェンスを作成する（基礎なし、建物と干渉しないバージョン）
 */
function createPerimeterFence() {
  // フェンスの設定
  const fenceSize = 320; // フェンスの半径（プラットフォームとの干渉を避けるため大きめに）
  const fenceHeight = 8; // フェンスの高さ

  // フェンスの材質
  const fenceMaterials = {
    post: new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.6,
      metalness: 0.4,
    }),
    wire: new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.4,
      metalness: 0.6,
      side: THREE.DoubleSide // 両面表示に設定
    }),
  };

  // フェンスの柱を配置
  const postSpacing = 10; // 柱の間隔
  const postGeometry = new THREE.CylinderGeometry(0.3, 0.3, fenceHeight, 8);

  // 四角形のフェンスを作成
  for (let side = 0; side < 4; side++) {
    const rotation = (side * Math.PI) / 2;
    const direction = new THREE.Vector3(
      Math.cos(rotation),
      0,
      Math.sin(rotation)
    );

    // 各辺のフェンス作成
    for (let i = -fenceSize + 5; i <= fenceSize - 5; i += postSpacing) {
      const perpendicular = i;
      const parallel = fenceSize;

      // 座標変換
      const x = perpendicular * direction.z + parallel * direction.x;
      const z = perpendicular * direction.x - parallel * direction.z;

      // 南側（正門があるところ）はゲート部分の柱をスキップ
      if (side === 0 && Math.abs(i) < 15) {
        continue; // ゲートの幅分だけ柱を設置しない
      }

      // 柱の作成
      const post = new THREE.Mesh(postGeometry, fenceMaterials.post);
      post.position.set(x, fenceHeight / 2, z);
      post.castShadow = true;
      post.receiveShadow = true;
      scene.add(post);
    }
  }

  // 鉄条網（フェンス上部）
  const wireGeometry = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
  const wireMaterial = fenceMaterials.wire;

  // 四辺にそれぞれ鉄条網を設置
  for (let side = 0; side < 4; side++) {
    const rotation = (side * Math.PI) / 2;
    const direction = new THREE.Vector3(
      Math.cos(rotation),
      0,
      Math.sin(rotation)
    );

    for (let i = -fenceSize + 6; i < fenceSize - 6; i += 4) {
      // 南側（正門があるところ）はゲート部分の鉄条網をスキップ
      if (side === 0 && Math.abs(i) < 15) {
        continue; // ゲートの幅分だけ鉄条網を設置しない
      }

      const perpendicular = i;
      const parallel = fenceSize;

      // 座標変換
      const x = perpendicular * direction.z + parallel * direction.x;
      const z = perpendicular * direction.x - parallel * direction.z;

      const wire = new THREE.Mesh(wireGeometry, wireMaterial);
      wire.position.set(x, fenceHeight, z);
      wire.rotation.x = Math.PI / 2;
      wire.rotation.z = rotation;
      wire.castShadow = true;
      scene.add(wire);
    }
  }

  // 監視カメラ（コーナーごとに）
  const cameraPositions = [
    { x: fenceSize - 5, z: fenceSize - 5 },
    { x: fenceSize - 5, z: -fenceSize + 5 },
    { x: -fenceSize + 5, z: fenceSize - 5 },
    { x: -fenceSize + 5, z: -fenceSize + 5 },
  ];

  cameraPositions.forEach((pos) => {
    createSecurityCamera(pos.x, pos.z);
  });

  // 正門（南側）
  createMainGate(0, fenceSize);

  console.log("セキュリティフェンス作成完了");
}

/**
 * 監視カメラを作成する
 */
function createSecurityCamera(x, z) {
  const camera = new THREE.Group();

  // カメラのマウント（支柱）
  const mountGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
  const mountMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.7,
    metalness: 0.3,
  });

  const mount = new THREE.Mesh(mountGeometry, mountMaterial);
  mount.position.y = 5;
  mount.castShadow = true;
  camera.add(mount);

  // カメラヘッド
  const headGeometry = new THREE.BoxGeometry(2, 1, 3);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.5,
  });

  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 10;
  head.position.x = 1;
  head.castShadow = true;
  camera.add(head);

  // レンズ
  const lensGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
  const lensMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.2,
    metalness: 0.8,
  });

  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(2.3, 10, 0);
  camera.add(lens);

  // 状態表示LED
  const ledGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  const ledMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 1,
  });

  const led = new THREE.Mesh(ledGeometry, ledMaterial);
  led.position.set(1, 10.6, 0);
  camera.add(led);

  // カメラを配置し、中央を向くように回転
  camera.position.set(x, 0, z);
  camera.lookAt(0, 10, 0);

  scene.add(camera);
  
  // カメラオブジェクトを返す
  return camera;
}

/**
 * 正門を作成する（南側に配置）
 */
function createMainGate(x, z) {
  const gate = new THREE.Group();

  // ゲートのフレーム（アーチ）
  const frameCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 15, 0),
    new THREE.Vector3(10, 0, 0)
  );

  const framePoints = frameCurve.getPoints(20);
  const frameGeometry = new THREE.BufferGeometry().setFromPoints(framePoints);
  const frameMaterial = new THREE.LineBasicMaterial({
    color: 0x0056b3,
    linewidth: 3,
  });

  const frame = new THREE.Line(frameGeometry, frameMaterial);
  gate.add(frame);

  // ゲートの柱（両側）
  const pillarGeometry = new THREE.BoxGeometry(2, 12, 2);
  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.7,
    metalness: 0.3,
  });

  const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  leftPillar.position.set(-10, 6, 0);
  leftPillar.castShadow = true;
  gate.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  rightPillar.position.set(10, 6, 0);
  rightPillar.castShadow = true;
  gate.add(rightPillar);

  // TerraGroupのロゴ（ゲート上部）
  const logoGeometry = new THREE.BoxGeometry(1, 8, 0.5);
  const logoMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x0056b3,
    emissiveIntensity: 0.5,
  });

  const logoVertical = new THREE.Mesh(logoGeometry, logoMaterial);
  logoVertical.position.set(0, 10, 0);
  gate.add(logoVertical);

  const logoHorizontalGeometry = new THREE.BoxGeometry(6, 1, 0.5);
  const logoHorizontal = new THREE.Mesh(logoHorizontalGeometry, logoMaterial);
  logoHorizontal.position.set(0, 13, 0);
  gate.add(logoHorizontal);

  // ゲートを配置
  gate.position.set(x, 0, z);
  // 向きを正しく設定（南側に配置、外側に向かって開く）
  gate.rotation.y = 0;

  scene.add(gate);
}

/**
 * 太陽光パネル設備を作成する
 */
function createSolarPanels() {
  // 太陽光パネル設備のグループ
  const solarPanelGroup = new THREE.Group();
  scene.add(solarPanelGroup);
  
  // 太陽光パネルのマテリアル
  const panelMaterials = {
    frame: new THREE.MeshStandardMaterial({
      color: 0x777777,
      roughness: 0.5,
      metalness: 0.8
    }),
    panel: new THREE.MeshStandardMaterial({
      color: 0x2244aa,
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 1.0
    }),
    support: new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.8,
      metalness: 0.2
    })
  };
  
  // 太陽光パネルエリアの配置場所（建物の西側）
  const panelAreaPosition = { x: -200, z: -100 };
  
  // おおよそ6x5の太陽光パネルアレイを作成
  const panelRows = 5;
  const panelCols = 6;
  const panelSpacing = 12;
  
  // 中央を設置ポイントとしたオフセットを計算
  const totalWidth = panelCols * panelSpacing;
  const totalDepth = panelRows * panelSpacing;
  const startX = panelAreaPosition.x - totalWidth / 2;
  const startZ = panelAreaPosition.z - totalDepth / 2;
  
  // 太陽光パネルのベースを作成（コンクリート基礎）
  const baseGeometry = new THREE.BoxGeometry(totalWidth + 15, 0.5, totalDepth + 15);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(panelAreaPosition.x, 0.25, panelAreaPosition.z);
  base.receiveShadow = true;
  solarPanelGroup.add(base);

  // 太陽光パネルのアレイを作成
  for (let row = 0; row < panelRows; row++) {
    for (let col = 0; col < panelCols; col++) {
      // パネルを作成
      const panel = createSingleSolarPanel();
      
      // 位置設定
      const x = startX + col * panelSpacing;
      const z = startZ + row * panelSpacing;
      panel.position.set(x, 0, z);
      
      // グループに追加
      solarPanelGroup.add(panel);
    }
  }
  
  // 監視カメラを配置（設備のセキュリティ）
  createSecurityCamera(panelAreaPosition.x + totalWidth / 2, panelAreaPosition.z - totalDepth / 2 - 5);
  
  // 説明看板を追加
  const signGeometry = new THREE.BoxGeometry(8, 4, 0.2);
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.5,
    metalness: 0.5
  });
  
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(panelAreaPosition.x - totalWidth / 2 - 5, 2, panelAreaPosition.z);
  sign.rotation.y = Math.PI / 2;
  solarPanelGroup.add(sign);
  
  console.log("太陽光パネル設備作成完了");
}

/**
 * 個別の太陽光パネルを作成
 */
function createSingleSolarPanel() {
  const panelGroup = new THREE.Group();
  
  // パネル本体サイズ
  const panelWidth = 8;
  const panelHeight = 0.2;
  const panelDepth = 6;
  
  // パネルのサポート様の差し棒
  const supportGeometry = new THREE.BoxGeometry(0.4, 2.5, 0.4);
  const supportMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.6,
    metalness: 0.4
  });
  
  // 前側のサポート
  const frontSupport = new THREE.Mesh(supportGeometry, supportMaterial);
  frontSupport.position.set(-panelWidth/2 + 1, 1.25, -panelDepth/2 + 0.5);
  frontSupport.castShadow = true;
  panelGroup.add(frontSupport);
  
  const frontSupport2 = new THREE.Mesh(supportGeometry, supportMaterial);
  frontSupport2.position.set(panelWidth/2 - 1, 1.25, -panelDepth/2 + 0.5);
  frontSupport2.castShadow = true;
  panelGroup.add(frontSupport2);
  
  // 後側のサポート（高め）
  const backSupport = new THREE.Mesh(supportGeometry, supportMaterial);
  backSupport.position.set(-panelWidth/2 + 1, 2.25, panelDepth/2 - 0.5);
  backSupport.castShadow = true;
  panelGroup.add(backSupport);
  
  const backSupport2 = new THREE.Mesh(supportGeometry, supportMaterial);
  backSupport2.position.set(panelWidth/2 - 1, 2.25, panelDepth/2 - 0.5);
  backSupport2.castShadow = true;
  panelGroup.add(backSupport2);
  
  // パネルフレーム
  const frameGeometry = new THREE.BoxGeometry(panelWidth, panelHeight, panelDepth);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.8,
    metalness: 0.5
  });
  
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.castShadow = true;
  frame.position.set(0, 3.5, 0);
  // 斜めに設置（太陽に向ける）
  frame.rotation.x = -Math.PI * 0.15;
  panelGroup.add(frame);
  
  // パネル本体（若干小さく）
  const panelGeometry = new THREE.BoxGeometry(panelWidth - 0.4, 0.1, panelDepth - 0.4);
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x2244aa,
    roughness: 0.4,   // 粗さを上げて、光没を抑える
    metalness: 0.6,   // 金属感を抹消
    envMapIntensity: 0.5  // 環境マップの強度を下げる
  });
  
  const panelSurface = new THREE.Mesh(panelGeometry, panelMaterial);
  panelSurface.position.set(0, 0.1, 0);  // 少し浮かせてZファイティングを避ける
  panelSurface.castShadow = true;
  frame.add(panelSurface);  // フレームの子要素にする
  
  // 各セルを表す格子模様を作成
  const gridSize = 4;
  const cellWidth = (panelWidth - 0.6) / gridSize;
  const cellHeight = (panelDepth - 0.6) / gridSize;
  
  const gridGeometry = new THREE.BufferGeometry();
  const gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, opacity: 0.7, transparent: true });
  
  // 格子の線を作成
  const points = [];
  for (let i = 0; i <= gridSize; i++) {
    const xPos = -panelWidth/2 + 0.3 + i * cellWidth;
    points.push(
      new THREE.Vector3(xPos, 0.07, -panelDepth/2 + 0.3),  // 高さを少し上げる
      new THREE.Vector3(xPos, 0.07, panelDepth/2 - 0.3)    // 高さを少し上げる
    );
  }
  
  for (let i = 0; i <= gridSize; i++) {
    const zPos = -panelDepth/2 + 0.3 + i * cellHeight;
    points.push(
      new THREE.Vector3(-panelWidth/2 + 0.3, 0.07, zPos),  // 高さを少し上げる
      new THREE.Vector3(panelWidth/2 - 0.3, 0.07, zPos)    // 高さを少し上げる
    );
  }
  
  gridGeometry.setFromPoints(points);
  const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
  panelSurface.add(grid);
  
  return panelGroup;
}

/**
 * 大規模浄水施設を作成する関数
 * 参考画像に基づいた円形タンク群と処理施設を再現
 */
function createLargeWaterTreatmentFacility() {
  console.log("大規模浄水施設の作成開始");
  
  // 浄水施設のグループ
  const waterFacilityGroup = new THREE.Group();
  scene.add(waterFacilityGroup);
  
  // 施設の配置位置（北東側） - 敷地内に収まるよう調整
  const facilityPosition = { x: 150, z: -150 };
  
  // 浄水施設のベース（コンクリート基礎） - 細長く敷地内に収める
  const baseGeometry = new THREE.BoxGeometry(220, 1, 180);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(facilityPosition.x, 0.5, facilityPosition.z);
  base.receiveShadow = true;
  waterFacilityGroup.add(base);

  // ============================================================
  // 円形浄水タンク（参考画像に基づく緑色のものと白色のもの）
  // ============================================================
  
  // 大型円形タンク（緑色のタンク）
  const createGreenTank = (x, z, radius = 30, depth = 5) => {
    const tankGroup = new THREE.Group();
    
    // 外側の壁
    const wallGeometry = new THREE.CylinderGeometry(radius, radius, depth, 32);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x004400,  // 深緑色
      roughness: 0.6,
      metalness: 0.3
    });
    
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = depth / 2;
    wall.castShadow = true;
    wall.receiveShadow = true;
    tankGroup.add(wall);
    
    // 内側の水（水面の表現） - Z-fighting解消用に位置とサイズを調整
    const waterGeometry = new THREE.CylinderGeometry(radius - 1.5, radius - 1.5, 0.1, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x004488,  // 濃い青色
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.8
    });
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = depth + 0.1;  // Z-fighting解消のため位置を上げる
    tankGroup.add(water);
    
    // 中央の回転機構（浄水器）
    const centerPillarGeometry = new THREE.CylinderGeometry(2, 2, depth + 4, 16);
    const centerPillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.6,
      metalness: 0.7
    });
    
    const centerPillar = new THREE.Mesh(centerPillarGeometry, centerPillarMaterial);
    centerPillar.position.y = depth / 2 + 2;
    centerPillar.castShadow = true;
    tankGroup.add(centerPillar);
    
    // 回転アーム
    const armGeometry = new THREE.BoxGeometry(radius * 1.8, 0.8, 0.8);
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
      metalness: 0.5
    });
    
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.y = depth + 3;
    arm.castShadow = true;
    tankGroup.add(arm);
    
    // タンクの位置を設定
    tankGroup.position.set(x, 0, z);
    waterFacilityGroup.add(tankGroup);
    
    return tankGroup;
  };
  
  // 白い円形タンク（浄水処理槽）
  const createWhiteTank = (x, z, radius = 25, depth = 5) => {
    const tankGroup = new THREE.Group();
    
    // 外側の壁
    const wallGeometry = new THREE.CylinderGeometry(radius, radius, depth, 32);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,  // 白色
      roughness: 0.3,
      metalness: 0.5
    });
    
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = depth / 2;
    wall.castShadow = true;
    wall.receiveShadow = true;
    tankGroup.add(wall);
    
    // 内側の水（水面の表現） - Z-fighting解消用に位置とサイズを調整
    const waterGeometry = new THREE.CylinderGeometry(radius - 1.5, radius - 1.5, 0.1, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x88ccff,  // 明るい青色（処理後のきれいな水）
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7
    });
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = depth - 0.01;  // 底面との間隔を広げる
    tankGroup.add(water);
    
    // タンクの位置を設定
    tankGroup.position.set(x, 0, z);
    waterFacilityGroup.add(tankGroup);
    
    return tankGroup;
  };
  
  // 参考画像に基づいて円形タンクを配置
  // 緑色タンク（最初の浄化槽） - 配置位置を調整
  createGreenTank(facilityPosition.x - 75, facilityPosition.z - 60, 25, 5);
  createGreenTank(facilityPosition.x, facilityPosition.z - 60, 25, 5);
  createGreenTank(facilityPosition.x + 75, facilityPosition.z - 60, 25, 5);
  
  // 白色タンク（最終浄化槽） - 配置位置を調整
  createWhiteTank(facilityPosition.x - 75, facilityPosition.z + 40, 22, 5);
  createWhiteTank(facilityPosition.x, facilityPosition.z + 40, 22, 5);
  createWhiteTank(facilityPosition.x + 75, facilityPosition.z + 40, 22, 5);
  
  // ============================================================
  // 処理施設・制御建物
  // ============================================================
  
  // 主制御棟 - 位置調整
  const controlBuildingGeometry = new THREE.BoxGeometry(35, 15, 25);
  const controlBuildingMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,  // TerraGroupのブルー
    roughness: 0.7,
    metalness: 0.3
  });
  
  const controlBuilding = new THREE.Mesh(controlBuildingGeometry, controlBuildingMaterial);
  controlBuilding.position.set(facilityPosition.x + 75, 7.5, facilityPosition.z - 20);
  controlBuilding.castShadow = true;
  controlBuilding.receiveShadow = true;
  waterFacilityGroup.add(controlBuilding);
  
  // 制御棟に窓を追加
  addWindowsToBox(controlBuilding, 4, 2);
  
  // 小さな機械室 - 位置調整
  const pumpHouseGeometry = new THREE.BoxGeometry(15, 8, 12);
  const pumpHouseMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const pumpHouse = new THREE.Mesh(pumpHouseGeometry, pumpHouseMaterial);
  pumpHouse.position.set(facilityPosition.x + 60, 4, facilityPosition.z - 80);
  pumpHouse.castShadow = true;
  pumpHouse.receiveShadow = true;
  waterFacilityGroup.add(pumpHouse);
  
  // ============================================================
  // 接続パイプとインフラ
  // ============================================================
  
  // パイプのマテリアル
  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.4,
    metalness: 0.7
  });
  
  // 緑タンク同士を接続するパイプ - 位置調整
  createPipe(
    facilityPosition.x - 75, 2.5, facilityPosition.z - 60,
    facilityPosition.x, 2.5, facilityPosition.z - 60,
    1.2, pipeMaterial
  );
  
  createPipe(
    facilityPosition.x, 2.5, facilityPosition.z - 60,
    facilityPosition.x + 75, 2.5, facilityPosition.z - 60,
    1.2, pipeMaterial
  );
  
  // 白タンク同士を接続するパイプ - 位置調整
  createPipe(
    facilityPosition.x - 75, 2.5, facilityPosition.z + 40,
    facilityPosition.x, 2.5, facilityPosition.z + 40,
    1.2, pipeMaterial
  );
  
  createPipe(
    facilityPosition.x, 2.5, facilityPosition.z + 40,
    facilityPosition.x + 75, 2.5, facilityPosition.z + 40,
    1.2, pipeMaterial
  );
  
  // 緑タンクから白タンクへの接続パイプ - 位置調整
  createPipe(
    facilityPosition.x - 75, 2.5, facilityPosition.z - 60,
    facilityPosition.x - 75, 2.5, facilityPosition.z + 40,
    1.2, pipeMaterial
  );
  
  createPipe(
    facilityPosition.x, 2.5, facilityPosition.z - 60,
    facilityPosition.x, 2.5, facilityPosition.z + 40,
    1.2, pipeMaterial
  );
  
  createPipe(
    facilityPosition.x + 75, 2.5, facilityPosition.z - 60,
    facilityPosition.x + 75, 2.5, facilityPosition.z + 40,
    1.2, pipeMaterial
  );
  
  // 制御棟と処理タンクを接続するパイプ - 位置調整
  createPipe(
    facilityPosition.x + 75, 2.5, facilityPosition.z - 60,
    facilityPosition.x + 75, 2.5, facilityPosition.z - 20,
    1.2, pipeMaterial
  );
  
  // ============================================================
  // 装飾要素（ベント、バルブ、梯子など）
  // ============================================================
  
  // タンク間の制御バルブを追加 - 位置調整
  addValve(facilityPosition.x - 37.5, 2.5, facilityPosition.z - 60);
  addValve(facilityPosition.x + 37.5, 2.5, facilityPosition.z - 60);
  addValve(facilityPosition.x - 37.5, 2.5, facilityPosition.z + 40);
  addValve(facilityPosition.x + 37.5, 2.5, facilityPosition.z + 40);
  
  // 各タンクへのアクセス梯子 - 追加方法を修正
  const ladders = [];
  ladders.push(addLadder(facilityPosition.x - 75, facilityPosition.z - 85, 5, 0));
  ladders.push(addLadder(facilityPosition.x, facilityPosition.z - 85, 5, 0));
  ladders.push(addLadder(facilityPosition.x + 75, facilityPosition.z - 85, 5, 0));
  ladders.push(addLadder(facilityPosition.x - 75, facilityPosition.z + 15, 5, Math.PI));
  ladders.push(addLadder(facilityPosition.x, facilityPosition.z + 15, 5, Math.PI));
  ladders.push(addLadder(facilityPosition.x + 75, facilityPosition.z + 15, 5, Math.PI));
  
  // 梯子をシーンに追加
  ladders.forEach(ladder => waterFacilityGroup.add(ladder));
  
  // 制御棟の屋上設備（ベントパイプとアンテナ） - 追加方法を修正
  const roofEquip = addRoofEquipment(facilityPosition.x + 75, 15, facilityPosition.z - 20);
  waterFacilityGroup.add(roofEquip);
  
  // ============================================================
  // 周囲のフェンスとセキュリティ要素
  // ============================================================
  
  // 浄水施設の周囲にフェンスを設置 - サイズ調整
  const fence = createFacilityFence(facilityPosition.x, facilityPosition.z, 210, 170);
  waterFacilityGroup.add(fence.posts);
  waterFacilityGroup.add(fence.fences);
  
  // セキュリティカメラを設置 - 敷地内に収まるよう位置調整
  const camera1 = createSecurityCamera(
    facilityPosition.x - 90, 
    facilityPosition.z - 80
  );
  camera1.lookAt(facilityPosition.x, 10, facilityPosition.z);
  
  const camera2 = createSecurityCamera(
    facilityPosition.x + 90, 
    facilityPosition.z + 80
  );
  camera2.lookAt(facilityPosition.x, 10, facilityPosition.z);
  
  // 施設名の看板 - 敷地内に収まるよう位置調整
  const signGeometry = new THREE.BoxGeometry(25, 5, 0.5);
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.5,
    metalness: 0.3
  });
  
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(facilityPosition.x, 3, facilityPosition.z + 80);
  sign.castShadow = true;
  waterFacilityGroup.add(sign);
  
  // TerraGroup のロゴ風デザイン
  const logoGeometry = new THREE.BoxGeometry(8, 3, 0.6);
  const logoMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.6,
    emissive: 0xffffff,
    emissiveIntensity: 0.2
  });
  
  const logo = new THREE.Mesh(logoGeometry, logoMaterial);
  logo.position.z = 0.1;
  sign.add(logo);
  
  console.log("大規模浄水施設の作成完了");
  return waterFacilityGroup;
}

/**
 * 2点間を接続するパイプを作成
 */
function createPipe(x1, y1, z1, x2, y2, z2, radius, material) {
  // 2点間の距離と中間点を計算
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const midZ = (z1 + z2) / 2;
  
  // パイプのジオメトリ（円柱）
  const pipeGeometry = new THREE.CylinderGeometry(radius, radius, distance, 8);
  const pipe = new THREE.Mesh(pipeGeometry, material);
  
  // パイプを2点間に配置
  pipe.position.set(midX, midY, midZ);
  
  // パイプを2点間を結ぶ方向に回転
  pipe.lookAt(x2, y2, z2);
  pipe.rotateX(Math.PI / 2);
  
  pipe.castShadow = true;
  scene.add(pipe);
  
  return pipe;
}

/**
 * バルブを追加
 */
function addValve(x, y, z) {
  const valveGroup = new THREE.Group();
  valveGroup.position.set(x, y, z);
  
  // バルブ本体
  const valveBodyGeometry = new THREE.CylinderGeometry(2, 2, 3, 16);
  const valveBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.8
  });
  
  const valveBody = new THREE.Mesh(valveBodyGeometry, valveBodyMaterial);
  valveBody.rotation.x = Math.PI / 2;
  valveBody.castShadow = true;
  valveGroup.add(valveBody);
  
  // バルブのハンドル
  const handleGeometry = new THREE.TorusGeometry(1.5, 0.3, 8, 16);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.6,
    metalness: 0.4
  });
  
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.y = 2;
  handle.castShadow = true;
  valveGroup.add(handle);
  
  // バルブのステム
  const stemGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
  const stem = new THREE.Mesh(stemGeometry, valveBodyMaterial);
  stem.position.y = 1;
  stem.castShadow = true;
  valveGroup.add(stem);
  
  scene.add(valveGroup);
  return valveGroup;
}

/**
 * アクセス用の梯子を追加
 */
function addLadder(x, z, height, rotation = 0) {
  const ladderGroup = new THREE.Group();
  ladderGroup.position.set(x, 0, z);
  ladderGroup.rotation.y = rotation;
  
  const ladderMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.7,
    metalness: 0.3
  });
  
  // 梯子の側面 - 位置調整
  const sideGeometry = new THREE.BoxGeometry(0.3, height, 0.3);
  
  const leftSide = new THREE.Mesh(sideGeometry, ladderMaterial);
  leftSide.position.set(-1, height / 2, 0);
  leftSide.castShadow = true;
  ladderGroup.add(leftSide);
  
  const rightSide = new THREE.Mesh(sideGeometry, ladderMaterial);
  rightSide.position.set(1, height / 2, 0);
  rightSide.castShadow = true;
  ladderGroup.add(rightSide);
  
  // 梯子の段 - 正しい高さに配置
  const stepCount = Math.floor(height / 0.5);
  const stepGeometry = new THREE.BoxGeometry(2.3, 0.2, 0.3);
  
  for (let i = 0; i < stepCount; i++) {
    const step = new THREE.Mesh(stepGeometry, ladderMaterial);
    // 小数点以下の計算誤差を避けるために切り上げて整数化
    const stepY = Math.floor((i * 0.5 + 0.3) * 10) / 10;
    step.position.set(0, stepY, 0);
    ladderGroup.add(step);
  }
  
  // 梯子グループを直接シーンに追加せず返却
  return ladderGroup;
}

/**
 * 制御棟屋上の設備を追加
 */
function addRoofEquipment(x, y, z) {
  const equipmentGroup = new THREE.Group();
  equipmentGroup.position.set(x, y, z);
  
  // 排気ベント1
  const vent1Geometry = new THREE.CylinderGeometry(1, 1.5, 3, 8);
  const ventMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.6,
    metalness: 0.4
  });
  
  const vent1 = new THREE.Mesh(vent1Geometry, ventMaterial);
  vent1.position.set(-10, 1.5, -5);
  vent1.castShadow = true;
  equipmentGroup.add(vent1);
  
  // 排気ベント2
  const vent2 = vent1.clone();
  vent2.position.set(-10, 1.5, 5);
  equipmentGroup.add(vent2);
  
  // アンテナ
  const antennaPoleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 8);
  const antennaMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.8
  });
  
  const antennaPole = new THREE.Mesh(antennaPoleGeometry, antennaMaterial);
  antennaPole.position.set(10, 4, 0);
  antennaPole.castShadow = true;
  equipmentGroup.add(antennaPole);
  
  // アンテナの受信部
  const antennaTopGeometry = new THREE.CylinderGeometry(0.1, 2, 4, 3);
  const antennaTop = new THREE.Mesh(antennaTopGeometry, antennaMaterial);
  antennaTop.position.set(0, 4, 0);
  antennaTop.rotation.x = Math.PI / 2;
  antennaPole.add(antennaTop);
  
  // 小さいボックス（空調ユニットなど）
  const acUnitGeometry = new THREE.BoxGeometry(5, 2, 4);
  const acUnitMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const acUnit = new THREE.Mesh(acUnitGeometry, acUnitMaterial);
  acUnit.position.set(0, 1, 0);
  acUnit.castShadow = true;
  equipmentGroup.add(acUnit);
  
  // ファン
  const fanGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 8);
  const fanMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.5
  });
  
  const fan = new THREE.Mesh(fanGeometry, fanMaterial);
  fan.position.set(0, 0.5, 0);
  fan.rotation.x = Math.PI / 2;
  acUnit.add(fan);
  
  // 群のみ返却する
  return equipmentGroup;
}

/**
 * 浄水施設を作成する（シンプルなバージョン - 新版に置き換えられます）
 */
function createWaterTreatmentFacility() {
  // 浄水施設のグループ
  const waterFacilityGroup = new THREE.Group();
  scene.add(waterFacilityGroup);
  
  // 配置位置（南西側）
  const facilityPosition = { x: 180, z: 150 };
  
  // 浄水施設のベース（コンクリート基礎）
  const baseGeometry = new THREE.BoxGeometry(80, 1, 60);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(facilityPosition.x, 0.5, facilityPosition.z);
  base.receiveShadow = true;
  waterFacilityGroup.add(base);
  
  // 主要建物（制御棒）
  const controlBuildingGeometry = new THREE.BoxGeometry(15, 10, 20);
  const controlBuildingMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const controlBuilding = new THREE.Mesh(controlBuildingGeometry, controlBuildingMaterial);
  controlBuilding.position.set(facilityPosition.x - 25, 5, facilityPosition.z + 15);
  controlBuilding.castShadow = true;
  controlBuilding.receiveShadow = true;
  waterFacilityGroup.add(controlBuilding);
  
  // 制御棒の窓
  addWindowsToBox(controlBuilding, 2, 2);
  
  // 水タンク（大）
  const largeTankGeometry = new THREE.CylinderGeometry(10, 10, 18, 16);
  const tankMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.3,
    metalness: 0.8
  });
  
  const largeTank = new THREE.Mesh(largeTankGeometry, tankMaterial);
  largeTank.position.set(facilityPosition.x + 25, 9, facilityPosition.z);
  largeTank.castShadow = true;
  largeTank.receiveShadow = true;
  waterFacilityGroup.add(largeTank);
  
  // タンクの上部
  const tankTopGeometry = new THREE.CylinderGeometry(11, 10, 2, 16);
  const tankTop = new THREE.Mesh(tankTopGeometry, tankMaterial);
  tankTop.position.set(facilityPosition.x + 25, 19, facilityPosition.z);
  tankTop.castShadow = true;
  waterFacilityGroup.add(tankTop);
  
  // 水タンク（小）を並べる
  const smallTankCount = 3;
  const smallTankGeometry = new THREE.CylinderGeometry(4, 4, 10, 12);
  
  for (let i = 0; i < smallTankCount; i++) {
    const smallTank = new THREE.Mesh(smallTankGeometry, tankMaterial);
    smallTank.position.set(
      facilityPosition.x - 5 + i * 15,
      5,
      facilityPosition.z - 15
    );
    smallTank.castShadow = true;
    smallTank.receiveShadow = true;
    waterFacilityGroup.add(smallTank);
    
    // タンク間をつなぐパイプ
    if (i < smallTankCount - 1) {
      const pipeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 15, 8);
      const pipeMaterial = new THREE.MeshStandardMaterial({
        color: 0x999999,
        roughness: 0.4,
        metalness: 0.6
      });
      
      const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
      pipe.rotation.z = Math.PI / 2;  // 横向きに
      pipe.position.set(
        facilityPosition.x - 5 + i * 15 + 7.5,
        5,
        facilityPosition.z - 15
      );
      pipe.castShadow = true;
      waterFacilityGroup.add(pipe);
    }
  }
  
  // 大きなタンクと制御棒をつなぐパイプ
  const mainPipeGeometry = new THREE.CylinderGeometry(1, 1, 40, 8);
  const mainPipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.4,
    metalness: 0.6
  });
  
  const mainPipe = new THREE.Mesh(mainPipeGeometry, mainPipeMaterial);
  mainPipe.rotation.z = Math.PI / 2;  // 横向きに
  mainPipe.position.set(facilityPosition.x, 8, facilityPosition.z);
  mainPipe.castShadow = true;
  waterFacilityGroup.add(mainPipe);
  
  // 大きなタンクと小さなタンクをつなぐ縦パイプ
  const verticalPipeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 15, 8);
  const verticalPipe = new THREE.Mesh(verticalPipeGeometry, mainPipeMaterial);
  verticalPipe.position.set(facilityPosition.x + 15, 10, facilityPosition.z - 10);
  verticalPipe.castShadow = true;
  waterFacilityGroup.add(verticalPipe);
  
  // 配管をつなぐコネクターポイント（少し詳細を加える）
  const connectorGeometry = new THREE.SphereGeometry(1.5, 12, 12);
  const connectorMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.4,
    metalness: 0.8
  });
  
  // 主要接続ポイントにコネクターを追加
  const connectorPositions = [
    { x: facilityPosition.x - 15, y: 8, z: facilityPosition.z },
    { x: facilityPosition.x + 15, y: 8, z: facilityPosition.z },
    { x: facilityPosition.x + 15, y: 10, z: facilityPosition.z - 10 },
    { x: facilityPosition.x + 15, y: 5, z: facilityPosition.z - 15 }
  ];
  
  connectorPositions.forEach(pos => {
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.set(pos.x, pos.y, pos.z);
    waterFacilityGroup.add(connector);
  });
  
  // フェンスを追加
  createFacilityFence(facilityPosition.x, facilityPosition.z, 85, 65);
  
  // 説明看板を追加
  const signGeometry = new THREE.BoxGeometry(10, 5, 0.2);
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0x0056b3,
    roughness: 0.5,
    metalness: 0.5
  });
  
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(facilityPosition.x, 2.5, facilityPosition.z + 35);
  sign.rotation.y = Math.PI;  // 南側を向くように
  waterFacilityGroup.add(sign);
  
  console.log("浄水施設作成完了");
  return waterFacilityGroup;
}

/**
 * 施設用の小さなフェンスを作成
 */
function createFacilityFence(centerX, centerZ, width, depth) {
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  
  // フェンスの柱のマテリアル
  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.6,
    metalness: 0.4
  });
  
  // 金綱のマテリアル - 両面表示に修正
  const wireMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.4,
    metalness: 0.6,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide  // 両面表示に設定
  });
  
  // フェンスの高さと柱の間隔
  const fenceHeight = 3.5;  // 高さを低めに調整
  const postSpacing = 10;
  
  // 柱のジオメトリ
  const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, fenceHeight, 8);
  
  // 柱を地面に配置するターゲットグループ
  const postsGroup = new THREE.Group();
  scene.add(postsGroup);
  
  // 長さ方向の柱を作成
  for (let x = -halfWidth; x <= halfWidth; x += postSpacing) {
    // 北側の柱
    const northPost = new THREE.Mesh(postGeometry, postMaterial);
    northPost.position.set(centerX + x, fenceHeight/2, centerZ - halfDepth);
    northPost.castShadow = true;
    postsGroup.add(northPost);
    
    // 南側の柱
    const southPost = new THREE.Mesh(postGeometry, postMaterial);
    southPost.position.set(centerX + x, fenceHeight/2, centerZ + halfDepth);
    southPost.castShadow = true;
    postsGroup.add(southPost);
  }
  
  // 幅方向の柱を作成
  for (let z = -halfDepth + postSpacing; z < halfDepth; z += postSpacing) {
    // 西側の柱
    const westPost = new THREE.Mesh(postGeometry, postMaterial);
    westPost.position.set(centerX - halfWidth, fenceHeight/2, centerZ + z);
    westPost.castShadow = true;
    postsGroup.add(westPost);
    
    // 東側の柱
    const eastPost = new THREE.Mesh(postGeometry, postMaterial);
    eastPost.position.set(centerX + halfWidth, fenceHeight/2, centerZ + z);
    eastPost.castShadow = true;
    postsGroup.add(eastPost);
  }
  
  // 金綱部分のターゲットグループ
  const fencesGroup = new THREE.Group();
  scene.add(fencesGroup);
  
  // 北側のフェンス
  const northFenceGeometry = new THREE.PlaneGeometry(width, fenceHeight);
  const northFence = new THREE.Mesh(northFenceGeometry, wireMaterial);
  northFence.position.set(centerX, fenceHeight/2, centerZ - halfDepth);
  northFence.castShadow = true;
  fencesGroup.add(northFence);
  
  // 南側のフェンス
  const southFenceGeometry = new THREE.PlaneGeometry(width, fenceHeight);
  const southFence = new THREE.Mesh(southFenceGeometry, wireMaterial);
  southFence.position.set(centerX, fenceHeight/2, centerZ + halfDepth);
  southFence.rotation.y = Math.PI;
  southFence.castShadow = true;
  fencesGroup.add(southFence);
  
  // 東側のフェンス
  const eastFenceGeometry = new THREE.PlaneGeometry(depth, fenceHeight);
  const eastFence = new THREE.Mesh(eastFenceGeometry, wireMaterial);
  eastFence.position.set(centerX + halfWidth, fenceHeight/2, centerZ);
  eastFence.rotation.y = -Math.PI / 2;
  eastFence.castShadow = true;
  fencesGroup.add(eastFence);
  
  // 西側のフェンス
  const westFenceGeometry = new THREE.PlaneGeometry(depth, fenceHeight);
  const westFence = new THREE.Mesh(westFenceGeometry, wireMaterial);
  westFence.position.set(centerX - halfWidth, fenceHeight/2, centerZ);
  westFence.rotation.y = Math.PI / 2;
  westFence.castShadow = true;
  fencesGroup.add(westFence);
  
  // ゲートの作成（南側に配置）
  const gateWidth = 15;
  const gateHeight = 3;
  
  // ゲート柱（左右）
  const gatePostGeometry = new THREE.CylinderGeometry(0.3, 0.3, fenceHeight, 8);
  const gatePostMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.6,
    metalness: 0.5
  });
  
  // 左のゲート柱
  const leftGatePost = new THREE.Mesh(gatePostGeometry, gatePostMaterial);
  leftGatePost.position.set(centerX - gateWidth/2, fenceHeight/2, centerZ + halfDepth);
  leftGatePost.castShadow = true;
  postsGroup.add(leftGatePost);
  
  // 右のゲート柱
  const rightGatePost = new THREE.Mesh(gatePostGeometry, gatePostMaterial);
  rightGatePost.position.set(centerX + gateWidth/2, fenceHeight/2, centerZ + halfDepth);
  rightGatePost.castShadow = true;
  postsGroup.add(rightGatePost);
  
  // ゲート自体
  const gateGeometry = new THREE.BoxGeometry(gateWidth, gateHeight, 0.1);
  const gateMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.5,
    metalness: 0.7,
    side: THREE.DoubleSide
  });
  
  const gate = new THREE.Mesh(gateGeometry, gateMaterial);
  gate.position.set(centerX, gateHeight/2, centerZ + halfDepth);
  gate.castShadow = true;
  fencesGroup.add(gate);
  
  // フェンスのグループを返す
  return { posts: postsGroup, fences: fencesGroup };
}

/**
 * 箱型の建物に窓を追加するヘルパー関数
 */
function addWindowsToBox(boxMesh, windowsX, windowsY) {
  const width = boxMesh.geometry.parameters.width;
  const height = boxMesh.geometry.parameters.height;
  const depth = boxMesh.geometry.parameters.depth;
  
  const windowWidth = width / (windowsX + 1) * 0.7;
  const windowHeight = height / (windowsY + 2) * 0.7;
  
  const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.7,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.DoubleSide
  });
  
  // 建物の前面と背面に窓を追加
  for (let y = 0; y < windowsY; y++) {
    for (let x = 0; x < windowsX; x++) {
      // X位置を計算
      const xPos = -width/2 + width * (x + 1) / (windowsX + 1);
      // Y位置を計算（上部から下に）
      const yPos = height/2 - height * (y + 1) / (windowsY + 1);
      
      // 前面の窓
      const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      frontWindow.position.set(xPos, yPos, depth/2 + 0.01); // 少し浮かせる
      boxMesh.add(frontWindow);
      
      // 背面の窓
      const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      backWindow.position.set(xPos, yPos, -depth/2 - 0.01);
      backWindow.rotation.y = Math.PI;
      boxMesh.add(backWindow);
    }
  }
}
