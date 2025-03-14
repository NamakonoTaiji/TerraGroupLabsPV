// main-new.js
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
  console.log("初期化開始");

  try {
    // シーン作成
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
    console.log("シーン作成完了");

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
    console.log("レンダラー設定完了");

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
    console.log("カメラ設定完了");

    // コントロール設定
    try {
      console.log("OrbitControls constructor:", THREE.OrbitControls);
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 10;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2 - 0.05;
      controls.enabled = false; // ドローンモードがデフォルト
      console.log("コントロール設定完了");
    } catch (error) {
      console.error("OrbitControls初期化エラー:", error);
      // OrbitControlsがなくても続行するための代替コード
      controls = {
        enabled: false,
        update: function () {}, // ダミー関数
      };
    }
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.enabled = false; // ドローンモードがデフォルト
    console.log("コントロール設定完了");

    // 環境光
    createLighting();
    console.log("照明設定完了");

    // 3Dモデル読み込み
    await Promise.all([createEnvironment(), createBuilding()]);
    console.log("環境と建物の読み込み完了");

    // ドローン作成
    drone = new DroneCamera();
    drone.position.set(150, 50, 150);
    console.log("ドローン作成完了");

    // イベントリスナー
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keydown", onKeyDown);
    console.log("イベントリスナー設定完了");

    // ロード画面を非表示
    console.log("ロード画面を非表示にする準備");
    setTimeout(() => {
      console.log("ロード画面の透明化");
      loadingScreen.style.opacity = 0;
      setTimeout(() => {
        console.log("ロード画面を完全に非表示");
        loadingScreen.style.display = "none";
      }, 1000);
    }, 1500);

    // アニメーションスタート
    console.log("アニメーション開始");
    animate();
  } catch (error) {
    console.error("初期化エラー:", error);
    alert("3Dシーンの読み込みに失敗しました: " + error.message);
  }
}

// 元のコードの関数をそのまま使用（but importなし）
// 照明設定、createEnvironment、createTerrain、createBuilding等...

// ウィンドウロード時に初期化
window.addEventListener("load", function () {
  console.log("ページ読み込み完了、初期化を開始します");
  init().catch((error) => {
    console.error("初期化エラー:", error);
    alert("3Dシーンの読み込みに失敗しました。ページを更新してください。");
  });
});
