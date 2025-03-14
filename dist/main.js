// Three.jsモジュールをCDNからインポート
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/OrbitControls.js";
import { Sky } from "https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/objects/Sky.js";
import { Water } from "https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/objects/Water.js";

import { DroneCamera } from "./drone.js";

// グローバル変数
let scene, camera, renderer, controls, clock;
let building, drone, terrain, water, sun, sky;
let viewMode = "drone"; // 'drone' または 'free'
let flyMode = "circuit"; // 'circuit', 'hover', 'inspection'

// DOM要素
const container = document.getElementById("scene-container");
const loadingScreen = document.querySelector(".loading-screen");
const coordinatesElement = document.getElementById("coordinates");
const altitudeElement = document.getElementById("altitude");

// 初期化関数
async function init() {
  // シーン作成
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  // レンダラー設定
  renderer = new THREE.WebGLRenderer({
    canvas: container,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  // クロック（時間管理）
  clock = new THREE.Clock();

  // カメラ設定
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(100, 100, 100);
  camera.lookAt(0, 0, 0);

  // コントロール設定
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.enabled = false; // ドローンモードがデフォルト

  // 環境光
  createLighting();

  // 3Dモデル読み込み
  await Promise.all([createEnvironment(), createBuilding()]);

  // ドローン作成
  drone = new DroneCamera();
  drone.position.set(150, 50, 150);

  // イベントリスナー
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", onKeyDown);

  // ロード画面を非表示
  setTimeout(() => {
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 1000);
  }, 1500);

  // アニメーションスタート
  animate();
}

// 照明設定
function createLighting() {
  // 環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  // 主光源（太陽光）
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(300, 300, 300);
  mainLight.castShadow = true;

  // シャドウマップ設定
  const d = 300;
  mainLight.shadow.camera.left = -d;
  mainLight.shadow.camera.right = d;
  mainLight.shadow.camera.top = d;
  mainLight.shadow.camera.bottom = -d;
  mainLight.shadow.camera.near = 1;
  mainLight.shadow.camera.far = 1000;
  mainLight.shadow.bias = -0.001;

  // シャドウマップクオリティ
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;

  scene.add(mainLight);

  // 補助光
  const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
  fillLight.position.set(-100, 100, -100);
  scene.add(fillLight);

  // 縁取り光
  const rimLight = new THREE.DirectionalLight(0xffffaa, 0.2);
  rimLight.position.set(0, 0, -100);
  scene.add(rimLight);
}

// 環境作成
async function createEnvironment() {
  // 地形作成
  terrain = createTerrain();
  scene.add(terrain);

  // 空作成
  sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  // 太陽パラメータ
  const skyUniforms = sky.material.uniforms;
  skyUniforms["turbidity"].value = 10;
  skyUniforms["rayleigh"].value = 2;
  skyUniforms["mieCoefficient"].value = 0.005;
  skyUniforms["mieDirectionalG"].value = 0.8;

  // 太陽位置
  sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(60); // 高度
  const theta = THREE.MathUtils.degToRad(180); // 方位
  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms["sunPosition"].value.copy(sun);

  // 水作成
  const waterGeometry = new THREE.PlaneGeometry(2000, 2000);
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(sun.x, sun.y, sun.z).normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e30,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = -10;
  scene.add(water);
}

// 地形作成
function createTerrain() {
  const terrainGroup = new THREE.Group();

  // 地形のサイズ
  const terrainSize = 1000;
  const terrainResolution = 64;

  // 基本的な平地の作成
  const groundGeometry = new THREE.PlaneGeometry(
    terrainSize,
    terrainSize,
    terrainResolution,
    terrainResolution
  );

  // ノイズ関数
  const simpleNoise = (x, y) => {
    // シンプルなノイズ生成
    return (
      Math.sin(x * 0.1) * Math.cos(y * 0.1) * 5 +
      Math.sin(x * 0.05 + y * 0.03) * 10 +
      Math.cos(x * 0.02 - y * 0.03) * 7
    );
  };

  // 頂点を変位させて地形を作成
  const vertices = groundGeometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];

    // 中心部（施設エリア）は平らに
    const distanceFromCenter = Math.sqrt(x * x + z * z);
    if (distanceFromCenter > 100) {
      // 中心から離れるほど起伏を大きく
      const heightScale = Math.min((distanceFromCenter - 100) / 200, 1);
      const height = simpleNoise(x, z) * heightScale;
      vertices[i + 1] = height;
    } else {
      vertices[i + 1] = 0; // 中心部は高さ0
    }
  }

  // 法線を再計算
  groundGeometry.computeVertexNormals();

  // 地形素材
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x446633,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: false,
  });

  // 地形メッシュの作成
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  terrainGroup.add(ground);

  return terrainGroup;
}

