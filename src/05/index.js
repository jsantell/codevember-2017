import '../lib/configure';
import { TextureLoader, Vector3, Mesh, Color, Points, AdditiveBlending, ShaderMaterial, AmbientLight, DirectionalLight, DodecahedronGeometry, DoubleSide, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';

const LIMIT = 15;
const size = 20;
const randomDir = () => Math.random() < 0.5 ? -1 : 1;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x000000);

    this.pivot = new Object3D();
    this.pivot.position.set(0, 0, 0);
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 2, 40);

    this.geometry = new DodecahedronGeometry(3, 2);
    this.material = new ShaderMaterial({
      transparent: true,
      fragmentShader,
      vertexShader,
      uniforms: {
        color: { value: new Color(0xddddff) },
        time: { value: 0 },
        size: { value: size },
        alphaMap: { value: 0 },
      },
      depthWrite: false,
    });
    this.material.blending = AdditiveBlending;
    this.textureLoader = new TextureLoader();
    this.textureLoader.load('particle.jpg', texture => {
      this.material.uniforms.alphaMap.value = texture;
    });
    this.points = new Points(this.geometry, this.material);
    for (let i = 0; i < this.geometry.vertices.length; i++) {
      const mod = Math.random() * 0.4;
      const v = this.geometry.vertices[i];
      let value = i/this.geometry.vertices.length * Math.random();
      v.velocity = new Vector3(Math.random()*randomDir(), Math.random()*randomDir(), Math.random()*randomDir());
      v.velocity.x *= 0.02;
      v.velocity.y *= 0.02;
      v.velocity.z *= 0.02;
    }
    this.scene.add(this.points);
    this.composer = new WAGNER.Composer(this.renderer);
    this.bloomPass = new BloomPass({
      zoomBlurStrength: 0.8,//0.2,
      applyZoomBlur: true,
      blurAmount: 100,
    });
  }

  update(t, delta) {
    for (let i = 0; i < this.geometry.vertices.length; i++) {
      const vertex = this.geometry.vertices[i];
      if (vertex.length() > LIMIT) {
        vertex.velocity.x *= Math.random() * -2;
        vertex.velocity.y *= Math.random() * -2;
        vertex.velocity.z *= Math.random() * -2;
      }
      vertex.x += delta * 0.1 * vertex.velocity.x + (Math.sin(t *i* 0.001 + vertex.velocity.x) *0.01) 
      vertex.y += delta * 0.1 * vertex.velocity.y + (Math.cos(t *i*0.001 + vertex.velocity.y) * 0.01) 
      vertex.z += delta * 0.1 * vertex.velocity.z + (Math.sin(t *i*0.001 + vertex.velocity.z) *0.01)
    }
    this.pivot.rotation.y = t * 0.0001;
    this.pivot.rotation.z = t * 0.0001;
    this.geometry.verticesNeedUpdate = true;
    this.material.uniforms.time.value = t * 0.001;
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
