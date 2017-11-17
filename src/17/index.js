import '../lib/configure';
import { TextureLoader, AmbientLight, DirectionalLight, Math as M, MeshStandardMaterial, DoubleSide, MeshPhongMaterial, Vector3, Triangle, BoxBufferGeometry, Color, AdditiveBlending, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import { Tween, Easing, update as tweenUpdate } from 'tween';

const EASING = Easing.Quadratic.Out;
const ZOOM_EASING = Easing.Quadratic.Out;
const COUNT = 15;
const SCALE = 0.9;
const DISPLACEMENT = 1;
const ANIMATION_SPEED = 1200;
const FLIP_RATE = 10;
const CYCLE_SPEED = 2000;
const CAMERA_MAX = 10;
const map = (val, inMin, inMax, outMin, outMax) =>
  outMin + (outMax - outMin) * (val - inMin) / (inMax - inMin);

const COLOR_A = 0x111111;
const COLOR_B = 0xeeeeee;

class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x000000);

    this.lastFlip = -Infinity;

    this.dLight = new DirectionalLight();
    this.dLight.position.set(0, 0, 10);


    const geometry = new BoxBufferGeometry(1, 1, 1);
    this.materials = new Array(6).fill(0).map((_, i) => {
      return new MeshStandardMaterial({
        color: COLOR_A,
      });
    });

    this.cubes = [];
    const half = COUNT % 2 === 0 ? (COUNT/2) - 0.5 : Math.floor(COUNT / 2);
    for (let i = 0; i < COUNT; i++) {
      for (let j = 0; j < COUNT; j++) {
        const mesh = new Mesh(geometry, this.materials);
        mesh.position.x = ( i - half) * DISPLACEMENT;
        mesh.position.y = ( j - half) * DISPLACEMENT;
        mesh.scale.set(SCALE, SCALE, SCALE);
        this.cubes.push(mesh);
        this.scene.add(mesh);
      }
    }

    this.pivot = new Object3D();
    this.pivot.add(this.dLight);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, CAMERA_MAX);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 0.5,
    });

    // this.startCycle();
  }

  /**
   * Ended up not using this
   */
  startCycle() {
    new Tween({}).to({}, CYCLE_SPEED)
      .onUpdate(val => {
        //this.camera.position.z = CAMERA_MAX - (val * (CAMERA_MAX - 1));
      })
      .onComplete(() => {
        const IS_BG_A = this.renderer.getClearColor().getHex() === COLOR_A;
        this.renderer.setClearColor(IS_BG_A ? COLOR_B : COLOR_A);
        this.materials.forEach(m => {
          m.color = new Color(IS_BG_A ? COLOR_A : COLOR_B),
          m.needsUpdate = true;
        });
        this.camera.position.z = CAMERA_MAX;
        //this.camera.rotation.z = Math.random() * Math.PI * 2;
        // onComplete is not called at the end of each
        // loop using tween's, repeat, so call startCycle
        // ourselves
        this.startCycle();
      })
      .easing(ZOOM_EASING)
      .start()
  }

  randomizeFlipValues() {
    this.lastFlipAxis = this.flipAxis;
    this.flipAxis = ['x', 'y', 'z'][Math.floor(Math.random() * 3)];
    this.flipDir = Math.random() > 0.5 ? 1 : -1;
  }

  update(t, delta) {
    this.pivot.rotation.y = Math.sin(t * 0.0001) * 0.1;
    //this.material.uniforms.time.value = t * 0.001;

    tweenUpdate();

    if (t > this.lastFlip + FLIP_RATE) {
      const cube = this.cubes[Math.floor(Math.random()*COUNT*COUNT)];
      if (!cube.animating) {
        cube.animating = true;

        this.randomizeFlipValues();

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
