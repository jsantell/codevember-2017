uniform float time;
uniform float displacement;
uniform float spread;

attribute float offset;
attribute vec3 midpoint;
attribute vec3 rotatepoint;

varying vec2 vUv;
varying vec3 vPosition;
varying float vPower;

#pragma glslify: map = require(glsl-map)

const float PI = 3.1415926;
const float MIN_DISTANCE = 0.4;
mat4 rotationMatrix(vec3 axis, float angle)
{
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                                0.0,                                0.0,                                1.0);
}

void main() {
  vUv = uv;
  // Wave fluctuates from -2.5 to 2.5
  float wave = sin(time * 0.5) * 2.2;
  
  float distance = clamp(abs(wave - position.y), 0.0, MIN_DISTANCE);
  float power = map(MIN_DISTANCE - distance, 0.0, MIN_DISTANCE, 0.0, 1.0);
  float rotAmplitude = 5.0 * PI * power;
  vPower = power;

  vec3 axis = cross(midpoint - rotatepoint, normal);
  mat4 rotMatrix = rotationMatrix(axis, rotAmplitude);

  // Rotate
  vec3 p = (rotMatrix * vec4(position - midpoint, 1.0)).xyz;
  // Translate back
  p = midpoint + p;

  // Apply scaling of tri
  p = mix(midpoint, p, 1.0 - clamp(power, 0.1, 0.9));
  vec3 displaced = p + normal * power * 0.03;//
  vPosition = displaced;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0 );
}
