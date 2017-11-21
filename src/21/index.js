import '../lib/configure';
import { CircleBufferGeometry, Color, AdditiveBlending, PlaneGeometry, Mesh, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import BarycentricMaterial from './BarycentricMaterial';

const COUNT = 10;
class Experiment extends ThreeApp {
  init() {
    this.shapes = [];
    for (let i = 0; i < COUNT; i++) {
      const shape = new CircleBufferGeometry(1, 20);
      BarycentricMaterial.applyBarycentricCoordinates(shape);
      const mesh = new Mesh(shape, new BarycentricMaterial({
        width: 0.1,
        alpha: 0,
        wireframeColor: new Color().setHSL(i/COUNT, 0.8, 0.5),
        wireframeAlpha: 0.3,
      }));
      mesh.material.blending=  AdditiveBlending;
      mesh.position.z = i * 0.1;
      this.shapes.push(mesh);
      this.scene.add(mesh);
    }
    this.camera.position.set(0, 0, 2);
  }

  update(t, delta) {
    for (let i = 0; i < this.shapes.length; i++) {
      const circle = this.shapes[i];
      circle.rotation.z = t * 0.0001 * (i+1) + (i / this.shapes.length * 10);
      const scale = t * 0.0001 * (1 + ((i+1) / this.shapes.length * 0.4));
      circle.rotation.set(scale, scale, scale);
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
