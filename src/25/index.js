import '../lib/configure';
import { TextureLoader, Euler, MeshBasicMaterial, Quaternion, Matrix4, PointLight, DoubleSide, UniformsLib, MeshPhongMaterial, Vector3, Triangle, BoxGeometry, BufferGeometry, Color, AdditiveBlending, OctahedronGeometry, Geometry, BufferAttribute, Mesh, Object3D, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import { ARUtils } from 'three.ar.js';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import OrbitControlsFn from 'three-orbit-controls';
const OrbitControls = OrbitControlsFn(window.THREE);

const DISPLACEMENT = 0.0005;
const COLOR = 0x555555;
const NOISE_COLOR = 0x3333ff;
const LIGHT_INTENSITY = 0.005;
const MODEL = '../assets/Monument_angels.obj';
const SCALE = 0.01;
const DIFFUSE_MAP = {
  '02___Default': 'D_Monument_angels_a.bmp',
  'Material__1': 'D_Monument_angels_b.bmp',
  'Material__2': 'D_Monument_angels_c.bmp',
  'mat_Monument_angels': 'D_Monument_angels_d.bmp',
};

class Experiment extends ThreeApp {
  init() {
    new OrbitControls(this.camera);
    this.renderer.setClearColor(0x111111);

    ARUtils.loadModel({
      objPath: MODEL,
      OBJLoader: window.THREE.OBJLoader,
      mtlPath: ' ../assets/Monument_angels.mtl',
      MTLLoader: window.THREE.MTLLoader,
    }).then(group => {
      this.model = group;

      this.model.remove(this.model.children[3]);
      this.model.remove(this.model.children[2]);
      this.model.remove(this.model.children[1]);

      const transform = new Matrix4().compose(
        new Vector3(0, -1.5, 0),
        new Quaternion(),
        new Vector3(SCALE, SCALE, SCALE)
      );

      this.model.children[0].geometry.applyMatrix(transform);

      this.materials = Object.keys(DIFFUSE_MAP).reduce((mats, matName) => {
        const material = this.material.clone();
        material.name = matName;
        mats[matName] = material;
        return mats;
      }, {});

      // Use the MTL to map to materials so we can
      // use the right diffuse map
      const origMaterials = this.model.children[0].material;
      this.model.children[0].material = origMaterials.map(m => {
        this.materials[m.name].uniforms.diffuseMap.value = m.map;
        return this.materials[m.name];
      });

      this.scene.add(this.model);
    });

    this.light = new PointLight();
    this.scene.add(this.light);
    this.light.position.set(0, 0, 7);

    this.material = new ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'], {
          lightIntensity: { value: LIGHT_INTENSITY },
          //alpha: { value: 0.5 },
          //color: { value: new Color(COLOR) },
          noiseColor: { value: new Color(NOISE_COLOR) },
          time: { value: 0 },
          diffuseMap: { value: null },
          displacement: { value: DISPLACEMENT },
        }
      ]),
      vertexShader,
      fragmentShader,
      lights: true,
      side: THREE.FrontSide,
      transparent: true,
    });
    this.textureLoader = new TextureLoader();

    this.pivot = new Object3D();
    this.pivot2 = new Object3D();
    this.pivot.add(this.light);
    this.scene.add(this.pivot);
    this.scene.add(this.pivot2);
    this.camera.position.set(0, 0, 3);
    this.pivot2.add(this.camera);
    this.renderer.render(this.scene, this.camera);
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      blurAmount: 5,
      applyZoomBlur: true,
      zoomBlurStrength: 0.9,
    });
  }

  update(t, delta) {
    this.pivot.rotation.y = t * -0.001;
    this.pivot2.rotation.y = Math.sin(t * -0.0001) * 0.5;
    if (!this.model) {
      return;
    }
    for (let name of Object.keys(this.materials)) {
      this.materials[name].uniforms.time.value = t * 0.001;
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
