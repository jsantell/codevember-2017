uniform float time;
uniform float alpha;
#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
varying vec3 vPosition;
varying float vPower;

void main() {

  float h = fract(time * 0.01 + (vPower * 0.5));
  vec3 hsl = hsl2rgb(h, 0.8, 0.5);
  gl_FragColor = vec4(hsl, alpha);
}
