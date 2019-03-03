import '../lib/configure';
import { AdditiveBlending, BoxBufferGeometry, Points, Raycaster, Vector2, TextureLoader, BufferGeometry, BufferAttribute, ShaderMaterial, Color, TextGeometry, FontLoader, MeshBasicMaterial, Mesh, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';
import BarycentricMaterial from '../12/BarycentricMaterial';
import pointsData from './points';

const TEXT = 'codevember';
const TEXT_OFFSET = -TEXT.length + 0.5;
const POINTS = 1000;
const P_SIZE = 10;
const COLOR_SPEED = 10;
const TWINKLE_SPEED = 3;
const TWINKLE_OFFSET = 100;
const SCALE = 0.02;
const SCROLL_RATE = 0.001;
const ROTATION_SPEED = 0.0002;
const ROTATION_LIMIT_Y = 0.1;
const ROTATION_LIMIT_X = 0.2;
const FONT_DEPTH = 5;
const CAMERA_Y = 0;
const FONT_PATH = 'assets/hyrax-regular.typeface.json' || 'assets/droidsans.typeface.json';
class Experiment extends ThreeApp {
  init() {
    // Set the video tiles to be almost "below the fold"
    document.querySelector('#container').style.marginTop = `${window.innerHeight - 100}px`;

    const experiments = document.querySelectorAll('a.experiment');
    for (let el of experiments) {
      el.addEventListener('mouseenter', e => this.onMouseEnter(e));
      el.addEventListener('mouseleave', e => this.onMouseLeave(e));
    }

    this.renderer.setClearColor(0x101010);
    this.loader = new FontLoader();
    this.loader.load(FONT_PATH, font => {
      this.font = font;
      this.textGeometry = new TextGeometry(TEXT, {
        font: this.font,
        size: 150,
        height: 2,
        curveSegments: 5,
        bevelThickness: 1.5,
        bevelSegments: 1,
        bevelEnabled: true,
      });


      this.wireframeMaterial = new BarycentricMaterial({
        width: 0.7,
        wireframeAlpha: 0.3,
        color: new Color(0xffffff),
      });
      this.wireframeMaterial.blending = AdditiveBlending;
      this.textGeometry = new BufferGeometry().fromGeometry(this.textGeometry);
      this.textMesh = new Mesh(this.textGeometry, this.wireframeMaterial);
      BarycentricMaterial.applyBarycentricCoordinates(this.textGeometry);
      this.textMesh.scale.set(SCALE, SCALE, SCALE * -FONT_DEPTH);
      this.textMesh.position.x = TEXT_OFFSET;
      this.textMesh.updateMatrixWorld();
     
      // Call this function to generate points; pasted into a cache at ./points.js
      // so use that unless we want to generate different results
      // const points = this.generatePoints();
      const points = new Float32Array(pointsData);
      const offset = new Float32Array(POINTS);
      for (let i = 0; i < points.length / 3; i++) {
        offset[i] = Math.random();
      }

      this.geometry = new BufferGeometry();
      this.geometry.addAttribute('position', new BufferAttribute(points, 3));
      this.geometry.addAttribute('offset', new BufferAttribute(offset, 1));
      this.material = new ShaderMaterial({
        transparent: true,
        fragmentShader,
        vertexShader,
        uniforms: {
          time: { value: 0 },
          twinkleSpeed: { value: TWINKLE_SPEED },
          twinkleOffset: { value: TWINKLE_OFFSET },
          size: { value: P_SIZE },
          colorSpeed: { value: COLOR_SPEED },
          alphaMap: { value: 0 },
        },
        depthWrite: false,
      });
      this.material.blending = AdditiveBlending;

      this.textureLoader = new TextureLoader();
      this.textureLoader.load('../assets/particle.jpg', texture => {
        this.material.uniforms.alphaMap.value = texture;
      });


      this.points = new Points(this.geometry, this.material);
      this.pointsPivot = new Object3D();
      this.scene.add(this.pointsPivot);
      this.pointsPivot.add(this.textMesh);
      this.pointsPivot.add(this.points);
    });

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, CAMERA_Y, 15);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 0.2,
      enableZoomBlur: true,
      blurAmount: 0.9,
    });

    window.addEventListener('scroll', e => {
      const scroll = window.pageYOffset || document.documentElement.scrollTop;
      this.camera.position.y = CAMERA_Y + (scroll * SCROLL_RATE);
    }, supportsPassive() ? { passive: true } : false);
  }

  generatePoints() {
    const raycaster = new Raycaster();
    const points = new Float32Array(POINTS * 3);
    const vec = new Vector2();
    let i = 0;
    let bailout = 0;
    let t = performance.now();
    while (i < POINTS * 3) {
      vec.set(Math.random() * 2 - 1, Math.random() * 2 - 1);
      raycaster.setFromCamera(vec, this.camera);
      const intersects = raycaster.intersectObject(this.textMesh);

      for (let intersect of intersects) {
        points[i++] = intersect.point.x;
        points[i++] = intersect.point.y;
        points[i++] = intersect.point.z;
      }
    }
    console.log(`Generated ${POINTS} intersections in ${(performance.now() - t) / 1000}s`);
    return points;
  }

  update(t, delta) {
    if (!this.pointsPivot) {
      this.offset = t;
      return;
    }
    t = t - this.offset;
    this.camera.lookAt(this.scene.position);
    this.material.uniforms.time.value = t * 0.001;
    this.wireframeMaterial.uniforms.wireframeAlpha.value = 0.05 + (Math.sin(t * 0.001) * 0.5 + 0.5) * 0.1;
    this.pointsPivot.rotation.y = t * 0.00005;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }

  onMouseEnter(e) {
    e.target.querySelector('video').play();
  }

  onMouseLeave(e) {
    e.target.querySelector('video').pause();
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
