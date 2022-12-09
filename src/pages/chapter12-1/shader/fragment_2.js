const FragmentShader_2 = /*glsl*/ `
  precision lowp float;
  uniform float uTime;
  uniform float uScale;
  varying vec2 vUv; 

  void main(){
    // 利用通过取模达到反复效果
    float strength = mod(vUv.y * 10.0 , 1.0) ;
    gl_FragColor = vec4(strength, strength, strength, 1);
  }
`;

export default FragmentShader_2;
