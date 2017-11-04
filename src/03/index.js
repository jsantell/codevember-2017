import { Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import Vine from './vine';

const scale = 60;
const size = 12;
const radius = 2;
const radiusSpread = 5;
const speed = 1;
const speedSpread = 10;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 6);

    this.vine = new Vine();
    this.scene.add(this.vine);

    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 3,
      applyZoomBlur: true,
      blurAmount: 50,
    });
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
  }

  render() {
    this.renderer.clearColor();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
    this.camera.lookAt(this.pivot.position);
    // this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
