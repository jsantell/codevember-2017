uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;

#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
#pragma glslify: map = require(glsl-map)
#pragma glslify: easeOut = require(glsl-easings/quadratic-out)

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
  float fl = floor(p);
  float fc = fract(p);
  return mix(rand(fl), rand(fl + 1.0), fc);
}


const float LOOP = 1000.0;
const float LENGTH = 0.1;
const float SPEED = 1.0;
const float MOD = 1.0;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  vec2 pos = st / -2.0 + 1.0;
  float n = noise(gl_FragCoord.x * MOD);

  float elapsed = easeOut(mod((uTime * SPEED) + (LOOP * n), LOOP) * 0.001) * 2.0;
  float color = 0.0;

  if (pos.y > elapsed) {
    if (elapsed + LENGTH > pos.y) {
      color = smoothstep(elapsed - pos.y, elapsed, pos.y);
    }
  }

  gl_FragColor = vec4(vec3(color), 1.0);
}
