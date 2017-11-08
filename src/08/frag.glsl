#extension GL_OES_standard_derivatives : enable

uniform vec3 color;
uniform vec3 wireframeColor;
uniform float rms;
varying vec3 vBC;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
float edgeFactor(vec3 bc){
  vec3 d = fwidth(bc);
  vec3 a3 = smoothstep(vec3(0.0), d*1.5, bc);
  return min(min(a3.x, a3.y), a3.z);
}

void main() {
  vec3 c = mix(wireframeColor, color, edgeFactor(vBC));
  gl_FragColor = vec4(c, 1.0);
}
