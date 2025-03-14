// drone-new.js - カメラ制御クラスの実装
// 修正版：単純な周回モーションと不要部分の削除

/**
 * カメラ制御クラス
 * シンプルな周回移動を実現するクラス
 */
class DroneCamera {
    constructor() {
        // 位置情報
        this.position = new THREE.Vector3(0, 50, 200);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
        this.quaternion = new THREE.Quaternion();
        
        // 飛行パラメータ
        this.maxSpeed = 2.5; // よりゆっくりと
        this.maxForce = 0.05;
        this.damping = 0.95;
        
        // カメラの動きを滑らかにする
        this.lerpFactor = 0.05;
        this.targetPosition = this.position.clone();
        
        // 自動周回飛行のパラメータ
        this.circuitRadius = 300; // より遠くから周回
        this.circuitHeight = 150; // 高めの視点
        this.circuitSpeed = 0.001; // ゆっくりと周回
        this.circuitAngle = 0;
        
        // 注視点制御
        this.targetLookAt = new THREE.Vector3(0, 20, 0); // 常に施設の中心を見る
        this.currentLookAt = this.targetLookAt.clone();
        this.lookAtLerpFactor = 0.03;
        
        // UI表示要素
        this.coordinatesElement = document.getElementById('coordinates');
        this.altitudeElement = document.getElementById('altitude');
        
        console.log("カメラ制御初期化完了");
    }
    
    /**
     * 位置の更新
     */
    update(deltaTime) {
        if (flyMode === 'circuit') {
            this.updateCircuitFlight(deltaTime);
        } else if (flyMode === 'hover') {
            this.updateHoverFlight(deltaTime);
        } else if (flyMode === 'inspection') {
            this.updateInspectionFlight(deltaTime);
        }
        
        // 目標位置へ緩やかに移動（Lerp補間）
        this.position.lerp(this.targetPosition, this.lerpFactor);
        
        // 現在の注視点を目標注視点に補間移動
        this.currentLookAt.lerp(this.targetLookAt, this.lookAtLerpFactor);
        
        // UI情報を更新
        if (this.coordinatesElement) {
            this.coordinatesElement.textContent = `X: ${Math.round(this.position.x)}, Y: ${Math.round(this.position.y)}, Z: ${Math.round(this.position.z)}`;
        }
        
        if (this.altitudeElement) {
            this.altitudeElement.textContent = Math.round(this.position.y);
        }
        
        // カメラ位置の更新
        if (viewMode === 'drone') {
            this.updateCameraView();
        }
    }
    
    /**
     * カメラビューを更新
     */
    updateCameraView() {
        // カメラの位置を更新
        camera.position.copy(this.position);
        
        // 常に施設を見る
        camera.lookAt(this.currentLookAt);
    }
    
    /**
     * 周回飛行モードの更新（最もシンプルな円運動）
     */
    updateCircuitFlight(deltaTime) {
        // 円運動のパラメータを更新
        this.circuitAngle += this.circuitSpeed;
        
        // 新しい目標位置を計算（水平面内での円運動）
        const x = Math.cos(this.circuitAngle) * this.circuitRadius;
        const z = Math.sin(this.circuitAngle) * this.circuitRadius;
        
        // 高さは少し変化をつける（サイン波で上下に）
        const y = this.circuitHeight + Math.sin(this.circuitAngle * 2) * 10;
        
        this.targetPosition.set(x, y, z);
        
        // 常に施設中心を見るように設定
        this.targetLookAt.set(0, 20, 0);
        
        // 速度と加速度を更新
        const direction = new THREE.Vector3()
            .subVectors(this.targetPosition, this.position)
            .normalize();
        
        // 目標位置への加速
        this.acceleration.copy(direction).multiplyScalar(this.maxForce);
        
        // 物理更新
        this.velocity.add(this.acceleration);
        
        // 最大速度制限
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }
        
        // 減衰
        this.velocity.multiplyScalar(this.damping);
    }
    
    /**
     * ホバリングモードの更新（ほぼ静止）
     */
    updateHoverFlight(deltaTime) {
        // 固定位置でのホバリング
        this.targetPosition.set(0, 200, 0); // 上空から真下を見る
        this.targetLookAt.set(0, 0, 0); // 建物全体を見下ろす
    }
    
    /**
     * 建物点検モードの更新（近い距離で周回）
     */
    updateInspectionFlight(deltaTime) {
        // より小さな円で周回
        this.circuitAngle += this.circuitSpeed * 1.5;
        
        // 新しい目標位置を計算（水平面内での円運動）- より小さな半径
        const inspectionRadius = 150;
        const x = Math.cos(this.circuitAngle) * inspectionRadius;
        const z = Math.sin(this.circuitAngle) * inspectionRadius;
        
        // 高さは低め
        const y = 80;
        
        this.targetPosition.set(x, y, z);
        
        // 常に中央を見る
        this.targetLookAt.set(0, 30, 0);
        
        // 速度と加速度更新（周回モードと同じ）
        const direction = new THREE.Vector3()
            .subVectors(this.targetPosition, this.position)
            .normalize();
        
        this.acceleration.copy(direction).multiplyScalar(this.maxForce);
        this.velocity.add(this.acceleration);
        
        if (this.velocity.length() > this.maxSpeed * 0.7) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed * 0.7);
        }
        
        this.velocity.multiplyScalar(this.damping);
    }
}
