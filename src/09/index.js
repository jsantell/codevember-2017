import { Vector3, Vector2, EventDispatcher, MeshBasicMaterial, Geometry, LineBasicMaterial, Line, SplineCurve, Object3D, Color, Mesh, BufferGeometry } from 'three';
import ThreeApp from '../ThreeApp';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import WAGNER from '@alex_toudic/wagner';
import VignettePass from '@alex_toudic/wagner/src/passes/vignette/VignettePass';

const CURVE_POINTS = 500;
const ITERATIONS = 9;
const BACKGROUND = new Color(0x222222);
const FOREGROUND = new Color(0xeeeeee);
const FREQUENCY = 100;

Object.assign(MeshLine.prototype, EventDispatcher.prototype);
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(BACKGROUND);
    this.verts = [];
    this.geometry = new Geometry();

    this.line = new MeshLine();

    this.updateGeometry();
    this.mesh = new Mesh(this.line.geometry, new MeshLineMaterial({
      color: new Color(0xeeeeee),
      lineWidth: 0.03,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
    }));
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
    this.pivot = new Object3D();
    this.pivot.position.set(0, 0, 0);
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);

    this.camera.position.set(0, 0, 0.9);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new VignettePass(1.0, 0.5);
    this.flipClip = 0;
    this.lastFlip = -Infinity;
  }

  flip() {
    if (this.flipCount++ % 2) {
      this.renderer.setClearColor(FOREGROUND);
      this.mesh.material.uniforms.color.value = BACKGROUND;
    } else {
      this.renderer.setClearColor(BACKGROUND);
      this.mesh.material.uniforms.color.value = FOREGROUND;
    }
    this.updateGeometry(Math.random() + 1.2);
  }

  updateGeometry(mod=1) {
    for (let i = 0; i < CURVE_POINTS; i++) {
      let vert = this.geometry.vertices[i];
      if (!vert) {
        vert = new Vector3();
        this.geometry.vertices.push(vert);
      }
      let val = (ITERATIONS * i / CURVE_POINTS * Math.PI * 2) + (Math.random() * mod);
      let scale = 1 - i / CURVE_POINTS;
      let x = Math.cos(val) * scale;
      let y = Math.sin(val) * scale;
      if (Math.floor(mod) % 2) {
        let tmp = x;
        x = y;
        y = tmp;
      }
      vert.set(x, y, i / CURVE_POINTS * scale);
    }
    this.line.setGeometry(this.geometry);
  }

  update(t, delta) {
    this.pivot.rotation.z = t * 0.00009;
    if (this.lastFlip + FREQUENCY < t) {
      this.flip();
      this.lastFlip = t;
    }
  }

  render() {
    this.renderer.clear();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
//    this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
