import {
  BufferGeometry, BufferAttribute,
  Vector3, Vector4,
  Points, Mesh, Object3D,
  ShaderMaterial, AdditiveBlending,
} from 'three';
import GPUComputationRenderer from '../lib/GPUComputationRenderer';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import computePositionShader from './compute-position.glsl';

const vec3Equals = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;

export const DEFAULTS = {
  count: 128.0,
  lifetime: 1000.0,
  startSize: 10,
  endSize: 5,
  startPosition: new Vector3(0.0, 0.0, 0.0),
  startPositionSpread: new Vector3(1.0, 1.0, 1.0),
  startColor: new Vector3(1.0, 0.0, 0.0),
  endColor: new Vector3(0.0, 0.0, 1.0),
  startAlpha: 1.0,
  endAlpha: 0.0,
  alphaMap: null,
  startVelocity: new Vector3(0.0, 1.0, 0.0),
  startVelocitySpread: new Vector3(1.0, 1.0, 1.0),
  endVelocity: new Vector3(0.0, 0.0, 0.0),
};

class Manager {
  constructor(renderer, options={}) {
    this.renderer = renderer;
    this.count = options.count;
    this.startPosition = new Vector3();
    this.startPositionSpread = new Vector3();
    this.startVelocity = new Vector3();
    this.startVelocitySpread = new Vector3();
  
    this.startPosition.copy(options.startPosition);
    this.startPositionSpread.copy(options.startPositionSpread);
    this.startVelocity.copy(options.startVelocity);
    this.startVelocitySpread.copy(options.startVelocitySpread);

    this.material = new ShaderMaterial({
      uniforms: {
        startSize: { value: 0.0 },
        endSize: { value: 0.0 },
        startColor: { value: null },
        endColor: { value: null },
        startAlpha: { value: null },
        endAlpha: { value: null },
        time: { value: 0.0 },
        delta: { value: 0.0 },
        tPosition: { value: null },
        alphaMap: { value: null },
        lifetime: { value: 0.0 },
      },
      blending: AdditiveBlending,
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
    });

    this.textureSize = this.getTextureSize();
    this.createGeometry();
    this.setupGPURenderer();
    this.points = new Points(this.geometry, this.material);
  }

  regenerate() {
    console.log('regenerate');
    this.createGeometry();
    this.setupGPURenderer();
    this.points.geometry = this.geometry;
  }

  getTextureSize() {
    let size = 2;
    while (size < Math.sqrt(this.count)) {
      size *= 2;
    }

    return size;
  }

