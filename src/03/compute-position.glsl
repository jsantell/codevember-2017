uniform float delta;
uniform float time;
uniform sampler2D uRotationTexture;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#define PI 3.141592653589293264626

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

const float dampen = 0.01;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(tPosition, uv).xyz;
  vec4 rot = texture2D(uRotationTexture, uv);
  float theta = rot.x;
  float phi = rot.y;
  float radius = rot.z;
  float speed = rot.w;

  float x = pos.x;
  float y = pos.y;
  float z = pos.z;

  float rando = rand(vec2(x, z)) * 0.1;

  theta = mod(theta + (speed * time * dampen), PI * 2.0);
  x = radius * sin(theta);
//  y = snoise3(pos * time * dampen) + (0.21 * y);
  z = radius * cos(theta);
  gl_FragColor = vec4(x, y, z, 1.0);
  // gl_FragColor = vec4(pos, 1.0);
}
