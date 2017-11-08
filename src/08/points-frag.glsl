uniform sampler2D sprite;
uniform vec3 color;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  vec4 tex = texture2D(sprite, gl_PointCoord);
  float alpha = smoothstep(0.1, 0.9, tex.r);
  gl_FragColor = vec4(color, alpha);
}
