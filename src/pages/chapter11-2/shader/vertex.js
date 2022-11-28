const VertexShader = /*glsl*/ `
  precision lowp float;
  attribute vec3 position;
  attribute vec2 uv;

  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;
  uniform float uTime;
  uniform sampler2D uTexture;

  varying vec2 v_Uv;
  varying float v_Elevation;

  void main(){
    v_Uv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05 ;
    modelPosition.z += sin((modelPosition.y + uTime)  * 10.0) * 0.05 ;
    v_Elevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition ;
  }
`;

export default VertexShader;
