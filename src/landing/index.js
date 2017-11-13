import { AdditiveBlending, Points, TextureLoader, ShaderMaterial, Color, TextGeometry, FontLoader, MeshBasicMaterial, Mesh, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';

const TEXT = 'Codevember';
const TEXT2 = '2017';
const P_SIZE = 10;
const SCALE = 0.02;
const SCROLL_RATE = 0.001;
class Experiment extends ThreeApp {
  init() {
    // Set the video tiles to be almost "below the fold"
    document.querySelector('#container').style.marginTop = `${window.innerHeight - 100}px`;

    this.loader = new FontLoader();
    this.loader.load('assets/droidsans.typeface.json', font => {
    console.log('loade font');
      this.font = font;
      this.geometry = new TextGeometry(TEXT, {
        font: this.font,
        size: 150,
        height: 2,
        curveSegments: 1,
        bevelThickness: 1.5,
        bevelSegments: 10,
        bevelEnabled: true,
      });
      this.geometry2 = new TextGeometry(TEXT2, {
        font: this.font,
        size: 90,
        height: 2,
        curveSegments: 4,
        bevelThickness: 1.5,
        bevelSegments: 3,
        bevelEnabled: true,
      });

      this.material = new ShaderMaterial({
        transparent: true,
        fragmentShader,
        vertexShader,
        uniforms: {
          time: { value: 0 },
          size: { value: P_SIZE },
          alphaMap: { value: 0 },
        },
        depthWrite: false,
      });

      this.material.blending = AdditiveBlending;
      this.textureLoader = new TextureLoader();
      this.textureLoader.load('assets/particle.jpg', texture => {
        this.material.uniforms.alphaMap.value = texture;
      });
      this.points = new Points(this.geometry, this.material);
      this.points.scale.set(SCALE, SCALE, SCALE);
      this.points.position.set(-7, 1, 0);
      this.pointPivot = new Object3D();
      this.pointPivot.add(this.points);
      //this.scene.add(this.pointPivot);
      this.points2 = new Points(this.geometry2, this.material);
      this.points2.scale.set(SCALE, SCALE, SCALE);
      this.points2.position.set(-1, -1, 0);
      this.pointPivot2 = new Object3D();
      this.pointPivot2.add(this.points2);
      //this.scene.add(this.pointPivot2);

    });

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.pivot.rotation.x = 0.05;
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 10);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 3,
    });

    window.addEventListener('scroll', e => {
      const scroll = window.pageYOffset || document.documentElement.scrollTop;
    if (this.points) {
    this.pointPivot.rotation.y = -scroll * SCROLL_RATE;
    this.pointPivot2.rotation.y = scroll * SCROLL_RATE;
    }
    
    }, supportsPassive() ? { passive: true } : false);
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();

// Test via a getter in the options object to see if the passive property is accessed
// var supportsPassive = false;
// via: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
function supportsPassive() {
  let passive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        passive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {}

  return passive;
}
