export class GyroInput {
  constructor() {
    this.active = false;
    this.processing = false;

    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;

    this.acceleration = { x: 0, y: 0, z: 0 };

    this.position = { x: 0, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };

    this.accelerationConversion = 1;
    this.velocityConversion = 0.01;
  }

  async activateGyro() {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      // Handle iOS 13+ devices.
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            this.active = true;
            console.log("gyro active");
            return true;
          } else {
            console.error("Request to access the orientation was rejected");
            return false;
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices.
      this.active = true;
      return true;
    }
  }

  startProcessing() {
    if (this.active) {
      window.addEventListener(
        "deviceorientation",
        this.processOrientation.bind(this)
      );
      window.addEventListener(
        "devicemotion",
        this.processAcceleration.bind(this)
      );
      this.processing = true;
    }
  }

  stopProcessing() {
    window.removeEventListener("deviceorientation", this.processOrientation);
    window.removeEventListener("devicemotion", this.processAcceleration);
    this.processing = false;
  }

  processOrientation(event) {
    this.alpha = event.alpha;
    this.beta = event.beta;
    this.gamma = event.gamma;
  }

  processAcceleration(event) {
    this.acceleration.x = Math.round(event.acceleration.x);
    this.acceleration.y = Math.round(event.acceleration.y);
    this.acceleration.z = Math.round(event.acceleration.z);
  }

  updatePosition() {
    // console.log(alpha + " / " + beta + " / " + gamma + " / ");

    // Update velocity based on accelerometer data
    this.velocity.x += this.acceleration.x * this.accelerationConversion;
    this.velocity.y += this.acceleration.y * this.accelerationConversion;
    this.velocity.z += this.acceleration.z * this.accelerationConversion;
    // Update position based on velocity and orientation data
    this.position.x += this.acceleration.x * this.velocityConversion;
    this.position.y += this.acceleration.y * this.velocityConversion;
    this.position.z += this.acceleration.z * this.velocityConversion;
    // position.x += (Math.random() - 0.5) * 2;
    // position.y += (Math.random() - 0.5) * 2;
    // position.z += (Math.random() - 0.5) * 2;

    //   console.log(position.x + " / " + position.y + " / " + position.z + " / ");
    console.log(this.velocity.x);
  }

  resetPosition() {
    this.position = { x: 0, y: 0, z: 0 };
  }
}
