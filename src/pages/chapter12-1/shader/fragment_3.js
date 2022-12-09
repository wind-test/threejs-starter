const FragmentShader_3 = /*glsl*/ `
  precision lowp float;
  uniform float uTime;
  uniform float uScale;
  varying vec2 vUv; 

  void main(){
    // 条纹相加
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0));
    strength += step(0.8, mod(vUv.y * 10.0 , 1.0));
    gl_FragColor =vec4(strength, strength, strength, 1);
  }
`;

export default FragmentShader_3;
