import { Mesh, AmbientLight, MeshStandardMaterial, Object3D, BoxGeometry, Color, PointLight } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import GlitchPass from './GlitchPass';

const ROWS = 5;
const SCALE = 0.3;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x222222);
    for (let i = 0; i < ROWS; i++) { // x
      for (let j = 0; j < ROWS; j++) { // y
        for (let k = 0; k < ROWS; k++) { // z
          const cube = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
          cube.position.set(
            i - Math.floor(ROWS / 2),
            j - Math.floor(ROWS / 2),
            k - Math.floor(ROWS / 2)
          );
          //cube.material.color = new Color(i/ROWS,j/ROWS,1.0 - k/ROWS);
          cube.scale.set(SCALE, SCALE, SCALE);
          this.scene.add(cube);
        }
      }
    }

    this.light = new AmbientLight();
    this.scene.add(this.light);
    this.pointLight = new PointLight(0xffffff, 1, 10);
    this.pointLight.position.x  = -2;
    this.pointLightPivot = new Object3D();
    this.pointLightPivot.add(this.pointLight);
    this.scene.add(this.pointLightPivot);
    this.pivot = new Object3D();
    this.scene.add(this.pivot);
    this.pivot.add(this.camera);
    this.camera.position.set(0, 0, 5);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new GlitchPass();
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
    this.pointLightPivot.rotation.z = t * 0.001;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
