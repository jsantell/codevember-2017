varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 lightPosition;
uniform float exposure;
uniform float decay;
uniform float density;
uniform float weight;
uniform int samples;
const int MAX_SAMPLES = 100;
void main(){
  vec2 texCoord = vUv;
  // Calculate vector from pixel to light source in screen space
  vec2 deltaTextCoord = texCoord - lightPosition;
  // Divide by number of samples and scale by control factor
  deltaTextCoord *= 1.0 / float(samples) * density;
  // Store initial sample
  vec4 color = texture2D(tDiffuse, texCoord);
  // set up illumination decay factor
  float illuminationDecay = 1.0;

  // evaluate the summation for samples number of iterations up to 100
  for(int i=0; i < MAX_SAMPLES; i++){
    // work around for dynamic number of loop iterations
    if(i == samples){
      break;
    }

    // step sample location along ray
    texCoord -= deltaTextCoord;
    // retrieve sample at new location
    vec4 sample = texture2D(tDiffuse, texCoord);
    // apply sample attenuation scale/decay factors
    sample *= illuminationDecay * weight;
    // accumulate combined color
    color += sample;
    // update exponential decay factor
    illuminationDecay *= decay;

  }
  // output final color with a further scale control factor
  gl_FragColor = color * exposure;
}
