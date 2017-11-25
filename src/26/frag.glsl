uniform float time;
uniform float lightIntensity;
uniform float ambient;
uniform float noiseThreshold;
uniform sampler2D diffuseMap;
uniform vec3 noiseColor;

varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vNormal;
varying float vNoise;

struct PointLight {
  vec3 color;
  vec3 position; // light position, in camera coordinates
  float distance; // used for attenuation purposes
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];

#pragma glslify: lambert = require(glsl-diffuse-lambert) 
#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  // via https://csantosbh.wordpress.com/2014/01/09/custom-shaders-with-three-js-uniforms-textures-and-lighting/
  vec3 color = texture2D(diffuseMap, vUv).xyz;

  vec3 addedLights = vec3(0.0, 0.0, 0.0);
  for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
    vec3 lightDirection = normalize(pointLights[l].position - vPosition.xyz);
    addedLights += lambert(lightDirection, vNormal);
  }
  vec3 c = (color * ambient) + (color * addedLights * lightIntensity);
  c += noiseColor * smoothstep(noiseThreshold-0.1, noiseThreshold + 0.05, vNoise);
  float alpha = 1.0 - smoothstep(noiseThreshold, noiseThreshold + 0.05, vNoise);
  gl_FragColor = vec4(c, alpha);
}