// 建物作成
async function createBuilding() {
  building = new THREE.Group();

  // マテリアル
  const materials = {
    concrete: new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.9,
      metalness: 0.1,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      transmission: 0.9,
      opacity: 0.4,
      metalness: 0.2,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5,
      specularIntensity: 1,
      clearcoat: 1,
      transparent: true,
      side: THREE.DoubleSide,
    }),
    metal: new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.2,
      metalness: 0.8,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: 0x0056b3,
      roughness: 0.2,
      metalness: 0.8,
    }),
    emissive: new THREE.MeshStandardMaterial({
      color: 0x00c2ff,
      emissive: 0x00c2ff,
      emissiveIntensity: 1,
      roughness: 0.2,
      metalness: 0.8,
    }),
  };

  // 本館
  const mainBuildingGeometry = new THREE.BoxGeometry(60, 30, 40);
  const mainBuilding = new THREE.Mesh(mainBuildingGeometry, materials.concrete);
  mainBuilding.position.set(0, 15, 0);
  mainBuilding.castShadow = true;
  mainBuilding.receiveShadow = true;
  building.add(mainBuilding);

  // エントランス
  const entranceGeometry = new THREE.BoxGeometry(20, 10, 15);
  const entrance = new THREE.Mesh(entranceGeometry, materials.concrete);
  entrance.position.set(0, 5, 27.5);
  entrance.castShadow = true;
  entrance.receiveShadow = true;
  building.add(entrance);

  // 研究棟A（左側）
  const labAGeometry = new THREE.BoxGeometry(30, 15, 35);
  const labA = new THREE.Mesh(labAGeometry, materials.concrete);
  labA.position.set(-40, 7.5, 0);
  labA.castShadow = true;
  labA.receiveShadow = true;
  building.add(labA);

  // 研究棟B（右側）
  const labBGeometry = new THREE.BoxGeometry(35, 20, 25);
  const labB = new THREE.Mesh(labBGeometry, materials.concrete);
  labB.position.set(40, 10, 0);
  labB.castShadow = true;
  labB.receiveShadow = true;
  building.add(labB);

  // メインドーム（背後に配置）
  const domeGeometry = new THREE.SphereGeometry(
    20,
    32,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  const dome = new THREE.Mesh(domeGeometry, materials.glass);
  dome.position.set(0, 10, -40);
  dome.castShadow = true;
  building.add(dome);

  // ドーム内の装置
  const coreGeometry = new THREE.IcosahedronGeometry(8, 1);
  const core = new THREE.Mesh(coreGeometry, materials.emissive);
  core.position.set(0, 12, -40);
  building.add(core);

  // 地面
  const groundGeometry = new THREE.BoxGeometry(200, 0.5, 200);
  const ground = new THREE.Mesh(groundGeometry, materials.concrete);
  ground.position.set(0, -0.25, 0);
  ground.receiveShadow = true;
  building.add(ground);

  scene.add(building);

  return building;
}

// ウィンドウリサイズ時の処理
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// キー押下時の処理
function onKeyDown(event) {
  switch (event.code) {
    case "Space":
      // ドローンの飛行モード切り替え
      flyMode =
        flyMode === "circuit"
          ? "hover"
          : flyMode === "hover"
          ? "inspection"
          : "circuit";
      drone.setFlightMode(flyMode);
      break;
    case "KeyV":
      // 視点モード切り替え
      viewMode = viewMode === "drone" ? "free" : "drone";
      controls.enabled = viewMode === "free";
      break;
  }
}

// 座標情報更新
function updateInfoPanel() {
  const position = drone.position;
  coordinatesElement.textContent = `X: ${position.x.toFixed(
    1
  )}, Y: ${position.y.toFixed(1)}, Z: ${position.z.toFixed(1)}`;
  altitudeElement.textContent = position.y.toFixed(1);
}

// アニメーション関数
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // ドローンモードでは、ドローンで制御
  if (viewMode === "drone") {
    drone.update(delta, new THREE.Vector3(0, 0, 0));
    camera.position.copy(drone.cameraPosition);
    camera.lookAt(drone.lookAtPosition);
  } else {
    // フリーモードでは、OrbitControlsで制御
    controls.update();
  }

  // 水をアニメーション
  if (water) {
    water.material.uniforms["time"].value += delta;
  }

  // 情報パネル更新
  updateInfoPanel();

  // レンダリング
  renderer.render(scene, camera);
}

// 初期化実行
init().catch((error) => {
  console.error("初期化エラー:", error);
  alert("3Dシーンの読み込みに失敗しました。ページを更新してください。");
});
