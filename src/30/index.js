import '../lib/configure';
import { Geometry, Vector3, AdditiveBlending, BoxBufferGeometry, Points, Raycaster, Vector2, TextureLoader, BufferGeometry, BufferAttribute, ShaderMaterial, Color, TextGeometry, FontLoader, MeshBasicMaterial, Mesh, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';
import BarycentricMaterial from '../12/BarycentricMaterial';
import { Tween, Easing, update as tweenUpdate } from 'tween';

const EASING = Easing.Quartic.InOut;
const CHANGE_RATE = 5000;
const ANIMATION = 4000;
const TEXT = 'thirtydays';
const SIZE = 30;
const ALPHA = 0.7;
const NOISE_MOD = 0.008;
const POS_DAMPEN = 0.4;
const SCALE = 0.02;
const FONT_DEPTH = 5;
const FONT_PATH = '../assets/hyrax-regular.typeface.json' || '../assets/droidsans.typeface.json';
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);
    this.loader = new FontLoader();
    this.loader.load(FONT_PATH, font => {
      this.font = font;
      this.textGeometry = [];
      let largestVertexCount = -Infinity;
      for (let i = 0; i < TEXT.length; i++) {
        const letter = TEXT[i];
        const geo = new TextGeometry(letter, {
          font: this.font,
          size: 10,
          height: 2,
          curveSegments: 5,
          bevelThickness: 1.5,
          bevelSegments: 1,
          bevelEnabled: true,
        });
        largestVertexCount = Math.max(geo.vertices.length, largestVertexCount);
        this.textGeometry.push(geo);
      }

      // Debugging
      console.log(this.textGeometry.reduce((data, geo, i) => {
        data[TEXT[i]] = geo.vertices.length;
        return data;
      }, {}));

      this.geometry = new Geometry();
      for (let i = 0; i < largestVertexCount; i++) {
        this.geometry.vertices.push(new Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ));
      }

      for (let i = 0; i < this.textGeometry.length; i++) {
        const geo = this.textGeometry[i];
        const morph = [];
        for (let v = 0; v < this.geometry.vertices.length; v++) {
          let vec;
          if (v >= geo.vertices.length) {
            const index = Math.floor(Math.random() * geo.vertices.length);
            vec = geo.vertices[index];
          } else {
            vec = geo.vertices[v];
          }
          vec = new Vector3().copy(vec);
          // center the geo
          vec.x -= 4;
          vec.y -= 2.6;
          morph.push(new Vector3().copy(vec));
        }
        this.geometry.morphTargets.push({ name: i, vertices: morph });
      }

      // Use first letter for initial geo
      for (let i = 0; i < this.geometry.morphTargets[0].vertices.length; i++) {
        const vert = this.geometry.morphTargets[0].vertices[i];
        this.geometry.vertices[i].copy(vert);
      }

      this.material = new ShaderMaterial({
        uniforms: {
          size: { value: SIZE },
          alpha: { value: ALPHA },
          time: { value: 0 },
          alphaMap: { value: null },
          dpr: { value: window.devicePixelRatio },
          noiseMod: { value: NOISE_MOD },
          posDampen: { value: POS_DAMPEN },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      });

      this.textureLoader = new TextureLoader();
      this.textureLoader.load('../assets/particle.jpg', texture => {
        this.material.uniforms.alphaMap.value = texture;
      });

      this.points = new Points(this.geometry, this.material);
      //this.points.position.set(-0.3, -0.3, 0);
      this.scene.add(this.points);
    });

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 20);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 0.5,
      applyZoomBlur: true,
      blurAmount: 2,
    });
    this._lastChange = -1000;
    this._currentIndex = 0;
  }

  update(t, delta) {
    if (!this.material) {
      return
    }
    tweenUpdate();
    this.material.uniforms.time.value = t * 0.001;

    if (t > (CHANGE_RATE + this._lastChange)) {
      this._lastChange = t;
      const from = this._currentIndex;
      const to = this._currentIndex = (this._currentIndex + 1) % TEXT.length;
      new Tween({ x: 0 })
        .to({ x : 1 }, ANIMATION)
        .onUpdate(val => {
          const verts = this.geometry.vertices;
          const fromVerts = this.geometry.morphTargets[from].vertices;
          const toVerts = this.geometry.morphTargets[to].vertices;
          for (let i = 0; i < verts.length; i++) {
            verts[i].lerpVectors(fromVerts[i], toVerts[i], val);
          }
          this.geometry.verticesNeedUpdate = true;
        })
        .easing(EASING)
        .start();
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
