import '../lib/configure';
import { Points, TextureLoader, PointLight, SphereBufferGeometry, DoubleSide, UniformsLib, MeshPhongMaterial, Vector3, Triangle, BoxGeometry, BufferGeometry, Color, AdditiveBlending, OctahedronGeometry, Geometry, BufferAttribute, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import { ARUtils } from 'three.ar.js';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import pointsVertexShader from './points-vert.glsl';
import pointsFragmentShader from './points-frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import OrbitControlsFn from 'three-orbit-controls';
const OrbitControls = OrbitControlsFn(window.THREE);

const NOISE_COLOR = 0xff3300;
const NOISE_THRESHOLD = 0.65;
const LIGHT_INTENSITY = 0.9;
const AMBIENT = 0.1;
const DIFFUSE = '../assets/earthmap1k.jpg';
const BUMP = '../assets/earthbump1k.jpg';
const BUMP_POWER = 0.05;

class Experiment extends ThreeApp {
  init() {
    new OrbitControls(this.camera);
    this.renderer.setClearColor(0x111111);

    this.light = new PointLight();
    this.scene.add(this.light);
    this.light.position.set(-40, 0, -3);

    this.geometry = new SphereBufferGeometry(2, 100, 100);
    this.material = new ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'], {
          lightIntensity: { value: LIGHT_INTENSITY },
          //alpha: { value: 0.5 },
          //color: { value: new Color(COLOR) },
          noiseColor: { value: new Color(NOISE_COLOR) },
          noiseThreshold: { value: NOISE_THRESHOLD },
          ambient: { value: AMBIENT },
          time: { value: 0 },
          diffuseMap: { value: null },
          bumpMap: { value: null },
          bumpPower: { value: BUMP_POWER },
        }
      ]),
      vertexShader,
      fragmentShader,
      lights: true,
      side: THREE.FrontSide,
      transparent: true,
    });
    this.textureLoader = new TextureLoader();
    this.textureLoader.load(DIFFUSE, texture => {
      this.material.uniforms.diffuseMap.value = texture;
    });
    this.textureLoader.load(BUMP, texture => {
      this.material.uniforms.bumpMap.value = texture;
    });
    this.textureLoader.load('../assets/particle.jpg', texture => {
      this.pointsMaterial.uniforms.alphaMap.value = texture;
    });

    this.mesh = new Mesh(this.geometry, this.material);

    this.pointsMaterial = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(NOISE_COLOR) },
        noiseThreshold: { value: NOISE_THRESHOLD },
        time: { value: 0 },
        alphaMap: { value: null },
      },
      transparent: true,
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
    });
    const geometry = new SphereBufferGeometry(2, 100, 100);
    this.points = new Points(geometry, this.pointsMaterial);
    this.points.scale.set(1.01, 1.01, 1.01);
    this.scene.add(this.points);
    this.scene.add(this.mesh);

    this.lightPivot = new Object3D();
    this.cameraPivot = new Object3D();
    this.lightPivot.add(this.light);
    this.scene.add(this.lightPivot);
    this.scene.add(this.cameraPivot);
    this.camera.position.set(0, 0, 5);
    this.cameraPivot.add(this.camera);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 5,
      applyZoomBlur: true,
      zoomBlurStrength: 2,
    });
  }

  update(t, delta) {
    this.mesh.rotation.y = Math.PI * 1.2 + t * 0.00005;
    this.points.rotation.y = this.mesh.rotation.y;
    this.material.uniforms.time.value = t * 0.001;
    this.pointsMaterial.uniforms.time.value = t * 0.001;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
