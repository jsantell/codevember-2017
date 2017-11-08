import { MeshBasicMaterial, TetrahedronBufferGeometry, TextureLoader, Object3D, BufferAttribute, ShaderMaterial, Color, PointsMaterial, Points, IcosahedronBufferGeometry, Mesh } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import pointsFragmentShader from './points-frag.glsl';
import pointsVertexShader from './points-vert.glsl';
import WAGNER from '@alex_toudic/wagner';
import VignettePass from '@alex_toudic/wagner/src/passes/vignette/VignettePass';

const POINT_SIZE = 20.0;

class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0xf4f4f4);

    this.material = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(0x1c1c1c) },
        wireframeColor: { value: new Color(0x4a4a4a) },
        rms: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });
    this.pointsMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new Color(0xf8f8f8) },
        sprite: { value: null },
        size: { value: POINT_SIZE },
        rms: { value: 0 },
      },
      depthWrite: false,
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
    });
    this.textureLoader = new TextureLoader();
    this.textureLoader.load('particle.jpg', texture => {
      this.pointsMaterial.uniforms.sprite.value = texture;
    });
    this.geometry = new IcosahedronBufferGeometry(1, 4);
    const verts = this.geometry.attributes.position.count;
    const barycentric = new Float32Array(verts * 3);
    for (let i = 0; i < verts * 3; i += 3) {
      barycentric[i + 0] = (i%9) / 3 === 0 ? 1 : 0;
      barycentric[i + 1] = (i%9) / 3 === 1 ? 1 : 0;
      barycentric[i + 2] = (i%9) / 3 === 2 ? 1 : 0;
    }
    this.geometry.addAttribute('barycentric', new BufferAttribute(barycentric, 3));
    this.mesh = new Mesh(this.geometry, this.material);
    this.points = new Points(this.geometry, this.pointsMaterial);
    this.points.scale.set(1.01, 1.01, 1.01);
    this.scene.add(this.mesh);
    this.scene.add(this.points);
    this.pivot = new Object3D();
    this.pivot.position.set(0, 0, 0);
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
/*
    const tetraGeo = new TetrahedronBufferGeometry(1, 0);
    this.tetras = [];
    for (let i = 0; i < 3; i++) {
      const tetra = new Mesh(tetraGeo, new MeshBasicMaterial({ depthWrite: false, color: 0x222222 }));
      this.tetras.push(tetra);
      this.scene.add(tetra);
    }
    this.randomizeTetras();
*/

    this.camera.position.set(0, 0, 2.5);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new VignettePass(1.2, 0.6);
  }

  randomizeTetras() {
    for (let tetra of this.tetras) {
      tetra.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      tetra.rotation.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.00005;
  }

  render() {
    this.renderer.clear();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
//    this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
