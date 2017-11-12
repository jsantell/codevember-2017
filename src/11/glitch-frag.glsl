uniform float time;
uniform float random;
varying vec2 vUv;
uniform sampler2D tInput;
uniform float rows;
uniform float chance;
uniform float intensity;
uniform float abberations;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

vec3 lerp(vec3 a, vec3 b, float value) {
  return (a + value * (b - a));
}


void main() {
  vec2 groupCoords = floor(vUv * rows) / rows;
  float noise = smoothstep(-1.0, 0.3, snoise3(vec3((groupCoords.y / 10.0), 0.5,
    sin(time * 0.10) / 2.0 + 0.5)));
  //float noise = snoise3(vec3(groupCoords.x/2.0, random*0.1, sin(time * 0.1)));
  float lowProb = 1.0 - step(chance, random);
  float lowProb2 = step(1.0 - chance, random);
  float lowProb3 = 1.0 - step(chance, abs(random - 0.5));
  float medProb = step(chance * 2.0, random);
  float threshold = 1.0 - intensity;
  float noiseProb = step((threshold + 0.01)* 2.0 , abs(noise));
  float line = 1.0 - step(threshold + 0.02, abs(groupCoords.y - noise));
  float column = 1.0 - step(threshold + 0.2, abs(vUv.x - noise));
  float colorDisplacement = step(threshold+0.1, noise) * noise * 1.0;
  float abby = abberations + (0.01 * sin(time * 0.1));
  vec2 displacementCoords = fract(
    vec2(lowProb3 * 0.1 + vUv.x + (noise* line) - column * 0.01,
         vUv.y - lowProb * 0.1 + column * abby)
  );
  vec4 source = texture2D(tInput, vUv);
  vec4 displacement = texture2D(tInput, displacementCoords);

  vec4 color = vec4(source);

  color.rgb = lerp(color.rgb,
    vec3(
      texture2D(tInput, fract(vUv - clamp(lowProb2*0.1 + (cos(time) / 2.0 +0.5) * random* abby*colorDisplacement, 0.0, 0.2))).r,
      displacement.g,
      texture2D(tInput, fract(vUv + clamp((sin(time) / 2.0 +0.5)* vUv.y* abby*colorDisplacement, 0.0, 0.1))).b),
    colorDisplacement);

  // color.r = clamp((lowProb * 3.0) + color.r, 0.0, 1.0);
  gl_FragColor = vec4(color);
}
