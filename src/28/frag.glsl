uniform float time;
uniform float alpha;
uniform sampler2D alphaMap;

varying vec3 vPosition;
varying float vNoise;
varying float vHue;
#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  float pAlpha = smoothstep(0.4, 0.9, texture2D(alphaMap, gl_PointCoord).r);
  gl_FragColor = vec4(hsl2rgb(vHue, 0.8, 0.5), alpha * pAlpha);
}
