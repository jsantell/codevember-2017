uniform float time;
uniform float displacement;
uniform float power;
uniform float scale;
varying float vNoise;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vI;
varying float vR;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
  vUv = uv;
  vNormal = normal;
  vI = normalize(position - cameraPosition);
  // Calculate the angle which we are viewing the normal from
  // the camera, fresnel effect
  // http://kylehalladay.com/blog/tutorial/2014/02/18/Fresnel-Shaders-From-The-Ground-Up.html
  vR = scale * pow(1.0 + dot(vI, normal), power);
  float x = position.x + time * 0.1;
  float y = position.y + time * 0.1;
  float z = position.z * time * 0.1;
  vNoise = snoise3(vec3(x, y, z)) * 0.5 + 0.5;
  float displace = vNoise * displacement;
  vec3 pos = position + normal * displace;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
