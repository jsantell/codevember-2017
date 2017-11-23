uniform float time;

varying vec2 vUv;
varying float vNoise;
varying vec3 vNormal;
varying float vR;

#pragma glslify: when_lt = require(glsl-conditionals/when_lt)
#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: map = require(glsl-map)
#pragma glslify: easeIn = require(glsl-easings/quintic-in)
#pragma glslify: easeOut  = require(glsl-easings/quintic-out)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  float t = sin(time * 0.01) * 0.5 + 0.5;
  vec3 color = hsl2rgb(vec3(t * 0.2 + 0.4 + vNoise * 0.1, 0.9 - (vR * 0.2), clamp(0.8 - (vNoise * 0.6), 0.0, 0.6)));
  gl_FragColor = vec4(color, 1.0);
}
