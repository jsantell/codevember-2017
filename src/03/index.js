import { Fog, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import VignettePass from '@alex_toudic/wagner/src/passes/vignette/VignettePass';
import Vine from './vine';

const VINE_COUNT = 100;
const VINE_RANGE = 30;
const frequency = 1000;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x220022);

    this.scene.fog = new Fog(0x440044, 1, 50);
    this.pivot = new Object3D();
    this.pivot.position.set(0, 2, 0);
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 2, 30);

    this.vines = [];
    this.vineGroup = new Object3D();
    this.vineGroup.position.y = 16;
    this.scene.add(this.vineGroup);
    for (let i = 0; i < VINE_COUNT; i++) {
      const vine = new Vine();
      vine.random = Math.random() * 0.5;
      vine.x = Math.random() < 0.5 ? -1 : 1;
      vine.y = Math.random() < 0.5 ? -1 : 1;
      vine.z = Math.random() < 0.5 ? -1 : 1;
      vine.position.set((Math.random() * VINE_RANGE) - (VINE_RANGE/2),
                         0,
                         (Math.random() * VINE_RANGE) - (VINE_RANGE/2));
      vine.rotation.x = Math.PI;
      this.vines.push(vine);
      this.vineGroup.add(vine);
    }

    this.composer = new WAGNER.Composer(this.renderer);
    this.bloomPass = new BloomPass({
      zoomBlurStrength: 0.01,
      applyZoomBlur: false,
      blurAmount: 1,
    });
    this.vignettePass = new VignettePass(1.1, 1.2);
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.00001;
    for (let vine of this.vines) {
      const bones = vine.mesh.skeleton.bones;
      const SCALE = 1;
      let axis = 0;
      for ( var i = 0; i < bones.length; i ++ ) {
        let scale = SCALE * (bones.length - 1 - i) / bones.length;
        scale += (Math.cos(vine.random * i * t * 0.001) * 0.01);
        //+ ((1 + Math.sin(vine.random * t * 0.0001)) * 0.1);
        //bones[i].rotation.z = Math.sin(t* 0.0001) * 0.01 * vine.random * i * (vine.random < 0.5 ? -1 : 1);
        let rotationAxis = axis === 0 ? 'x' : axis === 1 ? 'z' : 'y';
        let dir = vine[rotationAxis];
        bones[i].rotation[rotationAxis] = (vine.random * 0.01 *dir) + Math.sin(t* 0.0005 *vine.random+ (vine.random * 3.0)) * dir * (1 + vine.random);///0.5* vine.random * dir * 1;
        bones[i].scale.set(scale,scale,scale);
        axis = ( axis + 1 ) % 2;
      }
    }
  }

  render() {
    this.renderer.clearColor();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.bloomPass);
    this.composer.pass(this.vignettePass);
    this.composer.toScreen();
    this.camera.lookAt(this.pivot.position);
    // this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
