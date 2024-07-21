import * as THREE from "three";

export class Scribble {
  MAX_POINTS = 500;
  drawCount = 0;

  constructor() {
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    this.material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const positions = new Float32Array(this.MAX_POINTS * 3); // 3 vertices per point
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    this.drawCount = 2; // draw the first 2 points, only
    geometry.setDrawRange(0, this.drawCount);

    const line = new THREE.Line(geometry, this.material);
    this.object = line;
  }

  addPoint(point) {
    if (this.drawCount >= this.MAX_POINTS) return;

    const positions = this.object.geometry.attributes.position.array;
    let index = this.drawCount * 3;

    positions[index++] = point.x;
    positions[index++] = point.y;
    positions[index++] = point.z;

    this.object.geometry.setDrawRange(0, this.drawCount);

    this.object.geometry.attributes.position.needsUpdate = true;
    this.drawCount++;
    // this.drawCount = (this.drawCount + 1) % this.MAX_POINTS;
  }

  updateRotation() {
    this.object.rotation.x += 0.01;
    this.object.rotation.y += 0.01;
  }

  setColor(color) {
    this.material.color.setHex(color);
  }
}
