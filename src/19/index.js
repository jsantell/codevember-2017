import '../lib/configure';
import { DoubleSide, SpotLight, BackSide, Color, BoxBufferGeometry, PlaneBufferGeometry, MeshBasicMaterial, PCFSoftShadowMap, ShadowMaterial, Vector2, CylinderBufferGeometry, Matrix4, AmbientLight, WebGLRenderTarget, PointLight, MeshStandardMaterial, SphereBufferGeometry, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import GodRayPass from '@alex_toudic/wagner/src/passes/godray/godraypass';
import EffectComposerFn from 'three-effectcomposer';
const EffectComposer = EffectComposerFn(window.THREE);
import OrbitControlsFn from 'three-orbit-controls';
const OrbitControls = OrbitControlsFn(window.THREE);
const { RenderPass, ShaderPass } = EffectComposer;

const OBJ_PATH = '../assets/fan.obj';
const MODEL_PATH = '../assets/luigi.obj';
const ROOM_SCALE = 2;
const FAN_SCALE = 0.002;
const MODEL_SCALE = 0.01;
const AMBIENT = 0.1;
const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;
const CLEAR_COLOR = 0x111111;
// Inspired by https://medium.com/@andrew_b_berg/volumetric-light-scattering-in-three-js-6e1850680a41
const projectOnScreen = (object, camera) => {
  var mat = new Matrix4();
  mat.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld);
  mat.multiplyMatrices( camera.projectionMatrix , mat);

  var c = mat.elements[15];
  var lPos = new Vector2(mat.elements[12]/c, mat.elements[13]/c);
  lPos.multiplyScalar(0.5);
  lPos.addScalar(0.5);
  return lPos;
};

const AdditiveBlendingShader = {
  uniforms: {
    tDiffuse: { value:null },
    tAdd: { value:null }
  },

  vertexShader: [
    "varying vec2 vUv;",
  "void main() {",
  "vUv = uv;",
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
  "}"
    ].join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
  "uniform sampler2D tAdd;",
  "varying vec2 vUv;",
  "void main() {",
  "vec4 color = texture2D( tDiffuse, vUv );",
  "vec4 add = texture2D( tAdd, vUv );",
  "gl_FragColor = color + add;",
  "}"
    ].join("\n")
};
class OcclusionCloner {
  constructor(scene) {
    this.scene = scene;
    this.objects = new Map();
  }

  add(object) {
    const blackMat = new MeshBasicMaterial({ color: 0x000000 });
    if (object.material.opacity !== 1) {
    //  blackMat.color = new Color(0xffffff - (0xffffff * object.material.opacity));
    }
    const clone = new Mesh(object.geometry, blackMat);
    clone.layers.set(OCCLUSION_LAYER);
    clone.matrixAutoUpdate = false;
    this.scene.add(clone);
    this.objects.set(object, clone);
  }

  addLight(light) {
    const clone = new Mesh(new SphereBufferGeometry(0.3, 10, 10), new MeshBasicMaterial({ color: 0xffffff }));
    clone.layers.set(OCCLUSION_LAYER);
    clone.matrixAutoUpdate = false;
    this.scene.add(clone);
    this.objects.set(light, clone);
  }


  update() {
    for (var [object, clone] of this.objects) {
      clone.matrix = object.matrix;
      clone.matrixWorld = object.matrixWorld;
    }
  }
}

const VolumetricLightMaterial = new ShaderMaterial({
  uniforms: {
    tDiffuse: {value:null},
    lightPosition: {value: new Vector2(0.5, 0.5)},
    exposure: {value: 0.1},
    decay: {value: 0.96},
    density: {value: 2},
    weight: {value: 0.5},
    samples: {value: 100}
  },
  vertexShader,
  fragmentShader,
});

