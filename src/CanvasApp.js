export default class App {
  constructor() {
    this.domElement = document.createElement('canvas');
    this.ctx = this.domElement.getContext('2d');
    this.domElement.width = window.innerWidth;
    this.domElement.height = window.innerHeight;
    document.body.appendChild(this.domElement);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.init();

    this.lastTick = 0;
    this.onTick = this.onTick.bind(this);
    requestAnimationFrame(this.onTick);
  }

  onTick() {
    const t = performance.now();
    const delta = performance.now() - this.lastTick;
    this.update(t, delta);
    this.lastTick = t;
    requestAnimationFrame(this.onTick);
  }

  onResize() {
    this.domElement.width = window.innerWidth;
    this.domElement.height = window.innerHeight;
  }
}
