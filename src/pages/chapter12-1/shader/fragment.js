const FragmentShader = /*glsl*/ `
  precision lowp float;
  varying vec2 v_Uv;
  varying float v_Elevation;

  uniform sampler2D uTexture; 

  void main(){
      // 不使用材质，制作波浪效果
      // gl_FragColor = vec4(v_Uv, 0.0, 1.0);
      // float height = v_Elevation + 0.05 * 10.0;
      // gl_FragColor = vec4(1.0 * height, 0.0, 0.0, 1.0);

      // 使用材质，制作旗帜飘扬效果
      float height = v_Elevation + 0.05 * 20.0;
      vec4 textureColor = texture2D(uTexture, v_Uv);
      textureColor.rgb *= height;
      gl_FragColor = textureColor;
  }
`;

export default FragmentShader;
