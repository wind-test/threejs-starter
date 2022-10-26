/*
 * @Title: 3d全屏滚动实现页面
 * @Author: huangjitao
 * @Date: 2022-10-25 15:22:12
 * @Description: description of this file
 */

import { useEffect } from "react";
import "./index.css";
import * as THREE from "three";
import * as dat from "lil-gui";

let renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera;

const ScrollFull3d = () => {

  const initThree = () => {
    // Canvas画布
    const canvas = document.querySelector("#mainCanvas") as HTMLCanvasElement;
    // Scene场景
    const scene = new THREE.Scene();
    // 设置相机
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    /**
     * Objects
     */
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial()
    );
    scene.add(cube);

    const directionLight = new THREE.DirectionalLight();
    directionLight.position.set(1.5, 1, 1);
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color("#ffffff"),
      0.2
    );
    scene.add(ambientLight, directionLight);

    const directionLightHelper = new THREE.DirectionalLightHelper(
      directionLight,
      2
    );
    scene.add(directionLightHelper);

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Animations
    const render = () => {
      //
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render();

    const gui = new dat.GUI();
    gui
      .add(directionLightHelper, "visible")
      .name("directionLightHelper visible");
  };

  const changeSize = () => {
    /** --- 相机设置 --- */
    const width = window.innerWidth;
    const height = window.innerHeight;
    // 更新摄像头
    camera.aspect = width / height;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    //  更新渲染区域尺寸
    renderer.setSize(width, height);
    //  设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  };

  useEffect(() => {
    initThree();
    window.addEventListener("resize", changeSize)
    return () => {
      window.removeEventListener("resize", changeSize)
    }
  }, []);

  return (
    <div className="scroll3d">
      <canvas id="mainCanvas" className="webgl"></canvas>
      <section className="section">
        <h1>Hello</h1>
      </section>
      <section className="section">
        <h2>My projects</h2>
      </section>
      <section className="section">
        <h2>Contact me</h2>
      </section>
    </div>
  );
};

export default ScrollFull3d;
