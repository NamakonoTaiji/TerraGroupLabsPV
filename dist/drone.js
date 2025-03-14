import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js";

/**
 * ドローンカメラクラス
 * ドローンの動きと視点を制御する
 */
export class DroneCamera {
  constructor() {
    // プロパティ初期化
    this.position = new THREE.Vector3(100, 50, 100);
    this.rotation = new THREE.Euler(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.cameraPosition = new THREE.Vector3();
    this.lookAtPosition = new THREE.Vector3();
    this.flightMode = "circuit"; // circuit, hover, inspection
    this.circuitRadius = 150;
    this.circuitHeight = 50;
    this.circuitSpeed = 0.2;
    this.hoverHeight = 80;
    this.inspectionRadius = 70;
    this.angle = 0;
    this.targetBuilding = new THREE.Vector3(0, 0, 0);

    // ドローンモデル作成は省略（視点のみとする）
  }

  // フライトモード設定
  setFlightMode(mode) {
    this.flightMode = mode;
    console.log(`Flight mode changed to: ${mode}`);
  }

  // 更新処理
  update(deltaTime, targetPosition) {
    if (targetPosition) {
      this.targetBuilding = targetPosition;
    }

    // フライトモードに応じて動作を変更
    switch (this.flightMode) {
      case "circuit":
        this.updateCircuitFlight(deltaTime);
        break;
      case "hover":
        this.updateHoverFlight(deltaTime);
        break;
      case "inspection":
        this.updateInspectionFlight(deltaTime);
        break;
    }

    // カメラの位置を更新
    // ドローンから少し後ろと上にオフセット
    this.cameraPosition.copy(this.position).add(new THREE.Vector3(0, 2, 0));

    // 視点方向の更新
    const lookDirection = new THREE.Vector3();
    if (this.flightMode === "inspection") {
      // 検査モードでは建物を常に見る
      lookDirection.subVectors(this.targetBuilding, this.position).normalize();
    } else {
      // その他のモードでは進行方向を見る
      lookDirection.copy(this.velocity).normalize();
    }

    this.lookAtPosition
      .copy(this.position)
      .add(lookDirection.multiplyScalar(10));
  }

  // 周回飛行の更新
  updateCircuitFlight(deltaTime) {
    // 円形の経路を飛行
    this.angle += this.circuitSpeed * deltaTime;

    const targetX = Math.cos(this.angle) * this.circuitRadius;
    const targetZ = Math.sin(this.angle) * this.circuitRadius;
    const targetY = this.circuitHeight + Math.sin(this.angle * 0.5) * 10; // 高さの変動

    const target = new THREE.Vector3(targetX, targetY, targetZ);

    // 現在位置から目標位置への補間
    this.position.lerp(target, 0.02);

    // 速度計算
    this.velocity.subVectors(target, this.position);
  }

  // ホバリング飛行の更新
  updateHoverFlight(deltaTime) {
    // ある地点の上でホバリング
    const hoverPoint = new THREE.Vector3(
      Math.sin(Date.now() * 0.0005) * 30,
      this.hoverHeight,
      Math.cos(Date.now() * 0.0004) * 30
    );

    // 補間移動
    this.position.lerp(hoverPoint, 0.01);

    // 速度計算
    this.velocity.subVectors(hoverPoint, this.position);
  }

  // 検査飛行の更新
  updateInspectionFlight(deltaTime) {
    // 建物の周りを検査するように飛行
    this.angle += this.circuitSpeed * 0.5 * deltaTime;

    const targetX = Math.cos(this.angle) * this.inspectionRadius;
    const targetZ = Math.sin(this.angle) * this.inspectionRadius;
    const targetY = 20 + Math.abs(Math.sin(this.angle * 2)) * 40; // 垂直移動

    const target = new THREE.Vector3(
      targetX + this.targetBuilding.x,
      targetY + this.targetBuilding.y,
      targetZ + this.targetBuilding.z
    );

    // 補間移動
    this.position.lerp(target, 0.05);

    // 速度計算
    this.velocity.subVectors(target, this.position);
  }
}
