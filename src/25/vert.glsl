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
  float t = sin(time * 0.0005) * 100.0;
  float x = position.x * t;
  float y = position.y - t;
  float z = position.z * t;

  vNoise = smoothstep(0.5, 0.9, snoise3(t * (modelViewMatrix * vec4(position, 1.0)).xyz) * 0.5 + 0.5);
  float displace = vNoise * displacement;
  vec3 pos = position + normal * displace;
  vPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * vPosition;
}
