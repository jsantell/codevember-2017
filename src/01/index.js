import { SphereBufferGeometry, TextureLoader, AdditiveBlending, BufferAttribute, Points, Mesh, Object3D, ShaderMaterial, BoxBufferGeometry } from 'three';
import ThreeApp from '../ThreeApp';
import GPUComputationRenderer from '../lib/GPUComputationRenderer';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import computePositionShader from './compute-position.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';
import GodRayPass from '@alex_toudic/wagner/src/passes/godray/godraypass';

const scale = 60;
const size = 12;
const radius = 2;
const radiusSpread = 5;
const speed = 1;
const speedSpread = 10;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);
    this.material = new ShaderMaterial({
      uniforms: {
        size: { value: size },
        time: { value: 0.0 },
        tPosition: { value: null },
        sprite: { value: null },
      },
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
    });
    this.material.blending = AdditiveBlending;
    this.textureLoader = new TextureLoader();
    this.textureLoader.load('particle.jpg', texture => {
      this.material.uniforms.sprite.value = texture;
    });

    this.setupGeometry();

    this.mesh = new Points(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);

    this.setupGPURenderer();

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.mesh);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 6);

    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 3,
      applyZoomBlur: true,
      blurAmount: 50,
    });

    this.pass = new GodRayPass({
    });
    this.pass.params.blurAmount = 0.3;
    this.pass.params.fDensity = 3;
    this.pass.params.fExposure = 1;
  }

  getTextureSize() {
    const count = this.geometry.getAttribute('position').count;

    let size = 2;
    while (size < Math.sqrt(count)) {
      size *= 2;
    }

    return size;
  }

  setupGeometry() {
    this.geometry = new SphereBufferGeometry(3,scale, scale);

    const verticesCount = this.geometry.getAttribute('position').count;
    console.log('Particle count: ', verticesCount);
    const width = this.getTextureSize();
    const uvs = new Float32Array(verticesCount * 2);
    let count = 0;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        uvs[count++] = i / (width - 1);
        uvs[count++] = j / (width - 1);

        if (count === verticesCount * 2) {
          break;
        }
      }
      if (count === verticesCount * 2) {
        break;
      }
    }
    this.geometry.addAttribute('uv', new BufferAttribute(uvs, 2));
  }

  setupGPURenderer() {
    const textureSize = this.getTextureSize();
    this.gpu = new GPUComputationRenderer(textureSize, textureSize, this.renderer);

    this.rotTexture = this.gpu.createTexture();
    this.posTexture = this.gpu.createTexture();

    this.seedTextures();

    this.posVar = this.gpu.addVariable('tPosition', computePositionShader, this.posTexture);
    this.gpu.setVariableDependencies(this.posVar, [this.posVar]);
    this.posVar.material.uniforms.delta = { value: 0.0 };
    this.posVar.material.uniforms.time = { value: 0.0 };
    this.posVar.material.uniforms.uRotationTexture = { value: this.rotTexture };

    const error = this.gpu.init();
    if (error) {
      throw new Error(error);
    }
  }

  seedTextures() {
    const positionData = this.posTexture.image.data;
    const rotationData = this.rotTexture.image.data;

    // Use BoxBufferGeometry's position to start in
    // the texture
    let posCount = 0;
    let geoPos = this.geometry.getAttribute('position');

    for (let i = 0; i < positionData.length; i += 4) {
      if (i / 4 >= geoPos.count) {
        positionData[i] = positionData[i + 1] = positionData[i + 2] = positionData[i + 3] = 0;
        rotationData[i] = rotationData[i + 1] = rotationData[i + 2] = rotationData[i + 3] = 0;
      } else {

        let u = Math.random() * Math.PI * 1;
        let v = Math.random() * Math.PI * 0.5;
        let theta = u * Math.PI * 2;
        let phi = Math.acos(2 * v - 1);
        let r = (Math.random() * radiusSpread) + radius;
        positionData[i]     = r * Math.sin(theta);
        positionData[i + 1] = 0;//Math.cos(phi)
        positionData[i + 2] = r * Math.cos(theta);
        positionData[i + 3] = 1;
        
        positionData[i] += (Math.random() * 2 - 1) * 2;
        positionData[i+1] += (Math.random() * 2 - 1) * 0.5;
        positionData[i+2] += (Math.random() * 2 - 1) * 2;
        
        rotationData[i] = theta;
        rotationData[i + 1] = phi;
        rotationData[i + 2] = r;
        rotationData[i + 3] = (Math.random() * speedSpread) + speed;
        if (Math.random() < 0.03) {
          rotationData[i + 3] *= 3;
        }
      }
    }
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
    this.material.uniforms.time.value = t;
    this.posVar.material.uniforms.delta.value = delta / 1000;
    this.posVar.material.uniforms.time.value = t / 1000;
  }

  render() {
    this.renderer.clearColor();
    this.gpu.compute();
    this.material.uniforms.tPosition.value = this.gpu.getCurrentRenderTarget(this.posVar).texture;
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
    this.camera.lookAt(this.pivot.position);
    // this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
