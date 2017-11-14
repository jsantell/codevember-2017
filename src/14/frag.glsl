uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;
uniform float uPixelRatio;
varying vec2 vUv;

void main() {
  float stripes = sin(uTime * 0.001)mod(floor(fract(sin(uTime * 0.1 + vUv.y)) * 10.0), 2.0);
  gl_FragColor = vec4(stripes);
}
