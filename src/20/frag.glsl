#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
uniform sampler2D alphaMap;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(alphaMap, vUv * 0.5 + 0.5);
  gl_FragColor = vec4(vec3(0.0), 1.0 - color.r);
}
