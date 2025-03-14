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
