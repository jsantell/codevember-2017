import { AdditiveBlending, BoxBufferGeometry, Points, Raycaster, Vector2, TextureLoader, BufferGeometry, BufferAttribute, ShaderMaterial, Color, TextGeometry, FontLoader, MeshBasicMaterial, Mesh, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';

const TEXT = 'hyrax';
const POINTS = 1000;
const P_SIZE = 8;
const COLOR_SPEED = 2;
const TWINKLE_SPEED = 5;
const TWINKLE_OFFSET = 100;
const SCALE = 0.02;
const SCROLL_RATE = 0.001;
class Experiment extends ThreeApp {
  init() {
    this.loader = new FontLoader();
    this.loader.load('../assets/droidsans.typeface.json', font => {
      this.font = font;
      this.textGeometry = new TextGeometry(TEXT, {
        font: this.font,
        size: 150,
        height: 2,
        curveSegments: 1,
        bevelThickness: 1.5,
        bevelSegments: 10,
        bevelEnabled: true,
      });


      this.textMesh = new Mesh(this.textGeometry, new MeshBasicMaterial());
      this.textMesh.scale.set(SCALE, SCALE, SCALE);
      this.textMesh.position.x = -5;
      this.textMesh.updateMatrixWorld();

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
      this.pointPivot = new Object3D();
      this.pointPivot.add(this.points);
      this.scene.add(this.pointPivot);
      //this.scene.add(this.pointPivot2);
    });

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 1, 11);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 3,
    });
  }

  update(t, delta) {
    this.pivot.rotation.y = Math.sin(t * 0.0002) * 0.2;
    if (this.material) {
      this.material.uniforms.time.value = t * 0.001;
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
