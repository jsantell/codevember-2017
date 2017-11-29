import '../lib/configure';
import { IcosahedronBufferGeometry, DoubleSide, Color, AdditiveBlending, Mesh, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import OrbitControlsFn from 'three-orbit-controls';
const OrbitControls = OrbitControlsFn(window.THREE);
import BarycentricMaterial from './BarycentricMaterial';

const SIZE = 160;
const RINGS = 60;
const POINTS_PER_RING = 70;
const RADIUS = 0.5;
const DISTANCE_BETWEEN_RINGS = 0.15;
const ALPHA = 0.5;
const NOISE_MOD = 0.015;
const POS_DAMPEN = 1.5;

class Experiment extends ThreeApp {
  init() {
    new OrbitControls(this.camera);
    this.renderer.setClearColor(0x111111);

    this.geometry = new IcosahedronBufferGeometry(1, 4);
    BarycentricMaterial.applyBarycentricCoordinates(this.geometry);
    this.mesh = new Mesh(this.geometry, new BarycentricMaterial({
      width: 1,
    }));
    this.material = this.mesh.material;
    this.scene.add(this.mesh);

    this.scene.add(this.camera);
    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 2.45);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 3,
    });
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
    this.material.uniforms.time.value = t * 0.00005;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
