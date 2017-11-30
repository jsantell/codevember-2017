uniform float time;
uniform float alpha;
uniform sampler2D alphaMap;

varying vec3 vPosition;
varying float vNoise;
varying float vHue;
#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  float pAlpha = smoothstep(0.1, 0.9, texture2D(alphaMap, gl_PointCoord).r);
  gl_FragColor = vec4(vec3(0.5), alpha * pAlpha);
}
