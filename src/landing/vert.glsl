uniform float size;
varying vec3 vPosition;

void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * length(modelViewMatrix * vec4(position, 1.0)) / 4.0;
}
