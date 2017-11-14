import '../lib/configure';
import { Color, AdditiveBlending, TetrahedronBufferGeometry, OctahedronBufferGeometry, WireframeGeometry, BoxBufferGeometry, LineBasicMaterial, MeshBasicMaterial, LineSegments, SphereBufferGeometry, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import BarycentricMaterial from './BarycentricMaterial';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import GodRayPass from '@alex_toudic/wagner/src/passes/godray/godraypass';

const COUNT = 40;
const SCALE = 0.6;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x222222);
    this.objects = [];
    for (let i = 0; i < COUNT; i++) {
      const rot = i/COUNT * Math.PI * 2;
      const obj = new OctahedronBufferGeometry(1, 0);
      //const obj = new TetrahedronBufferGeometry(1, 0);
      BarycentricMaterial.applyBarycentricCoordinates(obj);
      const material = new BarycentricMaterial({
        width: 2.0,
      });
      const mesh = new Mesh(obj, material);
      material.blending = AdditiveBlending;
      const pivot = new Object3D();
      pivot.add(mesh);
      pivot.rotation.z = rot;
      mesh.position.y = 2;
      mesh.scale.set(SCALE, SCALE, SCALE);
      this.scene.add(pivot);
      this.objects.push(mesh);
    }

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 6);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 1,
    });
    this.pass = new GodRayPass({});
    this.pass.params.blurAmount = 0.0;
    this.pass.params.fDensity = 0.12;
    this.pass.params.fExposure = 0.2;
    this.pass.params.fWeight = 0.8;
  }

  update(t, delta) {
    const offsetBoost = ((Math.sin(t * 0.00001) * 0.5 + 0.5) * COUNT - 1) + 1;
    for (let i = 0; i < COUNT; i++) {
      const offset = i / COUNT * Math.PI * 2 * (1 + 6 * Math.sin((t * 0.0001)-Math.PI/2)*0.5+0.5);
      const object = this.objects[i];
      const time = offset + t * 0.001;
      //object.position.y = Math.sin((offset ) + t * 0.001) + 1.2;
      const val = Math.sin(time) * 0.5 + 0.5;
      object.rotation.y = time % Math.PI * 2;
      //object.rotation.y = Math.PI * 2 * val;
      object.scale.y = (val * SCALE * 2) + SCALE;
      object.scale.z = (val * SCALE * 2) + SCALE;
      object.rotation.y = time % Math.PI * 2;
    }
    //this.pivot.rotation.y = t * 0.001;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
