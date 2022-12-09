const FragmentShader_5 = /*glsl*/ `
  precision lowp float;
  uniform float uTime;
  uniform float uScale;
  varying vec2 vUv; 

  void main(){
    // 小日本国旗
    float strength = step(0.5,distance(vUv,vec2(0.5))+0.25);
    gl_FragColor =vec4(strength,strength,strength,1);
  }
`;

export default FragmentShader_5;