uniform float time;
uniform sampler2D alphaMap;
varying vec3 vPosition;
uniform vec3 color;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  vec4 tex = texture2D(alphaMap, gl_PointCoord);
  float l = length(vPosition) * 2.0;
  float t = sin(time*2.0) * 2.0;
  float m = map(t+(l), -3.0, 7.0, 0.2, 0.6);
  vec3 hsl = hsl2rgb(m, 0.8, 0.5);
  float alpha = smoothstep(0.1, 0.8, tex.r) * 0.005 * l;//smoothstep(1.0, 2.0, l);
  gl_FragColor = vec4(vec3(1.0), alpha);
}
