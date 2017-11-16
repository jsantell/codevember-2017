#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
varying vec3 vPosition;
uniform float time;

void main() {

  float l = length(vPosition);
  float h = map(l, 0.0, 2.0, 0.0, 1.0);//+ fract(time * 0.1);
  float s = map(abs(vPosition.x), 0.0, 0.5, 0.5, 0.8);
  vec3 hsl = hsl2rgb(mod(h + fract(time*0.1), 1.0), 0.8, 0.5);
  gl_FragColor = vec4(hsl, 0.8);
}
