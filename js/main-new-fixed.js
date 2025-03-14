// main-new-fixed.js - メインアプリケーションの実装
// 修正版：シンプルな動作と不要機能の削除

// グローバル変数
let scene, camera, renderer, controls, clock;
let building, drone, terrain, water, sun, sky;
let viewMode = "drone"; // 'drone' または 'free'
let flyMode = "circuit"; // 'circuit', 'hover', 'inspection'
let isUIVisible = true; // UIの表示状態

// DOM要素
const container = document.getElementById("scene-container");
const loadingScreen = document.querySelector(".loading-screen");
const coordinatesElement = document.getElementById("coordinates");
const altitudeElement = document.getElementById("altitude");
const flightModeElement = document.getElementById("flight-mode");
const statusMessageElement = document.getElementById("status-message");

// フライトモードの表示テキスト
const flightModeLabels = {
    'circuit': '施設周回',
    'hover': '俯瞰視点',
    'inspection': '近距離周回'
};

// 初期化関数
async function init() {
    console.log("初期化開始");

    try {
        // シーン作成
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        console.log("シーン作成完了");

        // レンダラー設定 - より高品質な設定
        renderer = new THREE.WebGLRenderer({
            canvas: container,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.9;
        renderer.outputEncoding = THREE.sRGBEncoding;
        console.log("レンダラー設定完了");

        // クロック（時間管理）
        clock = new THREE.Clock();

        // カメラ設定
        camera = new THREE.PerspectiveCamera(
            50, // 視野角を少し狭く（よりズームした感じ）
            window.innerWidth / window.innerHeight,
            0.1,
            5000 // レンダリング距離を延長
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
            controls.maxDistance = 1000;
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

        // 環境光と照明
        createLighting();
        console.log("照明設定完了");

        // 3Dモデル読み込み
        await Promise.all([createEnvironment(), createBuilding()]);
        console.log("環境と建物の読み込み完了");

        // カメラ制御作成
        drone = new DroneCamera();
        drone.position.set(200, 120, 200);
        console.log("カメラ制御作成完了");

        // イベントリスナー
        window.addEventListener("resize", onWindowResize);
        window.addEventListener("keydown", onKeyDown);
        console.log("イベントリスナー設定完了");

        // ステータスメッセージの初期化
        updateFlightModeDisplay();
        
        // ロード画面を非表示 - スムーズなフェードアウト
        console.log("ロード画面を非表示にする準備");
        setTimeout(() => {
            console.log("ロード画面の透明化");
            loadingScreen.style.opacity = 0;
            
            // フェードアウトが完了したらHTML要素を完全に非表示
            setTimeout(() => {
                console.log("ロード画面を完全に非表示");
                loadingScreen.style.display = "none";
                
                // UI表示クラスを追加
                document.body.classList.add('ui-visible');
                
                // スタートアップメッセージを表示
                showStatusMessage("TerraGroup Labs へようこそ");
            }, 1500);
        }, 1800);

        // アニメーションスタート
        console.log("アニメーション開始");
        animate();
    } catch (error) {
        console.error("初期化エラー:", error);
        alert("3Dシーンの読み込みに失敗しました: " + error.message);
    }
}

// ウィンドウリサイズ時の処理
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ステータスメッセージを表示
function showStatusMessage(message, duration = 3000) {
    statusMessageElement.textContent = message;
    statusMessageElement.classList.add("visible");
    
    // 一定時間後にメッセージを非表示
    setTimeout(() => {
        statusMessageElement.classList.remove("visible");
    }, duration);
}

// 飛行モード表示の更新
function updateFlightModeDisplay() {
    if (flightModeElement) {
        flightModeElement.textContent = flightModeLabels[flyMode] || flyMode;
    }
}

// UI表示切替機能
function toggleUI(show) {
    if (show) {
        document.body.classList.remove('ui-hidden');
        document.body.classList.add('ui-visible');
    } else {
        document.body.classList.remove('ui-visible');
        document.body.classList.add('ui-hidden');
    }
}

// キー入力処理
function onKeyDown(event) {
    switch (event.code) {
        case "Space":
            // スペースキーでモード切替
            if (flyMode === "circuit") {
                flyMode = "hover";
                showStatusMessage("モード切替: 俯瞰視点");
            } else if (flyMode === "hover") {
                flyMode = "inspection";
                showStatusMessage("モード切替: 近距離周回");
            } else {
                flyMode = "circuit";
                showStatusMessage("モード切替: 施設周回");
            }
            
            updateFlightModeDisplay();
            console.log("飛行モード切替:", flyMode);
            break;

        case "KeyV":
            // Vキーでビュー切替
            viewMode = viewMode === "drone" ? "free" : "drone";
            controls.enabled = viewMode === "free";
            
            if (viewMode === "free") {
                showStatusMessage("視点切替: フリーカメラ操作");
            } else {
                showStatusMessage("視点切替: 自動カメラ");
            }
            
            console.log("ビューモード切替:", viewMode);
            break;
            
        case "KeyH":
            // Hキーで表示切替
            isUIVisible = !isUIVisible;
            toggleUI(isUIVisible);
            
            if (isUIVisible) {
                showStatusMessage("UI表示: オン");
            } else {
                showStatusMessage("UI表示: オフ");
            }
            
            console.log("UI表示切替:", isUIVisible);
            break;
            
        case "KeyP":
            // Pキーでスクリーンショット
            takeScreenshot();
            break;
    }
}

// スクリーンショット機能
function takeScreenshot() {
    // レンダリングしてデータURLを取得
    renderer.render(scene, camera);
    const dataURL = renderer.domElement.toDataURL("image/png");
    
    // リンク要素を作成してダウンロードを実行
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `terragroup-screenshot-${Date.now()}.png`;
    link.click();
    
    showStatusMessage("スクリーンショットを保存しました");
}

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // カメラ制御の更新
    if (drone) {
        drone.update(delta);
    }

    // コントロールの更新
    if (controls && controls.enabled) {
        controls.update();
    }

    // レンダリング
    renderer.render(scene, camera);
}

// ウィンドウロード時に初期化
window.addEventListener("load", function () {
    console.log("ページ読み込み完了、初期化を開始します");
    init().catch((error) => {
        console.error("初期化エラー:", error);
        alert("3Dシーンの読み込みに失敗しました。ページを更新してください。");
    });
});
