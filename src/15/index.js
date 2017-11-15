import '../lib/configure';
import { DirectionalLight, DoubleSide, UniformsLib, MeshPhongMaterial, Vector3, Triangle, BoxGeometry, BufferGeometry, Color, AdditiveBlending, OctahedronGeometry, BufferAttribute, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import ExplodeModifier from '../lib/ExplodeModifier';

const DISPLACEMENT = 0.8;
const SCALE = 1;
const SPREAD = 10;
const TRI_SCALE = 0.5;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);

    const geometry = this.g = new OctahedronGeometry(1, 3);
    //const geometry = this.g = new BoxGeometry(1, 1, 1);
    ExplodeModifier(geometry);

    const lambert = new MeshPhongMaterial();

    this.light = new DirectionalLight();
    this.scene.add(this.light);
    this.light.position.y = 10;
    this.light.position.x = 5;

    const uniforms = Object.assign({
      time: { value: 0 },
      displacement: { value: DISPLACEMENT },
      spread: { value: SPREAD },
      triScale: { value: TRI_SCALE },
                        "ambient"  : { type: "c", value: new Color( 0xffffff ) },
                  "emissive" : { type: "c", value: new Color( 0x000000 ) },
                  "wrapRGB"  : { type: "v3", value: new Vector3( 1, 1, 1 ) }
    }, ...Object.keys(UniformsLib).map(k => UniformsLib[k])
//      UniformsLib.lights,
 //     UniformsLib.common
    );

    this.material = new ShaderMaterial({
      defines: {
        USE_MAP: '',
      },
      uniforms,
      vertexShader,
      //fragmentShader: lambert.fragmentShader,
      fragmentShader,
      side: DoubleSide,
      transparent: true,
    });
    this.material.blending = AdditiveBlending;
    this.geometry = new BufferGeometry().fromGeometry(geometry);

    const offset = new Float32Array(geometry.faces.length * 3);
    const midpoint = new Float32Array(geometry.faces.length * 3 * 3);
    /*
    for (let i = 0; i < geometry.faces.length; i++) {
      const index = i * 9;
      const d = i / geometry.faces.length;
      for (let j = 0; j < 3; j++) {
        offset[index + (3 * j) + 0] = d;
        offset[index + (3 * j) + 1] = d;
        offset[index + (3 * j) + 2] = d;
      }
    }
    */
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
      }
    }
    this.geometry.addAttribute('offset', new BufferAttribute(offset, 1));
    this.geometry.addAttribute('midpoint', new BufferAttribute(midpoint, 3));

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.scale.set(SCALE, SCALE, SCALE);
    this.scene.add(this.mesh);

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 5);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 5,
      applyZoomBlur: true,
      zoomBlurStrength: 0.9,
    });
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
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
