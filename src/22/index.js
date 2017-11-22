import '../lib/configure';
import CanvasApp from '../CanvasApp';
import njs from 'noisejs';
const Noise = njs.Noise;

const POINTS = 20;
class Experiment extends CanvasApp {
  init() {

    this.values = [];
    this.noise = new Noise(Math.random());
    this.ctx.fillStyle = '#eeeeee';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.filter = 'blur(2px)';
    this.ctx.globalCompositeOperation = 'overlay';
  }

  update(t, delta) {
    this.ctx.strokeStyle = `hsl(${((t*0.001)+0)%360}, 95%, 50%)`;
    //this.ctx.strokeStyle = 'hsl(180, 80%, 50%)';
    //console.log(`hsl(${(t*0.001)%360}, 80%, 50%)`, this.ctx.strokeStyle);
    const change = t * 0.00002;
    const mod = 2;
    for (let i = 0; i < 8; i++) {
      // const noise = this.noise.perlin2(change + 10*i, change + 4*i);
      const noise = this.noise.perlin2(5 * change + (i/8), change + (i) * 2);
      this.values[i] = (noise * 0.5 + 0.5) * (i%2 ? window.innerHeight * 2: window.innerWidth * 2) -
                       (i%2 ? window.innerHeight / 2 : window.innerWidth / 2);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.values[0], this.values[1]);
    this.ctx.bezierCurveTo(
      this.values[6], this.values[7],
      this.values[4], this.values[5],
      this.values[2], this.values[3],
    );
    this.ctx.stroke();
  }
}

export default new Experiment();
