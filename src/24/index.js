import '../lib/configure';
import { Quaternion, Matrix4, DirectionalLight, DoubleSide, UniformsLib, MeshPhongMaterial, Vector3, Triangle, BoxGeometry, BufferGeometry, Color, AdditiveBlending, OctahedronGeometry, Geometry, BufferAttribute, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import { ARUtils } from 'three.ar.js';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import ExplodeModifier from '../lib/ExplodeModifier';

const DISPLACEMENT = 0.8;
const SCALE = 1;
const SPREAD = 10;
const TRI_SCALE = 0.5;
const MODEL = '../assets/male_head_obj.obj';
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);

    ARUtils.loadModel({ objPath: MODEL, OBJLoader: window.THREE.OBJLoader }).then(group => {
      this.model = group;
      console.log(this.model);

      const transform = new Matrix4().compose(
        new Vector3(0.7, -1.3, 0),
        new Quaternion(),
        new Vector3(0.05, 0.05, 0.05)
      );
      for (let mesh of this.model.children) {
        mesh.geometry.applyMatrix(transform);
        const geo = new Geometry().fromBufferGeometry(mesh.geometry);
        ExplodeModifier(geo);
        mesh.geometry = addOffset(geo);
        mesh.material = this.material;
      }

      this.scene.add(this.model);
    });

    this.light = new DirectionalLight();
    this.scene.add(this.light);
    this.light.position.y = 10;
    this.light.position.x = 5;

    this.material = new ShaderMaterial({
      defines: {
      },
      uniforms: {
        alpha: { value: 0.5 },
        time: { value: 0 },
        displacment: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      transparent: true,
    });
    this.material.blending = AdditiveBlending;

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 4);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 5,
      applyZoomBlur: true,
      zoomBlurStrength: 0.9,
    });
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.00001;
    this.material.uniforms.time.value = t * 0.001;
  }

  render() {
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();

function addOffset (geometry) {
  const bufferGeometry = new BufferGeometry().fromGeometry(geometry);
  const offset = new Float32Array(geometry.faces.length * 3);
  const midpoint = new Float32Array(geometry.faces.length * 3 * 3);
  const rotatepoint = new Float32Array(geometry.faces.length * 3 * 3);
  const tmpVec = new Vector3();
  for (let i = 0; i < geometry.faces.length; i++) {
    // const d = Math.random();
    const face = geometry.faces[i];
    const verts = [face.a, face.b, face.c].map(vIndex => geometry.vertices[vIndex]);
    const tri = new Triangle(...verts);
    tri.midpoint(tmpVec);

    //const d = Math.min(1.0, (minY + 1) / 2);
    let d = i / geometry.faces.length * Math.PI * 2;
    d = i % 2 ? Math.PI * 2 - d : d;
    d = verts.reduce((max, v) => Math.max(Math.abs(v.x), max), -Infinity) * Math.PI * 2;
    offset[(3 * i) + 0] = d;
    offset[(3 * i) + 1] = d;
    offset[(3 * i) + 2] = d;
    for (let j = 0; j < 3; j++) {
      midpoint[(9 * i) + (j * 3 + 0)] = tmpVec.x;
      midpoint[(9 * i) + (j * 3 + 1)] = tmpVec.y;
      midpoint[(9 * i) + (j * 3 + 2)] = tmpVec.z;
      
      rotatepoint[(9 * i) + (j * 3 + 0)] = verts[0].x;
      rotatepoint[(9 * i) + (j * 3 + 1)] = verts[0].y;
      rotatepoint[(9 * i) + (j * 3 + 2)] = verts[0].z;
    }
  }
  bufferGeometry.addAttribute('offset', new BufferAttribute(offset, 1));
  bufferGeometry.addAttribute('midpoint', new BufferAttribute(midpoint, 3));
  bufferGeometry.addAttribute('rotatepoint', new BufferAttribute(rotatepoint, 3));

  return bufferGeometry;
}
