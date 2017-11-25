uniform float time;
uniform float noiseThreshold;

varying vec3 vNormal;
varying vec4 vPosition;
varying float vNoise;
varying vec2 vUv;
#pragma glslify: snoise3 = require(glsl-noise/classic/3d)

void main() {
  vUv = uv;
  vNormal = normal;
  float t = sin(fract(time * 0.01) * 3.1415926 * 2.0) * 5.0;
  vec4 pos = modelMatrix * vec4(position, 1.0);
  float x = pos.x + t;
  float y = pos.y - t;
  float z = pos.z + t;

  vNoise = snoise3(vec3(x,y,z)) * 0.5 + 0.5;
  vPosition = pos;
  gl_PointSize = 70.0 * smoothstep(noiseThreshold - 0.5, noiseThreshold + 0.5, vNoise);
  gl_PointSize /= distance(vPosition, vec4(cameraPosition, 1.0));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
