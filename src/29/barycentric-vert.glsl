uniform float time;
uniform float noiseMod;
uniform float posDampen;
varying vec3 vPosition;
varying float vNoise;
varying vec2 vBC;
#pragma glslify: snoise3 = require(glsl-noise/classic/3d)
#pragma glslify: ease = require(glsl-easings/quadratic-out) 
attribute vec2 barycentric;

void main() {
  vBC = barycentric;
  float t = time + 20.0;
  vNoise = snoise3(noiseMod * t * vec3(position.x, position.y, 3.0 * position.z+100.0) * 0.5 + 0.5);
  vPosition = position + (vec3(-position.x, -position.y, 0.0) * vNoise * posDampen);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
