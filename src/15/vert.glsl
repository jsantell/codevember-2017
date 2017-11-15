uniform float time;
uniform float displacement;
uniform float spread;
uniform float triScale;

attribute float offset;
attribute vec3 midpoint;

varying vec2 vUv;
varying vec3 vPosition;
varying float vOffset;


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
  vOffset = offset;

  float amplitude = sin((time*0.5) + offset) * 0.5 + 0.5;
  float rotAmplitude = fract((time * 0.1) + offset) * 3.1415 * 2.0;
  mat4 rotMatrix = rotationMatrix(midpoint, rotAmplitude);
  vec3 p = position;

  p = (rotMatrix * vec4(p, 1.0)).xyz;
  p = mix(p, midpoint, triScale);
  vec3 displaced = p + normal * amplitude * 1.0;//
  vPosition = displaced;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0 );
}
