uniform float twinkleSpeed;
uniform float twinkleOffset;
uniform float size;
uniform float time;

attribute float offset;

varying vec3 vPosition;
varying float vAlphaOffset;

void main() {
  vAlphaOffset = sin((time * twinkleSpeed) + offset * twinkleOffset) * 0.5 + 0.5;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * length(modelViewMatrix * vec4(position, 1.0)) / 4.0;
}
