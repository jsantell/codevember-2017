import '../lib/configure';
import { Vector3, Color, TextureLoader, AdditiveBlending, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import OrbitControlsFn from 'three-orbit-controls';
const OrbitControls = OrbitControlsFn(window.THREE);
import ParticleSystem, { DEFAULTS as ParticleDefaults } from './ParticleSystem';

const COUNT = 100;
class Experiment extends ThreeApp {
  init() {
    //new OrbitControls(this.camera);
    this.renderer.setClearColor(0x111111);
    this.pSystem = new ParticleSystem(this.renderer, {
      count: COUNT,
    });
    this.textureLoader = new TextureLoader();
    this.textureLoader.load('../assets/particle.jpg', texture => {
      this.pSystem.alphaMap = texture;
      this.pSystem.needsUpdate=  true;
    });

    this.onChange = this.onChange.bind(this);
    this.scene.add(this.pSystem);

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 6);

    this.gui = new dat.GUI();
    this.config = {
      count: ParticleDefaults.count,
      lifetime: ParticleDefaults.lifetime,
      startSize: ParticleDefaults.startSize,
      endSize: ParticleDefaults.endSize,
      startColor: `#${new Color(1.0, 0.0, 0.0).getHexString()}`,
      endColor: `#${new Color(0.0, 0.0, 1.0).getHexString()}`,
      startAlpha: ParticleDefaults.startAlpha,
      endAlpha: ParticleDefaults.endAlpha,
      startPosition_x: ParticleDefaults.startPosition.x,
      startPosition_y: ParticleDefaults.startPosition.y,
      startPosition_z: ParticleDefaults.startPosition.z,
      startPositionSpread_x: ParticleDefaults.startPositionSpread.x,
      startPositionSpread_y: ParticleDefaults.startPositionSpread.y,
      startPositionSpread_z: ParticleDefaults.startPositionSpread.z,
      startVelocity_x: ParticleDefaults.startVelocity.x,
      startVelocity_y: ParticleDefaults.startVelocity.y,
      startVelocity_z: ParticleDefaults.startVelocity.z,
      startVelocitySpread_x: ParticleDefaults.startVelocitySpread.x,
      startVelocitySpread_y: ParticleDefaults.startVelocitySpread.y,
      startVelocitySpread_z: ParticleDefaults.startVelocitySpread.z,
      endVelocity_x: ParticleDefaults.endVelocity.x,
      endVelocity_y: ParticleDefaults.endVelocity.y,
      endVelocity_z: ParticleDefaults.endVelocity.z,
    };
    Object.keys(this.config).forEach(key => {
      if (/color/i.test(key)) {
        this.gui.addColor(this.config, key).onChange(this.onChange);
      } else if (/velocity/i.test(key)) {
        // skip for now, do after so we can use folders
      } else if (/position/i.test(key)) {
        // skip for now, do after so we can use folders
      } else {
        this.gui.add(this.config, key).onChange(this.onChange);
      }
    });
    const startPositionFolder = this.gui.addFolder('startPosition');
    startPositionFolder.add(this.config, 'startPosition_x').onChange(this.onChange);
    startPositionFolder.add(this.config, 'startPosition_y').onChange(this.onChange);
    startPositionFolder.add(this.config, 'startPosition_z').onChange(this.onChange);
    const startPositionSpreadFolder = this.gui.addFolder('startPositionSpread');
    startPositionSpreadFolder.add(this.config, 'startPositionSpread_x').onChange(this.onChange);
    startPositionSpreadFolder.add(this.config, 'startPositionSpread_y').onChange(this.onChange);
    startPositionSpreadFolder.add(this.config, 'startPositionSpread_z').onChange(this.onChange);
    const startVelocityFolder = this.gui.addFolder('startVelocity');
    startVelocityFolder.add(this.config, 'startVelocity_x').onChange(this.onChange);
    startVelocityFolder.add(this.config, 'startVelocity_y').onChange(this.onChange);
    startVelocityFolder.add(this.config, 'startVelocity_z').onChange(this.onChange);
    const startVelocitySpreadFolder = this.gui.addFolder('startVelocitySpread');
    startVelocitySpreadFolder.add(this.config, 'startVelocitySpread_x').onChange(this.onChange);
    startVelocitySpreadFolder.add(this.config, 'startVelocitySpread_y').onChange(this.onChange);
    startVelocitySpreadFolder.add(this.config, 'startVelocitySpread_z').onChange(this.onChange);
    const endVelocityFolder = this.gui.addFolder('endVelocity');
    endVelocityFolder.add(this.config, 'endVelocity_x').onChange(this.onChange);
    endVelocityFolder.add(this.config, 'endVelocity_y').onChange(this.onChange);
    endVelocityFolder.add(this.config, 'endVelocity_z').onChange(this.onChange);

    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 3,
      applyZoomBlur: true,
      blurAmount: 50,
    });
  }

  onChange() {
    for (let key of Object.keys(this.config)) {
      const value = this.config[key];
      if (/velocity/i.test(key)) {
        const [prop, axis] = key.split('_');
        this.pSystem[prop][axis] = value;
      } else if (/position/i.test(key)) {
        const [prop, axis] = key.split('_');
        this.pSystem[prop][axis] = value;
      } else if (/color/i.test(key)) {
        this.pSystem[key] = new Color(value);
      } else {
        this.pSystem[key] = value;
      }
    }
    this.pSystem.needsUpdate = true;
  }

  update(t, delta) {
    // this.pivot.rotation.y = t * 0.0001;
  }

  render(t, delta) {
    this.renderer.clearColor();
    this.pSystem.update(t, delta);
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    // this.composer.pass(this.pass);
    this.composer.toScreen();
    this.camera.lookAt(this.pivot.position);
    // this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
