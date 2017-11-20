import '../lib/configure';
import { MeshLambertMaterial, PlaneGeometry, TextureLoader, AmbientLight, SpotLight, Math as M, MeshToonMaterial, DoubleSide, MeshPhongMaterial, Vector3, Triangle, BoxBufferGeometry, Color, AdditiveBlending, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import { Tween, Easing, update as tweenUpdate } from 'tween';
import OrbitControlsFn from 'three-orbit-controls';
const OrbitControls = OrbitControlsFn(window.THREE);

const EASING = Easing.Cubic.In;
const H_COUNT = 5;
const WRINKLE_RATE = 100;
const ANIMATION_SPEED = 1000;
const CAMERA_MAX = 5;
const PAPER_ENERGY = 0.4;
const map = (val, inMin, inMax, outMin, outMax) =>
  outMin + (outMax - outMin) * (val - inMin) / (inMax - inMin);

const COLOR_A = 0x990000;

class Experiment extends ThreeApp {
  init() {
    new OrbitControls(this.camera);
    this.renderer.setClearColor(0x333333);

    this.lastWrinkle = -Infinity;

    this.dLight = new SpotLight();
    this.dLight.position.set(0, 0, 10);

    this.plane = new Mesh(new PlaneGeometry(10,10, 30, 30), new MeshLambertMaterial({
      color: 0xF3CF9D,
    }));
    // this.plane.material.flatShading = true;
    this.scene.add(this.plane);

    const geometry = new BoxBufferGeometry(1, 1, 1);
    const colors = [
      0x57708C,
      0x9ED4D9, //light blue
      0xFF8775, //salomn
      0x57708C,
      0x9ED4D9, //light blue
      0xFF8775 //salomn
    ];
    this.material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        rotation: { value: 0 },
        alphaMap: { value: null }
      },
      vertexShader,
      fragmentShader,
    });
    this.textureLoader = new TextureLoader();
    this.textureLoader.load('../assets/grid.jpg', texture => {
      this.material.uniforms.alphaMap.value = texture;
    });

    this.cubes = [];
    for (let i = 0; i < H_COUNT; i++) {
      const cube = new Mesh(geometry, this.material);
      let scale = 0.6 - (Math.floor((i+1)/2)) * 0.1;
      cube.position.set(Math.floor((i+1)/2) * ((i+1)%2 ? -1 : 1), 0, 0.6);
      cube.rotation.y = Math.PI / 4;
      cube.scale.set(scale, scale, scale);
      this.cubes.push(cube);
      this.scene.add(cube);

      let clone = cube.clone();
      clone.position.y = 1.5;
      clone.scale.set(scale*0.9, scale*0.9, scale*0.9);
      this.cubes.push(clone);
      this.scene.add(clone);

      clone = cube.clone();
      clone.position.y = -1.5;
      clone.scale.set(scale*0.9, scale*0.9, scale*0.9);
      this.cubes.push(clone);
      this.scene.add(clone);

      clone = cube.clone();
      clone.position.y = -3;
      clone.scale.set(scale*0.8, scale*0.8, scale*0.8);
      this.cubes.push(clone);
      this.scene.add(clone);

      clone = cube.clone();
      clone.scale.set(scale*0.8, scale*0.8, scale*0.8);
      clone.position.y = 3;
      this.cubes.push(clone);
      this.scene.add(clone);
    }
    this.pivot = new Object3D();
    this.pivot.add(this.dLight);
    this.scene.add(this.pivot);
    //this.pivot.rotation.y = 1.1;
    this.camera.position.set(0, 0, CAMERA_MAX);

    for (let i = 0; i < this.cubes.length; i++) {
      const half = Math.floor(H_COUNT);
      const diff = Math.abs(this.cubes[i].position.x);
      const y = Math.abs(this.cubes[i].position.y);
      this.bounce(i, diff * ANIMATION_SPEED / half);
    }

  }

  bounce(index, delay) {
    const cube = this.cubes[index];
    const startRot = cube.rotation.x;
    const startPos = cube.position.y;
    const startPosX = cube.position.x;
    const startRotY = cube.rotation.y;
    new Tween(cube.rotation).to({}, ANIMATION_SPEED)
      .onUpdate(val => {
        cube.rotation.x = startRot + val * Math.PI;
        cube.position.y = startPos + (Math.sin(val * Math.PI));
        cube.rotation.y = startRotY + val * (Math.PI * -startPosX);
      })
      .delay(delay || 0)
      .easing(EASING)
      .onComplete(() => {
        this.bounce(index);
      })
      .start();
  }

  wrinkle() {
    for (let vert of this.plane.geometry.vertices) {
      vert.z = Math.random() * PAPER_ENERGY;
    }
    const textureRotation = this.material.uniforms.rotation.value;
    this.material.uniforms.rotation.value = (textureRotation + Math.PI / 2) % (Math.PI * 2)
    this.plane.geometry.verticesNeedUpdate = true;
    // this.plane.geometry.computeFlatVertexNormals();
    this.plane.geometry.computeVertexNormals();
    this.plane.geometry.normalsNeedUpdate = true;
  }

  update(t, delta) {
    //this.pivot.rotation.y = Math.sin(t * 0.0001) * 0.1;
    //this.material.uniforms.time.value = t * 0.001;

    if (t > this.lastWrinkle + WRINKLE_RATE) {
      this.wrinkle();
      this.lastWrinkle = t;
    }
    tweenUpdate();
  }

  render() {
    //this.effect.render(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
