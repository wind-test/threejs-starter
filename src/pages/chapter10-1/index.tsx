/*
 * @Title: webgl绘制
 * @Author: huangjitao
 * @Date: 2022-11-23 11:35:04
 * @Description: 使用webgl绘制一个三角形
 */

import React, { useEffect} from "react";

const Chapter10_1 = () => {
  
  useEffect(() => {
    const canvas = document.getElementById("webgl") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // 创建顶点着色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    // 设置顶点着色器的源码
    gl.shaderSource(
      vertexShader,
      `
      attribute vec4 a_Position;
      void main() {
        gl_Position = a_Position;
      }
    `
    );
    // 编译顶点着色器
    gl.compileShader(vertexShader);

    // 创建片元着色器
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    // 设置片元着色器的源码
    gl.shaderSource(
      fragmentShader,
      `
      void main() {
        gl_FragColor = vec4(1.0, 0, 0, 1.0); 
      }
    `
    );
    // 编译片元着色器
    gl.compileShader(fragmentShader);

    // 创建链接（link）着色器的程序
    const program = gl.createProgram() as WebGLProgram;
    // 将顶点着色器和片元着色器链接到程序上
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接程序
    gl.linkProgram(program);
    // 使用程序
    gl.useProgram(program)

    // 创建顶点缓冲区对象
    const vertexBuffer = gl.createBuffer();
    // 绑定顶点缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 向顶点缓冲区对象写入数据
    const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 获取顶点着色器中a_Position的位置
    const a_Position = gl.getAttribLocation(program, "a_Position");
    // 将顶点缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // 启用顶点着色器中的a_Position变量
    gl.enableVertexAttribArray(a_Position);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <canvas
        id="webgl"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default Chapter10_1;
