uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;

#pragma glslify: when_lt = require(glsl-conditionals/when_lt)
#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: map = require(glsl-map)
#pragma glslify: easeIn = require(glsl-easings/quintic-in)
#pragma glslify: easeOut  = require(glsl-easings/quintic-out)

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
  float fl = floor(p);
  float fc = fract(p);
  return mix(rand(fl), rand(fl + 1.0), fc);
}

const float PI = 3.141592653589793;
const float LOOP = 1000.0;
const float LENGTH = 0.7;
const float SPEED = 3.0;
const float MOD = 1.0;
const float WAVE_SPEED = 0.001;
const float WAVE_DEPTH = 0.03;
const float COLUMNS = 30.0;
const float ROWS = 30.0;
const float F = 6.0;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  vec2 pos = st / -2.0 + 1.0;
  float x = gl_FragCoord.x; //floor(pos.x * COLUMNS);
  float y = pos.y; // floor(pos.y * ROWS) / ROWS;
  float n = noise(x * MOD);
  float speed = clamp(n, 0.1, 20.0);

  float elapsed = easeIn(mod((uTime * SPEED*speed*0.5) + (LOOP * n), LOOP) * 0.001) * 1.0;
  vec3 color = vec3(0.0);

  float length = map(sin(0.5 * pos.x*F+(uTime * WAVE_SPEED) + x * PI * 2.0 - PI), 0.0, 1.0, LENGTH, LENGTH + WAVE_DEPTH);

  // lines
  float aboveLine = when_lt(y, elapsed + length);
  float belowLine = when_lt(elapsed, y);
  float smooth = smoothstep(elapsed - y, elapsed, y);
  float isLine = aboveLine * belowLine;

  // color
  color = when_lt(0.0, isLine) * vec3(1.0);

  gl_FragColor = vec4(color, 1.0);
}
