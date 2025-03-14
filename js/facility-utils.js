// facility-utils.js - TerraGroup研究施設のユーティリティ関数

/**
 * 施設周囲のフェンスを作成する
 * @param {number} centerX - フェンスの中心X座標
 * @param {number} centerZ - フェンスの中心Z座標
 * @param {number} width - フェンスの幅
 * @param {number} depth - フェンスの奥行き
 * @returns {Object} フェンスのポストとフェンス部分のグループ
 */
function createFacilityFence(centerX, centerZ, width, depth) {
  console.log("フェンスの作成開始");
  
  const postsGroup = new THREE.Group();
  const fencesGroup = new THREE.Group();
  
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  
  // フェンスポストの材質
  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.7,
    metalness: 0.3
  });
  
  // フェンスの材質
  const fenceMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.7,
    side: THREE.DoubleSide
  });
  
  // フェンスのワイヤーメッシュ材質
  const wireMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.5,
    metalness: 0.7,
    wireframe: true
  });
  
  // ポストの間隔
  const postSpacing = 5;
  
  // X方向のフェンス（前後）
  for (let x = -halfWidth; x <= halfWidth; x += postSpacing) {
    // 前側のポスト
    const frontPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 5, 8),
      postMaterial
    );
    frontPost.position.set(centerX + x, 2.5, centerZ - halfDepth);
    frontPost.castShadow = true;
    postsGroup.add(frontPost);
    
    // 後側のポスト
    const backPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 5, 8),
      postMaterial
    );
    backPost.position.set(centerX + x, 2.5, centerZ + halfDepth);
    backPost.castShadow = true;
    postsGroup.add(backPost);
    
    // フェンスパネルを追加（前後のポスト間）
    if (x < halfWidth) {
      // 前側のフェンス
      const frontFence = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        fenceMaterial
      );
      frontFence.position.set(
        centerX + x + postSpacing / 2,
        2.5,
        centerZ - halfDepth
      );
      frontFence.rotation.y = Math.PI / 2;
      fencesGroup.add(frontFence);
      
      // フェンスのワイヤーメッシュ効果
      const frontWire = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        wireMaterial
      );
      frontWire.position.set(
        centerX + x + postSpacing / 2,
        2.5,
        centerZ - halfDepth + 0.01
      );
      frontWire.rotation.y = Math.PI / 2;
      fencesGroup.add(frontWire);
      
      // 後側のフェンス
      const backFence = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        fenceMaterial
      );
      backFence.position.set(
        centerX + x + postSpacing / 2,
        2.5,
        centerZ + halfDepth
      );
      backFence.rotation.y = Math.PI / 2;
      fencesGroup.add(backFence);
      
      // フェンスのワイヤーメッシュ効果
      const backWire = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        wireMaterial
      );
      backWire.position.set(
        centerX + x + postSpacing / 2,
        2.5,
        centerZ + halfDepth + 0.01
      );
      backWire.rotation.y = Math.PI / 2;
      fencesGroup.add(backWire);
    }
  }
  
  // Z方向のフェンス（左右）
  for (let z = -halfDepth; z <= halfDepth; z += postSpacing) {
    // 左側のポスト
    const leftPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 5, 8),
      postMaterial
    );
    leftPost.position.set(centerX - halfWidth, 2.5, centerZ + z);
    leftPost.castShadow = true;
    postsGroup.add(leftPost);
    
    // 右側のポスト
    const rightPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 5, 8),
      postMaterial
    );
    rightPost.position.set(centerX + halfWidth, 2.5, centerZ + z);
    rightPost.castShadow = true;
    postsGroup.add(rightPost);
    
    // フェンスパネルを追加（左右のポスト間）
    if (z < halfDepth) {
      // 左側のフェンス
      const leftFence = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        fenceMaterial
      );
      leftFence.position.set(
        centerX - halfWidth,
        2.5,
        centerZ + z + postSpacing / 2
      );
      fencesGroup.add(leftFence);
      
      // フェンスのワイヤーメッシュ効果
      const leftWire = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        wireMaterial
      );
      leftWire.position.set(
        centerX - halfWidth + 0.01,
        2.5,
        centerZ + z + postSpacing / 2
      );
      fencesGroup.add(leftWire);
      
      // 右側のフェンス
      const rightFence = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        fenceMaterial
      );
      rightFence.position.set(
        centerX + halfWidth,
        2.5,
        centerZ + z + postSpacing / 2
      );
      fencesGroup.add(rightFence);
      
      // フェンスのワイヤーメッシュ効果
      const rightWire = new THREE.Mesh(
        new THREE.PlaneGeometry(postSpacing, 4),
        wireMaterial
      );
      rightWire.position.set(
        centerX + halfWidth + 0.01,
        2.5,
        centerZ + z + postSpacing / 2
      );
      fencesGroup.add(rightWire);
    }
  }
  
  // 有刺鉄線（上部）
  const barbedWireMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.3,
    metalness: 0.9
  });
  
  // X方向の有刺鉄線
  for (let x = -halfWidth; x < halfWidth; x += postSpacing) {
    // 前側の有刺鉄線
    const frontBarbedWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, postSpacing, 8),
      barbedWireMaterial
    );
    frontBarbedWire.rotation.z = Math.PI / 2;
    frontBarbedWire.position.set(
      centerX + x + postSpacing / 2,
      4.7,
      centerZ - halfDepth
    );
    fencesGroup.add(frontBarbedWire);
    
    // 後側の有刺鉄線
    const backBarbedWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, postSpacing, 8),
      barbedWireMaterial
    );
    backBarbedWire.rotation.z = Math.PI / 2;
    backBarbedWire.position.set(
      centerX + x + postSpacing / 2,
      4.7,
      centerZ + halfDepth
    );
    fencesGroup.add(backBarbedWire);
  }
  
  // Z方向の有刺鉄線
  for (let z = -halfDepth; z < halfDepth; z += postSpacing) {
    // 左側の有刺鉄線
    const leftBarbedWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, postSpacing, 8),
      barbedWireMaterial
    );
    leftBarbedWire.rotation.x = Math.PI / 2;
    leftBarbedWire.position.set(
      centerX - halfWidth,
      4.7,
      centerZ + z + postSpacing / 2
    );
    fencesGroup.add(leftBarbedWire);
    
    // 右側の有刺鉄線
    const rightBarbedWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, postSpacing, 8),
      barbedWireMaterial
    );
    rightBarbedWire.rotation.x = Math.PI / 2;
    rightBarbedWire.position.set(
      centerX + halfWidth,
      4.7,
      centerZ + z + postSpacing / 2
    );
    fencesGroup.add(rightBarbedWire);
  }
  
  console.log("フェンスの作成完了");
  return { posts: postsGroup, fences: fencesGroup };
}

