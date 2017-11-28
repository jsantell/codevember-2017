uniform float time;
uniform float size;
uniform float dpr;
uniform float noiseMod;
uniform float posDampen;
uniform float maxDistance;
varying vec3 vPosition;
varying float vNoise;
varying float vHue;
#pragma glslify: snoise3 = require(glsl-noise/classic/3d)
#pragma glslify: ease = require(glsl-easings/quadratic-out) 

void main() {
  float t = time + 20.0;
  vNoise = snoise3(noiseMod * t * vec3(position.x, position.y, 3.0 * position.z+100.0) * 0.5 + 0.5);
  vPosition = position + (vec3(-position.x, -position.y, 0.0) * vNoise * posDampen);
  vHue = (-vPosition.z / maxDistance * 0.5) + fract(time * 0.5);
  gl_PointSize = size / dpr / distance(vPosition, cameraPosition);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
