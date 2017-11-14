
attribute vec2 barycentric;

varying vec2 vBC;
varying vec3 vPosition;
varying vec3 wPosition;

void main() {
  vBC = barycentric;
  vPosition = position;
  wPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
