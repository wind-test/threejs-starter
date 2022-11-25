/*
 * @Title: webgl动画
 * @Author: huangjitao
 * @Date: 2022-11-24 10:28:47
 * @Description: 使用webgl绘制三角形缩放动画
 */

import React, { useEffect } from "react";

const Chapter10_2 = () => {
  useEffect(() => {
    const canvas = document.getElementById("webgl") as HTMLCanvasElement;
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // 创建顶点着色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    // 设置顶点着色器的源码
    gl.shaderSource(
      vertexShader,
      `
      attribute vec4 a_Position;
      uniform mat4 u_Mat;
      varying vec4 v_Color;
      void main() {
        gl_Position = u_Mat * a_Position;
        v_Color = gl_Position;
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
      precision mediump float;
      varying vec4 v_Color;
      void main() {
        gl_FragColor = v_Color; 
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
    gl.useProgram(program);

    // 创建顶点缓冲区对象
    const vertexBuffer = gl.createBuffer();
    // 绑定顶点缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 向顶点缓冲区对象写入数据
    const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 获取顶点着色器中a_Position的位置
    const a_Position = gl.getAttribLocation(program, "a_Position");
    // 将顶点缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // 启用顶点着色器中的a_Position变量
    gl.enableVertexAttribArray(a_Position);

    // 绘制三角形缩放动画
    const scale = {
      x: 1.5,
      y: 1.5,
      z: 1.5,
    };
    function animate() {
      if (scale.x <= -1.5) {
        scale.x = 1.5
      } else {
        scale.x -= 0.01
      }
      const mat = new Float32Array([
        scale.x, 0.0, 0.0, 0.0,
        0.0, scale.x, 0.0, 0.0,
        0.0, 0.0, scale.x, 0.0,
        0.0, 0.0, 0.0, 1.0,
      ]);
      const u_Mat = gl.getUniformLocation(program, 'u_Mat');
      gl.uniformMatrix4fv(u_Mat, false, mat);
      // 绘制三角形
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <canvas id="webgl" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Chapter10_2;
