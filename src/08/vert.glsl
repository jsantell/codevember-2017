uniform float size;
varying vec3 vBC;
attribute vec3 barycentric;

void main() {
  vBC = barycentric;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
