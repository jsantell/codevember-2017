uniform float time;
uniform vec3 color;
uniform float noiseThreshold;
uniform sampler2D alphaMap;

varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vNormal;
varying float vNoise;

#pragma glslify: lambert = require(glsl-diffuse-lambert) 
#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {

  float alpha = 1.0 - abs(vNoise - noiseThreshold);
  alpha *= smoothstep(0.4, 0.9, texture2D(alphaMap, gl_PointCoord).r);
  gl_FragColor = vec4(hsl2rgb(map(1.0 - vNoise, 0.0, 1.0, 0.0, 0.1), 0.8, 0.5), alpha);
}
