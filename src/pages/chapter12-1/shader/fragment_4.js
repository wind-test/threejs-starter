const FragmentShader_4 = /*glsl*/ `
  precision lowp float;
  uniform float uTime;
  uniform float uScale;
  varying vec2 vUv; 

  void main(){
    // 利用绝对值
    float strength = abs(vUv.x - 0.5) ;
    gl_FragColor =vec4(strength,strength,strength,1);
  }
`;

export default FragmentShader_4;
