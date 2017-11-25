uniform float time;
uniform sampler2D bumpMap;
uniform float bumpPower;
varying vec3 vNormal;
varying vec4 vPosition;
varying float vNoise;
varying vec2 vUv;
#pragma glslify: snoise3 = require(glsl-noise/classic/3d)

void main() {
  vec3 bump = texture2D(bumpMap, uv).xyz;
  vUv = uv;
  vNormal = (modelViewMatrix * vec4(normal, 1.0)).xyz;
  float t = sin(fract(time * 0.01) * 3.1415926 * 2.0) * 5.0;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  float x = worldPos.x + t;
  float y = worldPos.y - t;
  float z = worldPos.z + t;

  //vNoise = smoothstep(0.5, 0.9, snoise3(t * vec3(x,y,z)) * 0.5 + 0.5);
  vNoise = snoise3(vec3(x,y,z)) * 0.5 + 0.5;
  vPosition = modelViewMatrix * vec4(position, 1.0);//worldPos;
  vec4 bumpedPosition = vec4(position + (normal * bump.x * bumpPower), 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * bumpedPosition;
}
