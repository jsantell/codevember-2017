import '../lib/configure';
import { IcosahedronGeometry, Mesh, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';

const DISPLACEMENT = 0.5;
const POWER = 5.0;
const SCALE = 1.0;
class Experiment extends ThreeApp {
  init() {
    this.material = new ShaderMaterial({
      uniforms: {
        time: { value: performance.now() },
        displacement: { value: DISPLACEMENT },
        power: { value: POWER },
        scale: { value: SCALE },
      },
      fragmentShader,
      vertexShader,
    });
    this.geometry = new IcosahedronGeometry(2, 4);
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.camera.position.set(0, 0, 6);
  }

  update(t, delta) {
    this.material.uniforms.time.value = t * 0.001;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    super.onResize();
    this.material.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
  }
}

export default new Experiment();
