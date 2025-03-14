// lighting-fixed.js - TerraGroup研究施設の照明設定
// 改良版：より洗練された照明表現

/**
 * シーンの照明を設定する
 * TerraGroupの企業カラー（青・白・黒）に合わせた照明演出
 */
function createLighting() {
    // 環境光（全体を均一に照らす） - 青みがかった色味
    const ambientLight = new THREE.AmbientLight(0xC0D0FF, 0.3);
    scene.add(ambientLight);
    
    // 主光源（太陽光を表現）
    const mainLight = new THREE.DirectionalLight(0xFFFAF0, 1.2);
    mainLight.position.set(300, 400, 300);
    mainLight.castShadow = true;
    
    // シャドウマップの設定（高品質）
    const d = 350;
    mainLight.shadow.camera.left = -d;
    mainLight.shadow.camera.right = d;
    mainLight.shadow.camera.top = d;
    mainLight.shadow.camera.bottom = -d;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 1000;
    mainLight.shadow.bias = -0.0003;
    
    // シャドウマップのクオリティ（高解像度）
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    
    // レンダリング品質向上のためのシャドウパラメータ
    mainLight.shadow.normalBias = 0.02;
    
    scene.add(mainLight);
    
    // 補助光（青みがかった光で企業カラーを強調）
    const fillLight = new THREE.DirectionalLight(0x8888FF, 0.4);
    fillLight.position.set(-100, 100, -100);
    scene.add(fillLight);
    
    // 縁取り光（被写体と背景を分離）
    const rimLight = new THREE.DirectionalLight(0xFFFFEE, 0.2);
    rimLight.position.set(0, 0, -100);
    scene.add(rimLight);
    
    // 建物ライトアップ用のスポットライト
    const spotLights = [];
    
    // メイン建物用スポットライト（青色）
    const mainSpotLight = new THREE.SpotLight(0x0056B3, 3);
    mainSpotLight.position.set(0, 200, 50);
    mainSpotLight.angle = Math.PI / 10;
    mainSpotLight.penumbra = 0.3;
    mainSpotLight.decay = 1.5;
    mainSpotLight.distance = 300;
    
    // 照射ターゲット
    mainSpotLight.target.position.set(0, 40, 0);
    scene.add(mainSpotLight.target);
    scene.add(mainSpotLight);
    
    spotLights.push(mainSpotLight);
    
    // 左側実験棟用スポットライト（白色）
    const leftSpotLight = new THREE.SpotLight(0xFFFFFF, 2);
    leftSpotLight.position.set(-100, 150, 100);
    leftSpotLight.angle = Math.PI / 12;
    leftSpotLight.penumbra = 0.3;
    leftSpotLight.decay = 1.5;
    leftSpotLight.distance = 250;
    
    leftSpotLight.target.position.set(-80, 40, 30);
    scene.add(leftSpotLight.target);
    scene.add(leftSpotLight);
    
    spotLights.push(leftSpotLight);
    
    // 右側研究棟用スポットライト（青白色）
    const rightSpotLight = new THREE.SpotLight(0xAACCFF, 2);
    rightSpotLight.position.set(150, 120, 100);
    rightSpotLight.angle = Math.PI / 12;
    rightSpotLight.penumbra = 0.3;
    rightSpotLight.decay = 1.5;
    rightSpotLight.distance = 250;
    
    rightSpotLight.target.position.set(95, 15, 0);
    scene.add(rightSpotLight.target);
    scene.add(rightSpotLight);
    
    spotLights.push(rightSpotLight);
    
    // ヘミスフィアライト（空と地面の色を考慮した環境光）
    const hemiLight = new THREE.HemisphereLight(0xB0C0FF, 0x444422, 0.3);
    scene.add(hemiLight);
    
    // 地面からの反射光を表現（薄い色）
    const groundReflection = new THREE.DirectionalLight(0x91A566, 0.1);
    groundReflection.position.set(0, -1, 0);
    scene.add(groundReflection);
    
    // 建物のロゴに当てるポイントライト
    const logoLight = new THREE.PointLight(0x0088FF, 2, 50);
    logoLight.position.set(0, 50, 60);
    scene.add(logoLight);
    
    // ライトの自動アニメーション関数
    function animateLights() {
        // スポットライトの強度を時間によって少し変化させる
        spotLights.forEach((light, index) => {
            // 微妙に変化するパターン
            const time = Date.now() * 0.001;
            const intensity = 1.8 + Math.sin(time * (0.2 + index * 0.1)) * 0.2;
            light.intensity = intensity;
        });
        
        // ロゴライトの強度も変化
        const time = Date.now() * 0.001;
        logoLight.intensity = 2 + Math.sin(time * 0.3) * 0.5;
        
        // 次のフレームでも更新
        requestAnimationFrame(animateLights);
    }
    
    // ライトアニメーションを開始
    animateLights();
    
    // フォグ効果（距離感を強調）- 青みがかった霧
    scene.fog = new THREE.FogExp2(0xCCDDFF, 0.0007);
    
    return {
        ambientLight,
        mainLight,
        fillLight,
        rimLight,
        spotLights,
        hemiLight,
        groundReflection,
        logoLight
    };
}
