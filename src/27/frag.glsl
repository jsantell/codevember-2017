uniform float time;
uniform sampler2D alphaMap;
uniform vec3 startColor;
uniform vec3 endColor;
uniform float startAlpha;
uniform float endAlpha;
uniform sampler2D tPosition;

varying float vElapsed;
varying vec3 vPosition;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  float alpha = texture2D(alphaMap, gl_PointCoord).x;
  alpha *= mix(startAlpha, endAlpha, vElapsed);
  vec3 color = mix(startColor, endColor, vElapsed);
  gl_FragColor = vec4(color, alpha);
}
