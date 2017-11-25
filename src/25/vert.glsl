uniform float time;
uniform float displacement;

varying vec3 vNormal;
varying vec4 vPosition;
varying float vNoise;
varying vec2 vUv;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
  vUv = uv;
  vNormal = normal;
  float t = sin(fract(time * 0.0001) * 3.1415926 * 2.0) * 300.0;

  vec4 p = modelViewMatrix * vec4(position, 1.0);
  float x = p.x / t;
  float y = p.y - t;
  float z = p.z * t;

  //vNoise = smoothstep(0.5, 0.9, snoise3(t * vec3(x,y,z)) * 0.5 + 0.5);
  vNoise = snoise3(vec3(x,y,z)) * 0.5 + 0.5;
  float displace = smoothstep(0.5, 0.9, vNoise) * displacement;
  vec3 pos = position + normal * displace;
  vPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * vPosition;
}
