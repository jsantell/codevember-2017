import '../lib/configure';
import { Node, Model, BasicMaterial, Cube, Math as MMath } from '@jsantell/mini-webgl';
import MiniWebGLApp from '../MiniWebGLApp';

const ROWS = 10;
const SCALE = 0.4;

class Experiment extends MiniWebGLApp {
  init() {
    this.cubes = [];
    for (let i = 0; i < (ROWS/2); i++) {
      if (i === 0) {
        this.create(ROWS, 0, this.cubes);
      } else {
        //this.create(ROWS - (i * 2), i, this.cubes);
        //this.create(ROWS - (i * 2), -i, this.cubes);
        this.create(ROWS, i, this.cubes);
        this.create(ROWS, -i, this.cubes);
      }
    }
    this.cubes.forEach(cube => this.scene.add(cube));

    this.pivot = new Node();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 8);
    this.gl = this.scene.renderer.getContext();
    this.gl.enable(this.gl.BLEND);
    this.gl.blendEquation(this.gl.FUNC_ADD);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
  }

  create(size, y, array) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let x = j - Math.floor(size / 2) + Math.random() * 0.9;
        let z = i - Math.floor(size / 2) + Math.random() * 0.9;
        const cube = new Model(new Cube(), new BasicMaterial());
        cube.scale.set(SCALE, SCALE, SCALE);
        cube.position.set(x, y, z);
        cube.material.uniforms.color = new MMath.Vector4(
          1 - i / size, j / size, 0.5, 0.5
        );
        array.push(cube);
      }
    }
  }

  update(t, delta) {
    let rotate = (t * 0.0001) % (Math.PI * 2);
    for (let i = 0; i < this.cubes.length; i++) {
      const cube = this.cubes[i];
      const scale = (Math.sin((t * 0.001) + (i * 0.1)) / 2 + 0.5) * SCALE;
      cube.scale.set(scale, scale, scale);
      let r = Math.sin(i / this.cubes.length * t * 0.01) / 2 + 0.5;
      let g = Math.sin(i / this.cubes.length * t * 0.01 + 2) / 2 + 0.5;
      let b = Math.sin(i / this.cubes.length * t * 0.01 + 4) / 2 + 0.5;
      cube.material.uniforms.color.set(r, g, b);
      cube.scale.set(scale, scale, scale);
    }
    this.pivot.rotation.set(void 0, rotate, rotate);
  }

  render() {
    this.scene.render();
  }
}

export default new Experiment();
