#extension GL_OES_standard_derivatives : enable

precision highp float;
precision highp int;

uniform float width;
uniform vec3 color;
uniform float alpha;
uniform vec3 wireframeColor;
uniform float wireframeAlpha;
varying vec2 vBC;
varying vec3 vPosition;
varying vec3 wPosition;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

float gridFactor (vec2 vBC, float w) {
  vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);
  vec3 d = fwidth(bary);
  vec3 a3 = smoothstep(d * (w - 0.5), d * (w + 0.5), bary);
  return min(min(a3.x, a3.y), a3.z);
}

void main() {
  float factor = gridFactor(vBC, width);
  float a = mix(wireframeAlpha, alpha, factor);
  float l = length(vPosition);
  float wl = length(wPosition);
  float h = map(wl, 0.0, 5.0, 0.3, 0.8);
  h = vPosition.x * 0.5 + h;
  float s = map(vPosition.y, -1.0, 1.0, 0.5, 1.0);
//  vec3 c = hsl2rgb(h, abs(vPosition.z)*2.0, 0.5);
  vec3 c = hsl2rgb(h, s, 0.5);
  gl_FragColor = vec4(c, a);
}
