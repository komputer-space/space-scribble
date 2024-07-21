import * as THREE from "three";
import { ThreeExporter } from "./ThreeExporter";
import { InfoLayer } from "./InfoLayer";
import { Scribble } from "./Scribble";
import { GyroInput } from "./GyroInput";

export class SpaceScribble {
  constructor(canvas) {
    this.transparencyMode = false;
    this.idle = false;
    this.viewMode = false;

    this.exporter = new ThreeExporter();

    this.infoLayer = new InfoLayer();

    // -------

    this.canvas = canvas;

    this.active = false;
    this.drawing = false;

    this.setupScene();

    this.currentScribble = new Scribble();
    this.scene.add(this.currentScribble.object);

    this.colorInterface = document.getElementById("color-interface");

    this.colors = [
      0x8a2be2, 0x0000ff, 0x2f4f4f, 0xdc143c, 0xffd700, 0xadff2f, 0xadd8e6,
      0x3cb371, 0x4682b4,
    ];
    this.currentColor = 0xdc143c;
    this.setBackgroundColor(this.currentColor);

    this.gyroInput = new GyroInput();
    this.gyroButton = document.getElementById("gyro-button");
    this.gyroButton.onclick = () => this.setupGyroInput();

    this.startDrawTimeout;

    this.drawPosition = { x: 0, y: 0, z: 0 };

    this.colorInterface.onclick = () => this.processTap();
    this.colorInterface.ontouchstart = () => this.processTouchStart();
    this.colorInterface.ontouchend = () => this.processTouchEnd();
    document.addEventListener("keydown", (e) => this.processKeyInput(e));
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0x000000);
    this.scene.add(ambientLight);
  }

  // --- CORE METHODS

  update() {
    if (!this.freeze) {
    }
    if (this.drawing) {
      this.gyroInput.updatePosition();
      this.updateScribblePosition();
      this.currentScribble.addPoint(this.drawPosition);
    } else {
      if (this.viewMode && this.currentScribble) {
        this.currentScribble.updateRotation();
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setViewMode(value) {
    this.viewMode = value;
    this.active = !value;
    if (this.active) {
      this.setBackgroundColor(this.currentColor);
      this.setScribbleColor(0xffffff);
    } else {
      this.setBackgroundColor(0x000000);
      this.setScribbleColor(this.currentColor);
    }
  }

  setTransparencyMode(value) {
    this.transparencyMode = value;
  }

  setIdleMode(value) {
    this.idle = value;
  }

  processKeyInput(e) {}

  // --- INPUTS

  setupGyroInput() {
    console.log("activating gyro");
    const gyroActive = this.gyroInput.activateGyro();
    if (gyroActive) this.active = true;
  }

  processTap() {
    console.log("tap");
    if (this.active) {
      const currentColorIndex = this.colors.indexOf(this.currentColor);
      this.currentColor = this.colors[currentColorIndex + 1];
      this.setBackgroundColor(this.currentColor);
      // this.showRender(false);
    }
  }

  processTouchStart() {
    console.log("down");
    if (this.active) {
      this.startDrawTimeout = setTimeout(() => {
        console.log("drawing");
        this.drawing = true;
        this.newScribble();
        this.gyroInput.resetPosition();
        this.gyroInput.startProcessing();
        // this.showRender(true);
        this.setBackgroundColor(0x000000);
        this.setScribbleColor(this.currentColor);
        // this.showRender(true);
      }, 300);
    }
  }

  processTouchEnd() {
    console.log("up");
    clearTimeout(this.startDrawTimeout);
    if (this.drawing) {
      console.log("end drawing");
      this.gyroInput.stopProcessing();
      this.drawing = false;
      this.setBackgroundColor(this.currentColor);
      this.setScribbleColor(0xffffff);
    }
  }

  // --- CUSTOM METHODS

  updateScribblePosition() {
    this.drawPosition = this.gyroInput.position;
    // this.drawPosition.x += (Math.random() - 0.5) * 0.5;
    // this.drawPosition.y += (Math.random() - 0.5) * 0.5;
    // this.drawPosition.z += (Math.random() - 0.5) * 0.5;
  }

  newScribble() {
    console.log("new");
    this.scene.remove(this.currentScribble.object);
    this.currentScribble = new Scribble();
    this.scene.add(this.currentScribble.object);
  }

  setBackgroundColor(color) {
    let colorString = color.toString(16);
    console.log(colorString);
    // colorInterface.style.backgroundColor = "#" + color.toString(16);
    this.renderer.setClearColor(color);
  }

  setScribbleColor(color) {
    this.currentScribble.setColor(color);
  }

  showDesktopInfo() {
    this.infoLayer.setActive(true);
    this.infoLayer.showInfo("please use touch device");
  }

  // --- FILE EXPORTS

  exportScene() {
    this.exporter.exportGlTF(this.scene);
  }

  // --- FILE IMPORTS

  importGlTF(url) {}

  importImage(url) {}
}
