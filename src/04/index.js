import { Mesh, AdditiveBlending, ShaderMaterial, AmbientLight, DirectionalLight, DodecahedronGeometry, DoubleSide, Object3D } from 'three';
import { Tween, Easing, update as tweenUpdate } from 'tween';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';

const EASING = Easing.Sinusoidal.In;
const modulo = 20;
const frequency = 1000;
const animationSpeed = 3000;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x000000);

    this.light = new DirectionalLight(0xffffff);
    this.light.intensity = 0.2;
    this.aLight = new AmbientLight(0xffffff);
    this.aLight.intensity = 0.2;
    this.scene.add(this.aLight);
    this.light.position.set(5, 5, 0);
    this.light.target.position.set(0, 0, 0);
    this.scene.add(this.light);
    this.pivot = new Object3D();
    this.pivot.position.set(0, 0, 0);
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 2, 8);

    this.geometry = new DodecahedronGeometry(2, 2);
    this.material = new ShaderMaterial({
      transparent: true,
      side: DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 }
      },
      depthWrite: false,
    });
    for (let i = 0; i < this.geometry.vertices.length; i++) {
      const mod = Math.random() * 0.4;
      const v = this.geometry.vertices[i];
      v.set(v.x + mod * (Math.random()<0.5?-1:1), v.y + mod * (Math.random()<0.5?-1:1), v.z + mod * (Math.random()<0.5?-1:1));
    }
    this.geometry.verticesNeedUpdate = true;
    this.material.blending = AdditiveBlending;
    this.gem = new Mesh(this.geometry, this.material);
    this.scene.add(this.gem);
    this.composer = new WAGNER.Composer(this.renderer);
    this.bloomPass = new BloomPass({
      zoomBlurStrength: 0.8,//0.2,
      applyZoomBlur: true,
      blurAmount: 10,
    });
    this.lastModulo = 0;
  }

  update(t, delta) {
    if (!this.lastTrigger || t > this.lastTrigger + frequency) {
      const d = (this.lastModulo + 1) % modulo;
      for (let i = 0; i < this.geometry.vertices.length; i++) {
        const mod = Math.sin(t * 0.0001 + d) * 1.0;
        if (i % modulo === d) {
          new Tween(this.geometry.vertices[i]).to({
            x: mod * (Math.random()<0.5?-1:1) + this.geometry.vertices[i].x,
            y: mod * (Math.random()<0.5?-1:1) + this.geometry.vertices[i].y,
            z: mod * (Math.random()<0.5?-1:1) + this.geometry.vertices[i].z
          }, animationSpeed).easing(EASING).start();
        } 
      }
      this.lastTrigger = t;
      this.lastModulo = d;
    }
    this.pivot.rotation.y = t * 0.0001;
    this.pivot.rotation.z = t * 0.0001;
    this.material.uniforms.time.value = t * 0.001;
    this.gem.geometry.verticesNeedUpdate = true;
    tweenUpdate();
  }

  render() {
    this.renderer.clearColor();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.bloomPass);
    this.composer.toScreen();
    this.camera.lookAt(this.pivot.position);
    // this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
