import '../lib/configure';
import { Color, PlaneBufferGeometry, MeshBasicMaterial, PCFSoftShadowMap, ShadowMaterial, Vector2, CylinderBufferGeometry, Matrix4, AmbientLight, WebGLRenderTarget, PointLight, MeshStandardMaterial, SphereBufferGeometry, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import GodRayPass from '@alex_toudic/wagner/src/passes/godray/godraypass';
import EffectComposerFn from 'three-effectcomposer';
const EffectComposer = EffectComposerFn(window.THREE);
const { RenderPass, ShaderPass } = EffectComposer;
// Inspired by https://medium.com/@andrew_b_berg/volumetric-light-scattering-in-three-js-6e1850680a41
const COLUMN_R = 0.4;
const COUNT = 7;
const RADIUS = 5;
const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;
const CLEAR_COLOR = 0x111111;
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
    const clone = new Mesh(new SphereBufferGeometry(0.7, 10, 10), new MeshBasicMaterial({ color: 0xffffff }));
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

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.PI * 2 * i / COUNT;
      const column = new Mesh(new CylinderBufferGeometry(COLUMN_R,COLUMN_R, 26), new MeshStandardMaterial({ color: 0x333333 }));
      const shadow = new Mesh(new CylinderBufferGeometry(COLUMN_R,COLUMN_R, 26), new ShadowMaterial({ color: 0x111111 }));
      column.position.x = Math.cos(angle) * RADIUS;
      column.position.z = Math.sin(angle) * RADIUS;
      column.castShadow = true;
      shadow.receiveShadow = true;
      shadow.scale.set(1.01, 1.01, 1.01);
      this.pivot.add(column);
      column.add(shadow);
      this.cloner.add(column);
    }

    this.floor = new Mesh(new PlaneBufferGeometry(2000, 2000), new MeshStandardMaterial({
      color: 0x222222,
      metalness: 0,
      roughness: 1,
    }));
    this.floorShadow = new Mesh(new PlaneBufferGeometry(20, 20), new ShadowMaterial({
      color: 0x111111,
      opacity: 0.8,
    }));
    this.floor.rotation.x = -Math.PI / 2;
    this.floorShadow.rotation.x = -Math.PI / 2;
    this.floorShadow.receiveShadow = true;
    this.floor.position.y = -2;
    this.floorShadow.position.y = this.floor.position.y + 0.0001;
    this.scene.add(this.floor);
    this.scene.add(this.floorShadow);

    this.light = new AmbientLight({ intensity: 0.5 });
    this.vLight = new PointLight();
    this.vLight.position.set(0, 5, -RADIUS - 1);
    this.vLight.castShadow = true;
    this.scene.add(this.light);
    this.scene.add(this.vLight);
    this.cloner.addLight(this.vLight);


    //this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 10);
    this.renderer.render(this.scene, this.camera);
  }

  updateLightPosition() {
    this.volumetricPass.uniforms.lightPosition.value = projectOnScreen(this.vLight, this.camera);
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
    this.pivot.updateMatrixWorld(true);
    this.vLight.position.x = Math.sin(t*0.0002) * RADIUS;
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
