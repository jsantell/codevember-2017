import '../lib/configure';
import { Math as M, MeshBasicMaterial, DirectionalLight, DoubleSide, UniformsLib, MeshPhongMaterial, Vector3, Triangle, BoxBufferGeometry, BufferGeometry, Color, AdditiveBlending, OctahedronGeometry, BufferAttribute, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import ExplodeModifier from '../lib/ExplodeModifier';
import { Tween, Easing, update as tweenUpdate } from 'tween';
import BarycentricMaterial from './BarycentricMaterial';

const EASING = Easing.Quadratic.In;
const COUNT = 19;
const MULTI_FLIP = COUNT;
const SCALE = 0.7;
const DISPLACEMENT = 1;
const ANIMATION_SPEED = 800;
const FLIP_RATE = 30;
const WIDTH = 4;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x101010);
    
    this.lastFlip = -Infinity;
    this.lastFlippedIndex = -1;
    this.flipAxis = 'x';
    this.flipDir = 1;

    const geometry = new BoxBufferGeometry(1, 1, 1);
    BarycentricMaterial.applyBarycentricCoordinates(geometry);

    const materials2 = new Array(6).fill(0).map((_, i) => {
      const c = (i / 6 * 180) + 40;
      return new BarycentricMaterial({
        width: WIDTH,
        color: new Color(0x000000),
        wireframeColor: new Color(`hsl(${c}, 100%, 50%)`),
      });
    });

    this.cubes = [];
    const half = COUNT % 2 === 0 ? (COUNT/2) - 0.5 : Math.floor(COUNT / 2);
    for (let i = 0; i < COUNT; i++) {
      for (let j = 0; j < COUNT; j++) {
        const mesh = new Mesh(geometry, materials2);
        mesh.position.x = ( i - half) * DISPLACEMENT;
        mesh.position.z = ( j - half) * DISPLACEMENT;
        mesh.scale.set(SCALE, SCALE, SCALE);
        this.cubes.push(mesh);
        this.scene.add(mesh);
      }
    }

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0.9, 5);
    this.camera.rotation.x = -1.05;
    this.camera.fov = 120;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 1,
      applyZoomBlur: true,
      zoomBlurStrength: 0.1,
    });
  }

  randomizeFlipValues() {
    this.lastFlipAxis = this.flipAxis;
    this.flipAxis = ['x', 'y', 'z'][Math.floor(Math.random() * 3)];
    this.flipDir = Math.random() > 0.5 ? 1 : -1;
  }

  update(t, delta) {
    // this.pivot.rotation.y = t * 0.0001;
    //this.material.uniforms.time.value = t * 0.001;

    this.camera.position.z = (9) - ((t * 0.001) % 1)
    tweenUpdate();

    if (t > this.lastFlip + FLIP_RATE) {
    for (let i = 0; i < MULTI_FLIP; i++) {
      const flipIndex = (this.lastFlippedIndex + 1) % (this.cubes.length);
      if (flipIndex === 0) {
        this.randomizeFlipValues();
      }

      const cube = this.cubes[flipIndex];
      if (!cube.animating) {
        //cube.animating = true;

        const flipAxis = this.flipAxis;
        const flipDir = this.flipDir;
        const startState = cube.rotation[flipAxis];
        const endState = cube.rotation[flipAxis] + Math.PI / 2 * flipDir;
        new Tween({ [flipAxis]: startState })
          .to({ [flipAxis]: endState }, ANIMATION_SPEED)
          .onUpdate(val => cube.rotation[flipAxis] = M.lerp(startState, endState, val))
          .onComplete(() => cube.animating = false)
          .easing(EASING)
          .start();

        this.lastFlip = t;
        this.lastFlippedIndex = flipIndex;
      }
    }
    }
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
