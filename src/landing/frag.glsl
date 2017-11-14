uniform sampler2D alphaMap;
uniform vec3 color;
uniform float colorSpeed;
uniform float time;

varying vec3 vPosition;
varying float vAlphaOffset;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  vec4 tex = texture2D(alphaMap, gl_PointCoord);
  float l = clamp(length(vPosition) / 16.0, 0.0, 0.5);
  float t = fract(l +  (time * colorSpeed * 0.001));
  float m = t;//map(t, 0.0, 1.0, 0.3, 0.8);
  vec3 hsl = hsl2rgb(m, 0.8, 0.5);
  float alpha = smoothstep(0.1, 0.9, tex.r) * vAlphaOffset;
  gl_FragColor = vec4(hsl, alpha);
}
