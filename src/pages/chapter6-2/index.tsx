/*
 * @Title: 自定义点材质
 * @Author: huangjitao
 * @Date: 2022-10-19 11:21:41
 * @Description: 自定义一个漫天飞舞的雪花
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
  controls: OrbitControls

const Chapter6_2 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const createPoints = (url: string, size = 0.5) => {
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 10000;

    // 设置缓冲区数组
    const positions = new Float32Array(count * 3);
    // 设置粒子顶点颜色
    const colors = new Float32Array(count * 3);
    // 设置顶点
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
      colors[i] = Math.random();
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 设置点材质
    const pointsMaterial = new THREE.PointsMaterial();
    pointsMaterial.size = 0.5;
    pointsMaterial.color.set(0xfff000);
    // 相机深度而衰减
    pointsMaterial.sizeAttenuation = true;

    // 载入纹理
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(url);
    // 设置点材质纹理
    pointsMaterial.map = texture;
    pointsMaterial.alphaMap = texture;
    pointsMaterial.transparent = true;
    pointsMaterial.depthWrite = false;
    pointsMaterial.blending = THREE.AdditiveBlending;
    // 设置启动顶点颜色
    pointsMaterial.vertexColors = true;

    const points = new THREE.Points(particlesGeometry, pointsMaterial);
    return points;
  }

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    const points_1 = createPoints(`/textures/particles/1.png`, 1.5);
    const points_2 = createPoints(`/textures/particles/1.png`, 1);
    const points_3 = createPoints(`/textures/particles/xh.png`, 2);
    scene.add(points_1)
    scene.add(points_2)
    scene.add(points_3)

    /** --- 设置光源 --- */
    // 环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    //直线光源
    const pointLight = new THREE.PointLight(0xff0000, 1);
    pointLight.castShadow = true;
    // 设置阴影贴图模糊度
    pointLight.shadow.radius = 20;
    // 设置阴影贴图的分辨率
    pointLight.shadow.mapSize.set(512, 512);
    pointLight.decay = 0;

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

export default Chapter6_2;
