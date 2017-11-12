import '../lib/configure';
import * as THREE from 'three';
import { Tween, Easing, update as tweenUpdate } from 'tween';
import { ARUtils } from 'three.ar.js';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import VignettePass from '@alex_toudic/wagner/src/passes/vignette/VignettePass';

const OBJ_PATH = 'model.obj';
const MTL_PATH = 'materials.mtl';
const EASING_OPEN = Easing.Quintic.Out;
const EASING_CLOSE  = Easing.Bounce.Out;
const SPEED = 800;
const WAIT = 0;
const MIN_FREQ = 350;
const UPPER_FREQ_RANGE = 10000;
const SONG_URL = 'work.mp3';

const map = (value, inMin, inMax, outMin, outMax) => {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

class Experiment extends ThreeApp {
  init() {
    const div = document.createElement('div');
    div.innerText = 'click the party fridge';
    div.style = 'left: 40%; top: 0; text-align: center; font-family: "Roboto", sans-serif; position: absolute; width: 20%; padding: 10px; background-color: rgba(0,0,0,0.2); color: white; margin: 0 auto;';
    document.body.appendChild(div);

    this.onClick = this.onClick.bind(this);
    window.addEventListener('click', this.onClick);

    this.renderer.setClearColor(0x119999);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    // Lights
    this.dLight = new THREE.SpotLight(0xffffff);
    this.dLight.position.set(14, 20, -5);
    this.dLight.intensity = 0.05;
    this.dLight.castShadow = true;
    this.dLight.target.position.set(0, 0, 0);
    this.light = new THREE.AmbientLight(0xffffff);
    this.light.intensity = 0.6;
    this.scene.add(this.light);
    this.scene.add(this.dLight);
    this.scene.add(this.dLight.target);

    this.pivot = new THREE.Object3D();
    this.pivot.position.set(0, 0, 0);
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 5, 20);

    // Floors
    this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500), new THREE.MeshBasicMaterial({ color: 0x226622 }));
    this.floorShadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(50, 50), new THREE.ShadowMaterial({ color: 0x111111, opacity: 0.3 }));
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -4;
    this.floorShadow.rotation.x = -Math.PI / 2;
    this.floorShadow.position.y = -3.9;
    this.floorShadow.receiveShadow = true;
    this.scene.add(this.floor);
    this.scene.add(this.floorShadow);

    // Icebox hinges
    this.hinge = new THREE.Object3D();
    this.hingePivot = new THREE.Object3D();
    this.hingePivot.position.set(0, 0.00, -0.1);
    this.hingePivot.add(this.hinge);
    this.hinge.position.set(-0.0, 0, 0.1);
    this.hinge.rotation.y = 0.12;

    // audio
    this.ctx = new (window.webkitAudioContext || window.AudioContext)();
    this.audioEl = document.createElement('audio');
    this.audioEl.src = SONG_URL;
    this.audioEl.loop = true;
    this.audioEl.style = 'display: none;';
    this.audioNode = this.ctx.createMediaElementSource(this.audioEl);
    document.body.appendChild(this.audioEl);
    this.audioEl.play();
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = MIN_FREQ;
    this.audioNode.connect(this.filter);
    this.filter.connect(this.ctx.destination);

    // Icebox
    // Model: https://poly.google.com/view/f7q6m6IL8UI
    this.objLoader = new THREE.OBJLoader();
    this.mtlLoader = new THREE.MTLLoader(this.objLoader.manager);
    this.mtlLoader.setTexturePath(MTL_PATH.substr(0, MTL_PATH.lastIndexOf('/') + 1));
    this.mtlLoader.load(MTL_PATH, materials => {
      materials.preload();
      this.objLoader.setMaterials(materials);
      this.objLoader.load(OBJ_PATH, model => {
        this.model = model;
        // Move all submeshes to the hinge pivot that are the icebox's
        // lid so we can animate it independently
        for (let i = this.model.children.length - 1; i >= 0; i--) {
          const geo = this.model.children[i];
          geo.castShadow = true;
          geo.receiveShadow = true;

          if (i === 0) {
            // first model is the box geometry
            continue;
          }
          this.model.remove(geo);
          this.hinge.add(geo);
        }
        this.model.add(this.hingePivot);
        this.model.scale.set(20, 20, 20);
        this.scene.add(this.model);
      });
    });

    this.composer = new WAGNER.Composer(this.renderer);
    this.bloomPass = new BloomPass({
      zoomBlurStrength: 0.01,
      applyZoomBlur: false,
      blurAmount: 1,
    });
    this.vignettePass = new VignettePass(1.1, 1.2);
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;

    tweenUpdate();
  }

  render() {
    this.renderer.clearColor();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.bloomPass);
    this.composer.pass(this.vignettePass);
    this.composer.toScreen();
    this.camera.lookAt(this.pivot.position);
    // this.renderer.render(this.scene, this.camera);
  }

  onClick() {
    if (this.opening || this.closing) {
      return;
    }
    this.open();
  }

  open() {
    this.opening = new Tween(this.hingePivot.rotation)
      .to({ x: Math.PI / 2 }, SPEED)
      .onUpdate(val => {
        this.hingePivot.rotation.x = val * Math.PI / -2;
        this.updateFilter();
      })
      .easing(EASING_OPEN)
      .onComplete(() => {
        setTimeout(() => {
          this.opening = null;
          this.close();
        }, WAIT);
      })
      .start();
  }

  close() {
    this.closing = new Tween(this.hingePivot.rotation)
      .to({ x: 0 }, SPEED)
      .onUpdate(val => {
        this.hingePivot.rotation.x = (1 - val) * Math.PI / -2;
        this.updateFilter();
      })
      .easing(EASING_CLOSE)
      .onComplete(() => {
        this.closing = null;
      })
      .start();
  }

  updateFilter() {
    const rotation = this.hingePivot.rotation.x;
    this.filter.frequency.value = MIN_FREQ +
                                  (1 - map(rotation, Math.PI / -2, 0, 0, 1)) * (UPPER_FREQ_RANGE - MIN_FREQ);
  }
}

export default new Experiment();
