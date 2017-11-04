uniform float time;

varying vec3 vPosition;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  float l = length(vPosition);
  float t = clamp(-1.0, 1.0, sin(time*0.1)) * 1.5;
  float m = map(t+(l*2.0), -1.5, 6.0, 0.45, 0.70);
  vec3 hsl = hsl2rgb(m, 0.8, 0.5);
  float alpha = clamp(0.0, 1.0, l) * 0.1;
  gl_FragColor = vec4(hsl, alpha);
}
