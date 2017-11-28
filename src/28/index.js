import '../lib/configure';
import { Points, TextureLoader, PointLight, SphereBufferGeometry, DoubleSide, UniformsLib, MeshPhongMaterial, Vector3, Triangle, BoxGeometry, BufferGeometry, Color, AdditiveBlending, OctahedronGeometry, Geometry, BufferAttribute, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import OrbitControlsFn from 'three-orbit-controls';
const OrbitControls = OrbitControlsFn(window.THREE);

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

    this.geometry = new BufferGeometry();
    let pos = 0;
    const positions = new Float32Array(RINGS * POINTS_PER_RING * 3);
    for (let r = 0; r < RINGS; r++) {
      for (let p = 0; p < POINTS_PER_RING; p++) {
        const theta = p / POINTS_PER_RING * Math.PI * 2;
        positions[pos++] = Math.sin(theta) * RADIUS;
        positions[pos++] = Math.cos(theta) * RADIUS;
        positions[pos++] = -r * DISTANCE_BETWEEN_RINGS;
      }
    }
    this.geometry.addAttribute('position', new BufferAttribute(positions, 3));
    
    this.material = new ShaderMaterial({
      uniforms: {
        size: { value: SIZE },
        alpha: { value: ALPHA },
        time: { value: 0 },
        alphaMap: { value: null },
        dpr: { value: window.devicePixelRatio },
        maxDistance: { value: RINGS * DISTANCE_BETWEEN_RINGS },
        noiseMod: { value: NOISE_MOD },
        posDampen: { value: POS_DAMPEN },
      },
      transparent: true,
      depthWrite: false,
      vertexShader,
      fragmentShader,
      blending: AdditiveBlending,
    });

    this.textureLoader = new TextureLoader();
    this.textureLoader.load('../assets/particle.jpg', texture => {
      this.material.uniforms.alphaMap.value = texture;
    });

    this.points = new Points(this.geometry, this.material);
    this.scene.add(this.points);

    this.scene.add(this.camera);
    this.camera.position.set(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 1,
      applyZoomBlur: true,
      zoomBlurStrength: 0.5,
    });
  }

  update(t, delta) {
    this.material.uniforms.time.value = t * 0.001;
    this.camera.rotation.z -= 0.001;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
