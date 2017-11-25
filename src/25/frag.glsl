uniform float time;
uniform float lightIntensity;
uniform vec3 noiseColor;
uniform sampler2D diffuseMap;

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
  vec3 color = texture2D(diffuseMap, vUv * 0.5 + 0.5).xyz;

  vec3 addedLights = vec3(0.0, 0.0, 0.0);
  for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
    vec3 lightDirection = normalize(pointLights[l].position - vPosition.xyz);
    addedLights += lambert(lightDirection, vNormal);
  }
  vec3 c = (color * 0.1) + (color * addedLights * lightIntensity);
  c += noiseColor * vNoise;
  c += smoothstep(0.5, 1.0, vNoise) * vec3(1.0, 0.0, -1.0)  * 1.0;
  float alpha = smoothstep(0.2, 0.4, vNoise);
  gl_FragColor = vec4(c, alpha);
}
