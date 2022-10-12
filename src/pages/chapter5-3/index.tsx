/*
 * @Title: your project
 * @Author: huangjitao
 * @Date: 2022-10-12 11:17:18
 * @Description: description of this file
 */
import React from "react";
import { useSize } from "ahooks";
import GUI from "lil-gui";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  axesHelper;

const Chapter5_3 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    /** --- 创建网格模型 --- */
    // 创建一个几何体
    const geometry = new THREE.SphereGeometry(1, 20, 20);
    const material = new THREE.MeshStandardMaterial();
    // 创建一个网格模型对象
    const mesh = new THREE.Mesh(geometry, material);
    // 设置物体投射阴影
    mesh.castShadow = true;
    // 将网格模型对象添加到场景中
    scene.add(mesh);

    // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    // 接收其它物体的阴影
    plane.receiveShadow = true;
    scene.add(plane);

    /** --- 设置光源 --- */
    // 环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const smallBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    smallBall.position.set(2, 2, 2);
    //直线光源
    const pointLight = new THREE.PointLight(0xff0000, 1);
    // pointLight.position.set(2, 2, 2);
    pointLight.castShadow = true;

    // 设置阴影贴图模糊度
    pointLight.shadow.radius = 20;
    // 设置阴影贴图的分辨率
    pointLight.shadow.mapSize.set(512, 512);
    pointLight.decay = 0;

    // 设置透视相机的属性
    smallBall.add(pointLight);
    scene.add(smallBall);

    const panel = new GUI();
    const pointLightPanel = panel.addFolder("点光源");
    pointLightPanel.add(smallBall.position, "x").min(-5).max(5).step(0.1);
    pointLightPanel.add(smallBall.position, "y").min(-5).max(5).step(0.1);
    pointLightPanel.add(smallBall.position, "z").min(-5).max(5).step(0.1);

    /** ---添加坐标辅助--- */
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    /** --- 相机设置 --- */
    // 创建相机
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // 设置相机位置
    camera.position.set(0, 0, 10);
    //设置相机方向(指向的场景对象)
    camera.lookAt(scene.position);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer();
    // 开启场景中的阴影贴图
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    renderer.render(scene, camera);
    ref.current?.appendChild(renderer.domElement); //body元素中插入canvas对象

    /** ---创建轨道控制器--- */
    controls = new OrbitControls(camera, renderer.domElement);

    render();
  };

  const changeSize = () => {
    /** --- 相机设置 --- */
    const width = Number(size?.width); //窗口宽度
    const height = Number(size?.height); //窗口高度

    // 更新摄像头
    camera.aspect = width / height;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //  更新渲染区域尺寸
    renderer.setSize(width, height);
    //  设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  };

  function render() {
    controls.update();
    renderer.render(scene, camera);
    // 渲染下一帧的时候就会调用render函数
    requestAnimationFrame(render);
  }

  const fullScreen = () => {
    const fullScreenElement = document.fullscreenElement;
    if (!fullScreenElement) {
      // 让画布对象全屏
      renderer.domElement.requestFullscreen();
    } else {
      //   退出全屏，使用document对象
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    // 初始化three场景
    initThree();
    window.addEventListener("dblclick", fullScreen);
    return () => {
      window.removeEventListener("dblclick", fullScreen);
    };
  }, []);

  useEffect(() => {
    if (size?.width && size?.height) {
      // 场景大小根据浏览器自适应
      changeSize();
    }
  }, [size?.width, size?.height]);

  return (
    <div
      id="container"
      style={{ width: "100%", height: "100%" }}
      ref={ref}
    ></div>
  );
};

export default Chapter5_3;
