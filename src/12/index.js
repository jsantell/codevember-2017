import '../lib/configure';
import { Color, PlaneBufferGeometry, IcosahedronBufferGeometry, WireframeGeometry, BoxBufferGeometry, LineBasicMaterial, MeshBasicMaterial, LineSegments, SphereBufferGeometry, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import BarycentricMaterial from './BarycentricMaterial';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';

const PLANES = 15;
class Experiment extends ThreeApp {
  init() {
    this.planes = [];
    for (let i = 0; i < PLANES; i++) {
      const plane = new PlaneBufferGeometry(1, 1, 7, 7);
      BarycentricMaterial.applyBarycentricCoordinates(plane);
      const planeMaterial = new BarycentricMaterial({
        width: 2.0,
      });
      const planeMesh = new Mesh(plane, planeMaterial);
      planeMesh.position.z = -i * 0.5;
      let scale = 1 + (i + 1) * 0.2;
      planeMesh.scale.set(scale, scale, scale);
      this.scene.add(planeMesh);
      this.planes.push(planeMesh);
    }
    
    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 0.1);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 3,
    });
  }

  update(t, delta) {
    // this.pivot.rotation.y = t * 0.001;
    for (let i = 0; i < this.planes.length; i++) {
      const plane = this.planes[i];
      const lag = Math.PI * 2 * i / this.planes.length;
      let r = Math.sin(lag +  t * 0.005) / 2 + 0.5;
      let g = Math.sin(lag + t * 0.005 + 4) / 2 + 0.5;
      let b = Math.sin(lag + t * 0.005 + 2) / 2 + 0.5;
      plane.material.uniforms.wireframeColor.value = new Color(r, g, b);
      plane.rotation.z = t * 0.0001 + (lag/2);
      let scale = (Math.cos(lag + t * 0.001) /2 + 0.5) + (lag / 2)+ 1;
      plane.scale.set(scale, scale, scale);
    }
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
