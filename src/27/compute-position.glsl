uniform float delta;
uniform float time;
uniform float lifetime;
uniform sampler2D tStartPos;
uniform sampler2D tStartVel;
uniform vec3 endVelocity;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#define PI 3.141592653589293264626

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 texData = texture2D(tPosition, uv);
  vec3 startVelocity = texture2D(tStartVel, uv).xyz;
  vec3 position = texData.xyz;
  float offset = texData.w;

  // Hacky way of seeing if this individual particle needs to restart,
  // should store previous elapsed time in a texture
  float prevGlobalProgress = mod(time - delta, lifetime) / lifetime;
  float globalProgress = mod(time, lifetime) / lifetime;
  float prevElapsed = fract(prevGlobalProgress + offset);
  float elapsed = fract(globalProgress + offset);

  if (prevElapsed > elapsed) {
    position = texture2D(tStartPos, uv).xyz;
  }

  vec3 velocity = mix(startVelocity, endVelocity, elapsed);
  vec3 newPosition = position.xyz + (delta / 1000.0 * velocity);

  gl_FragColor = vec4(newPosition, offset);
}