  createGeometry() {
    this.geometry = new BufferGeometry();

    const width = this.getTextureSize();

    // Create `uv` attribute
    const uvs = new Float32Array(this.count * 2);
    let count = 0;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        uvs[count++] = i / (width - 1);
        uvs[count++] = j / (width - 1);
        if (count === this.count * 2) {
          break;
        }
      }
      if (count === this.count * 2) {
        break;
      }
    }
    this.geometry.addAttribute('uv', new BufferAttribute(uvs, 2));

    const position = new Float32Array(this.count * 3);
    this.geometry.addAttribute('position', new BufferAttribute(position, 3));
  }

  setupGPURenderer() {
    this.gpu = new GPUComputationRenderer(this.textureSize, this.textureSize, this.renderer);
    this.posTexture = this.createDataTexture();
    this.startPosTexture = this.createStartPositionTexture();
    this.startVelTexture = this.createStartVelocityTexture();
    this.posVar = this.gpu.addVariable('tPosition', computePositionShader, this.posTexture);
    this.gpu.setVariableDependencies(this.posVar, [this.posVar]);
    this.posVar.material.uniforms = {
      time: { value: 0 },
      delta: { value: 0 },
      lifetime: { value: 0 },
      endVelocity: { value: null },
      tStartPos: { value: this.startPosTexture },
      tStartVel: { value: this.startVelTexture },
    };

    const error = this.gpu.init();
    if (error) {
      throw new Error(error);
    }
  }

  /**
   * Creates a texture to store a vec4 of
   * x,y,z position and w, that indicates the normalized
   * position of the particle in its journey from
   * start (0) to end (1).
   */
  createDataTexture() {
    const tex = this.gpu.createTexture();

    let posCount = 0;
    const data = tex.image.data;

    for (let i = 0; i < this.count; i++) {
      data[i * 4 + 0] = 0;
      data[i * 4 + 1] = 0;
      data[i * 4 + 2] = 0;
      data[i * 4 + 3] = i / this.count;
    }

    return tex;
  }

  createStartPositionTexture() {
    const tex = this.gpu.createTexture();

    let posCount = 0;
    const data = tex.image.data;

    for (let i = 0; i < this.count; i++) {
      data[i * 4 + 0] = this.startPosition.x + (this.startPositionSpread.x * Math.random()) - (this.startPositionSpread.x * 0.5);
      data[i * 4 + 1] = this.startPosition.y + (this.startPositionSpread.y * Math.random()) - (this.startPositionSpread.y * 0.5);
      data[i * 4 + 2] = this.startPosition.z + (this.startPositionSpread.z * Math.random()) - (this.startPositionSpread.z * 0.5);
    }

    return tex;
  }
  
  createStartVelocityTexture() {
    const tex = this.gpu.createTexture();

    let posCount = 0;
    const data = tex.image.data;

    for (let i = 0; i < this.count; i++) {
      data[i * 4 + 0] = this.startVelocity.x + (this.startVelocitySpread.x * Math.random()) - (this.startVelocitySpread.x * 0.5);
      data[i * 4 + 1] = this.startVelocity.y + (this.startVelocitySpread.y * Math.random()) - (this.startVelocitySpread.y * 0.5);
      data[i * 4 + 2] = this.startVelocity.z + (this.startVelocitySpread.z * Math.random()) - (this.startVelocitySpread.z * 0.5);
    }

    return tex;
  }


  update(time, delta) {
    this.posVar.material.uniforms.delta.value = delta;
    this.posVar.material.uniforms.time.value = time;
    this.material.uniforms.time.value = time;
    this.gpu.compute();
    this.material.uniforms.tPosition.value = this.gpu.getCurrentRenderTarget(this.posVar).texture;
  }
}

export default class ParticleSystem extends Object3D {
  constructor(renderer, options={}) {
    super();
    for (let option of Object.keys(DEFAULTS)) {
      this[option] = option in options ? options[option] : DEFAULTS[option];
    }

    this.system = new Manager(renderer, {
      count: this.count,
      startPosition: this.startPosition,
      startPositionSpread: this.startPositionSpread,
      startVelocity: this.startVelocity,
      startVelocitySpread: this.startVelocitySpread,
    });

    this.add(this.system.points);
    this.needsUpdate = true;
  }

  update(t, delta) {
    if (this.needsUpdate) {
      // Todo check if startPosition[Spread] and startVelocity[Spread] have changed
      if (this.count !== this.system.count ||
        !vec3Equals(this.startPosition, this.system.startPosition) ||
        !vec3Equals(this.startPositionSpread, this.system.startPositionSpread) ||
        !vec3Equals(this.startVelocity, this.system.startVelocity) ||
        !vec3Equals(this.startVelocitySpread, this.system.startVelocitySpread)) {
        this.system.startPosition.copy(this.startPosition);
        this.system.startPositionSpread.copy(this.startPositionSpread);
        this.system.startVelocity.copy(this.startVelocity);
        this.system.startVelocitySpread.copy(this.startVelocitySpread);
        this.system.count = this.count;
        this.system.regenerate();
      }
      this.system.material.uniforms.startSize.value = this.startSize;
      this.system.material.uniforms.endSize.value = this.endSize;
      this.system.material.uniforms.startColor.value = this.startColor;
      this.system.material.uniforms.endColor.value = this.endColor;
      this.system.material.uniforms.startAlpha.value = this.startAlpha;
      this.system.material.uniforms.endAlpha.value = this.endAlpha;
      this.system.material.uniforms.alphaMap.value = this.alphaMap;
      this.system.material.uniforms.lifetime.value = this.lifetime;
      this.system.posVar.material.uniforms.lifetime.value = this.lifetime;
      this.system.posVar.material.uniforms.endVelocity.value = this.endVelocity;
      this.needsUpdate = false;
    }
    this.system.update(t, delta);
  }
}
