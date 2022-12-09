const FragmentShader_1 = /*glsl*/ `
  precision lowp float;
  uniform float uTime;
  uniform float uScale;
  varying vec2 vUv; 

  void main(){
    // 通过顶点对应的uv，决定每一个像素在uv图像的位置，通过这个位置x,y决定颜色
    gl_FragColor = vec4(vUv,0,1) ;
  }
`;

export default FragmentShader_1;
