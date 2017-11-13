import '../lib/configure';
import { AdditiveBlending, BoxBufferGeometry, Points, Raycaster, Vector2, TextureLoader, BufferGeometry, BufferAttribute, ShaderMaterial, Color, TextGeometry, FontLoader, MeshBasicMaterial, Mesh, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';
import BarycentricMaterial from '../12/BarycentricMaterial';

const TEXT = 'hyrax';
const TEXT_OFFSET = -TEXT.length;
const POINTS = 1000;
const P_SIZE = 5;
const COLOR_SPEED = 10;
const TWINKLE_SPEED = 3;
const TWINKLE_OFFSET = 100;
const SCALE = 0.02;
const SCROLL_RATE = 0.001;
const ROTATION_SPEED = 0.0002;
const ROTATION_LIMIT_Y = 0.1;
const ROTATION_LIMIT_X = 0.2;
const FONT_DEPTH = 5;
const FONT_PATH = '../assets/hyrax-regular.typeface.json' || '../assets/droidsans.typeface.json';
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);
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
      this.scene.add(this.textMesh);
      const raycaster = new Raycaster();
      const points = new Float32Array(POINTS * 3);
      const offset = new Float32Array(POINTS);
      const vec = new Vector2();
      let i = 0;
      let bailout = 0;
      let t = performance.now();
      while (i < POINTS * 3) {
        vec.set(Math.random() * 2 - 1, Math.random() * 2 - 1);
        raycaster.setFromCamera(vec, this.camera);
        const intersects = raycaster.intersectObject(this.textMesh);

        for (let intersect of intersects) {
          offset[i/3] = Math.random();
          points[i++] = intersect.point.x;
          points[i++] = intersect.point.y;
          points[i++] = intersect.point.z;
        }
      }
      console.log(`Generated ${POINTS} intersections in ${(performance.now() - t) / 1000}s`);

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
      this.scene.add(this.points);
    });

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 1, 11);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 0.2,
      enableZoomBlur: true,
      blurAmount: 0.9,
    });

    this.mouseX = 0.5;
    this.mouseY = 0.5;
    window.addEventListener('mousemove', e => {
      this.mouseX = e.clientX / window.innerWidth;
      this.mouseY = e.clientY / window.innerWidth;
    });
  }

  update(t, delta) {
    const USE_MOUSE = false;
    if (USE_MOUSE) {
      const MOUSE_LOOK_SPEED = 1;
      const targetY = (this.mouseX * 2.0 - 1.0) * ROTATION_LIMIT_Y;
      const targetX = (this.mouseY * 2.0 - 1.0) * ROTATION_LIMIT_X;
      const currentY = this.pivot.rotation.y;
      const currentX = this.pivot.rotation.x;
      if (Math.abs(targetY - currentY) < 0.01) {
        // do nothing
      } else if (currentY > targetY) {
        this.pivot.rotation.y -= delta * MOUSE_LOOK_SPEED * 0.0001;
      } else if (currentY < targetY) {
        this.pivot.rotation.y += delta * MOUSE_LOOK_SPEED * 0.0001;
      }

      if (Math.abs(targetX - currentX) < 0.01) {
        // do nothing
      } else if (currentX > targetX) {
        this.pivot.rotation.x -= delta * MOUSE_LOOK_SPEED * 0.0001;
      } else if (currentX < targetX) {
        this.pivot.rotation.x += delta * MOUSE_LOOK_SPEED * 0.0001;
      }
    } else {
      this.pivot.rotation.y = Math.sin(t * ROTATION_SPEED) * ROTATION_LIMIT_Y;
    }

    if (this.material) {
      this.material.uniforms.time.value = t * 0.001;
    }
    if (this.wireframeMaterial) {
      this.wireframeMaterial.uniforms.wireframeAlpha.value = 0.02 + (Math.sin(t * 0.001) * 0.5 + 0.5) * 0.1;
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
