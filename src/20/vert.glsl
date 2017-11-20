uniform float rotation;
varying vec2 vUv;

void main() {
  float a = sin(rotation);
  float b = cos(rotation);
  vUv = uv * mat2(b, a, -a, b);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
