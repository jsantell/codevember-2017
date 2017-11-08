uniform float size;
uniform float rms;

void main() {
  //vec3 p = position + (smoothstep(0.2, 0.5, rms) * 0.1 * position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size;
}