/**
 * ボックス型オブジェクトに窓を追加する
 * @param {THREE.Mesh} box - 窓を追加するボックスオブジェクト
 * @param {number} rows - 窓の行数
 * @param {number} cols - 窓の列数
 */
function addWindowsToBox(box, rows, cols) {
  // ボックスのサイズを取得
  const boxWidth = box.geometry.parameters.width;
  const boxHeight = box.geometry.parameters.height;
  const boxDepth = box.geometry.parameters.depth;
  
  // 窓の材質
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.7
  });
  
  // 窓のサイズと間隔
  const windowWidth = boxWidth / (cols * 2 + 1);
  const windowHeight = boxHeight / (rows * 2 + 1);
  
  // 窓の配置（前面）
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const window = new THREE.Mesh(
        new THREE.PlaneGeometry(windowWidth, windowHeight),
        windowMaterial
      );
      
      // 窓の位置を計算
      const x = (col - (cols - 1) / 2) * (windowWidth * 2);
      const y = (row - (rows - 1) / 2) * (windowHeight * 2);
      
      // 前面の窓
      const frontWindow = window.clone();
      frontWindow.position.set(x, y, boxDepth / 2 + 0.01);
      box.add(frontWindow);
      
      // 背面の窓
      const backWindow = window.clone();
      backWindow.position.set(x, y, -boxDepth / 2 - 0.01);
      backWindow.rotation.y = Math.PI;
      box.add(backWindow);
      
      // 左側面の窓
      const leftWindow = window.clone();
      leftWindow.position.set(-boxWidth / 2 - 0.01, y, x);
      leftWindow.rotation.y = -Math.PI / 2;
      box.add(leftWindow);
      
      // 右側面の窓
      const rightWindow = window.clone();
      rightWindow.position.set(boxWidth / 2 + 0.01, y, x);
      rightWindow.rotation.y = Math.PI / 2;
      box.add(rightWindow);
    }
  }
}
