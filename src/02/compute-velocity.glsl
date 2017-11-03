uniform float time;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: when_gt = require(glsl-conditionals/when_gt)

const float max = 3.0;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(tPosition, uv).xyz;
  vec4 tmpVel = texture2D(tVelocity, uv);
  vec3 vel = tmpVel.xyz;
  float mass = tmpVel.w;

  // decay
  vel *= 0.99;

  float mod = cos(time * 0.0001) + 2.0 + mass;
  float rand = vel.x;
  vel += -pos * -0.050 * snoise3(vec3(pos.x,pos.y,pos.z)*mod);

  float outOfBounds = when_gt(length(pos), max);
  vel = (outOfBounds * -pos * 0.15) + ((1.0 - outOfBounds) * vel);

  gl_FragColor = vec4(vel, mass);
}
