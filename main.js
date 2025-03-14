// グローバル変数
let scene, camera, renderer;
let controls = {
    cameraSpeed: 0.3,
    cameraHeight: 50,
    cameraDistance: 120
};
let angle = 0;
let clock = new THREE.Clock();
let isUIVisible = true;

// 初期化関数
function init() {
    // シーンの作成
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);
    
    // カメラの作成
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, controls.cameraHeight, controls.cameraDistance);
    camera.lookAt(0, 0, 0);
    
    // レンダラーの作成
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // 空色の背景
    renderer.shadowMap.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement);
    
    // 光源の追加
    addLights();
    
    // 地面の追加
    createGround();
    
    // 森の追加
    createForest();
    
    // TerraGroup施設の追加
    createFacility();
    
    // フェンスの追加
    createFence();
    
    // イベントリスナー
    window.addEventListener('resize', onWindowResize, false);
    
    // UIコントロール
    setupUIControls();
    
    // アニメーションの開始
    animate();
}

// 光源の追加
function addLights() {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // 太陽光（平行光源）
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;
    
    // 影の設定
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    
    scene.add(sunLight);
}

// 地面の作成
function createGround() {
    // 地形のテクスチャ
    const textureLoader = new THREE.TextureLoader();
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 1.0,
        metalness: 0.0,
        wireframe: false
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.