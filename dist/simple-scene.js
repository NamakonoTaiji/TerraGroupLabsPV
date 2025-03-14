// simple-scene.js - 簡易版のThree.jsシーン
// これをプロジェクトのjs/フォルダに作成

// グローバル変数
let scene, camera, renderer, clock;
let cube;

// DOM要素
const container = document.getElementById("scene-container");
const loadingScreen = document.querySelector(".loading-screen");
const coordinatesElement = document.getElementById("coordinates");

// 初期化関数
function init() {
  console.log("簡易初期化開始");

  // シーン作成
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // レンダラー設定
  renderer = new THREE.WebGLRenderer({
    canvas: container,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log("レンダラー設定完了");

  // クロック（時間管理）
  clock = new THREE.Clock();

  // カメラ設定
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);
  console.log("カメラ設定完了");

  // 簡単なジオメトリを作成
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x0056b3 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  console.log("オブジェクト作成完了");

  // 光源追加
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  console.log("光源追加完了");

  // イベントリスナー
  window.addEventListener("resize", onWindowResize);
  console.log("イベントリスナー設定完了");

  // ロード画面を非表示
  console.log("ロード画面を非表示にする準備");
  setTimeout(() => {
    console.log("ロード画面の透明化");
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
      console.log("ロード画面を完全に非表示");
      loadingScreen.style.display = "none";
    }, 500);
  }, 500);

  // アニメーションスタート
  console.log("アニメーション開始");
  animate();
}

// ウィンドウリサイズ時の処理
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// アニメーション関数
function animate() {
  requestAnimationFrame(animate);

  // キューブを回転
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  // レンダリング
  renderer.render(scene, camera);
}

// 初期化実行
window.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("DOMContentLoaded イベント発火");
    init();
  } catch (error) {
    console.error("初期化エラー:", error);
    alert("3Dシーンの読み込みに失敗しました: " + error.message);
  }
});
