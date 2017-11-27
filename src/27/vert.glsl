uniform float time;
uniform float lifetime;
uniform float startSize;
uniform float endSize;
uniform sampler2D tPosition;

varying float vElapsed;

void main() {
  vec4 texData = texture2D(tPosition, uv);
  vec3 pos = texData.xyz;
  float offset = texData.w;
  // Should pass this in via texture lookup from compute shader
  vElapsed = fract(mod(time, lifetime) / lifetime + offset);
  gl_PointSize = mix(startSize, endSize, vElapsed);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