class Experiment extends ThreeApp {
  init() {
    new OrbitControls(this.camera);
    this.renderer.setClearColor(0x222222);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.occlusionTarget = new WebGLRenderTarget(window.innerWidth * 0.5, window.innerHeight * 0.5);
    this.occlusionComposer = new EffectComposer(this.renderer, this.occlusionTarget);
    this.occlusionComposer.addPass(new RenderPass(this.scene, this.camera));
    let pass = new ShaderPass(VolumetricLightMaterial);
    pass.needsSwap = false;
    this.occlusionComposer.addPass(pass);
    this.volumetricPass = pass;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    pass = new ShaderPass(AdditiveBlendingShader);
    pass.uniforms.tAdd.value = this.occlusionTarget.texture;
    this.composer.addPass(pass);
    pass.renderToScreen = true;

    this.cloner = new OcclusionCloner(this.scene);
    this.pivot = new Object3D();

    this.objLoader = new THREE.OBJLoader();
    this.objLoader.load(OBJ_PATH, model => {
      this.fan = model.children[0];
      this.fan.material = new MeshStandardMaterial({
        metalness: 0.5,
        roughness: 0.5,
        color: 0x111111,
      });
      this.fan.scale.set(FAN_SCALE, FAN_SCALE, FAN_SCALE);
      this.fan.position.y = 1.7;
      this.fan.position.z = -0.1;
      this.fan.rotation.x = Math.PI;

      this.fan.castShadow = true;
      this.scene.add(this.fan);
      this.cloner.add(this.fan);

      this.sideFan = this.fan.clone();
      this.scene.add(this.sideFan);
      this.sideFan.position.set(0, 1, 1.5);
      this.sideFan.rotation.x = -Math.PI/2;
      this.sideFan.castShadow = true;
      this.sideLight = new SpotLight({color: 0xffffff });
      this.scene.add(this.sideLight);
      this.sideLight.position.set(0, 1, 1.8);
      this.sideLight.castShadow = true;
    });
    this.objLoader.load(MODEL_PATH, model => {
      this.model = model.children[0];
      this.model.material = new MeshStandardMaterial({
        metalness: 1,
        roughness: 0.4,
        color: 0xDAA520,
      });
      this.model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
      
      this.model.castShadow = true;
      this.model.receiveShadow = true;
      this.scene.add(this.model);
      this.cloner.add(this.model);
    });

    this.room = new Mesh(new BoxBufferGeometry(1, 1, 1), new MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.5,
      roughness: 0.5,
      side: DoubleSide,
    }));
    this.roomShadow = new Mesh(new PlaneBufferGeometry(1, 10, 10), new ShadowMaterial({
      color: 0x111111,
      opacity: 0.9,
    }));
    this.room.scale.set(ROOM_SCALE*200, ROOM_SCALE, ROOM_SCALE * 20);
    this.roomShadow.receiveShadow = true;
    this.room.position.y = ROOM_SCALE / 2;
    this.roomShadow.rotation.x = Math.PI / -2;
    this.roomShadow.position.y = 0.001;
    this.roomShadow.scale.set(this.room.scale.x - 0.01, this.room.scale.y - 0.01, this.room.scale.z - 0.01);
    this.scene.add(this.room);
    this.scene.add(this.roomShadow);

    this.light = new AmbientLight(0xff0000, AMBIENT);
    this.vLight = new PointLight();
    this.vLight.position.set(0, 1.8, -0.1);
    this.vLight.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(this.vLight);
    this.cloner.addLight(this.vLight);


    //this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(-0.8, 0.1, 1);
    this.camera.rotation.x = 0.5;
    this.camera.rotation.y = -0.6;
    this.renderer.render(this.scene, this.camera);
  }

  updateLightPosition() {
    this.volumetricPass.uniforms.lightPosition.value = projectOnScreen(this.vLight, this.camera);
  }

  update(t, delta) {
    if (this.fan) {
      this.fan.rotation.y = t* 0.001;
      this.sideFan.rotation.y = t* 0.001;
    }
    this.pivot.rotation.y = t * 0.0001;
    this.pivot.updateMatrixWorld(true);
    this.vLight.updateMatrixWorld(true);
    this.updateLightPosition();
    this.cloner.update();
  }

  render() {
    this.camera.layers.set(OCCLUSION_LAYER);
    this.renderer.setClearColor(0x000000);
    this.occlusionComposer.render();

    this.camera.layers.set(DEFAULT_LAYER);
    this.renderer.setClearColor(CLEAR_COLOR);
    this.composer.render();
  }
}

export default new Experiment();
