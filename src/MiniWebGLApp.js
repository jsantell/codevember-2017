import { Camera , Scene } from '@jsantell/mini-webgl';

export default class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.scene = new Scene(this.canvas);
    this.camera = new Camera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.scene.useCamera(this.camera);
    document.body.appendChild(this.canvas);

    this.updateSize = this.updateSize.bind(this);
    this.onTick = this.onTick.bind(this);

    this.init();
    this.lastTick = 0;
    this.updateSize();
    window.addEventListener('resize', this.updateSize);
    requestAnimationFrame(this.onTick);
  }

  onTick() {
    const t = performance.now();
    const delta = performance.now() - this.lastTick;
    this.update(t, delta);
    this.render(t, delta);
    this.lastTick = t;
    requestAnimationFrame(this.onTick);
  }

  updateSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.scene.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
