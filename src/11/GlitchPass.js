'use strict';

import Pass from '@alex_toudic/wagner/src/Pass';
import vertex from './glitch-vert.glsl';
import fragment from './glitch-frag.glsl';

export default class GlitchPass extends Pass {
  constructor() {
    super();
    this.params = {}
    this.params.intensity = 1.0;
    this.params.abberations = 0.01;
    this.params.chance = 0.05;
    this.setShader(vertex, fragment);
    this.tick = 0;
  }

  run(composer) {
    this.tick++;
    this.shader.uniforms.intensity.value = this.params.intensity;
    this.shader.uniforms.abberations.value = this.params.abberations;
    this.shader.uniforms.chance.value = this.params.chance;
    this.shader.uniforms.random.value = Math.random();
    this.shader.uniforms.rows.value = Math.floor(Math.random() * 100);
    composer.pass(this.shader);
  }
}
