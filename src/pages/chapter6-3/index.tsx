/*
 * @Title: 点材质应用
 * @Author: huangjitao
 * @Date: 2022-10-19 11:21:41
 * @Description: 使用数学知识建立银河系
 */

import React from "react";
import { useSize } from "ahooks";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls

const params = {
  count: 10000,
  size: 0.1,
  radius: 5,
  branch: 3,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
};


const Chapter6_3 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const generateGalaxy = () => {
    const textureLoader = new THREE.TextureLoader();
    const particlesTexture = textureLoader.load("/textures/particles/1.png");
    const centerColor = new THREE.Color(params.color);
    const endColor = new THREE.Color(params.endColor);
    // 生成顶点
    const geometry = new THREE.BufferGeometry();
    //   随机生成位置集合
    const positions = new Float32Array(params.count * 3);
    // 设置顶点颜色
    const colors = new Float32Array(params.count * 3);

    //   循环生成点
    for (let i = 0; i < params.count; i++) {
      //   当前的点应该在哪一条分支的角度上
      const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);

      // 当前点距离圆心的距离
      const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
      const current = i * 3;

      const randomX =
        (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
      const randomY =
        (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
      const randomZ =
        (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

      positions[current] =
        Math.cos(branchAngel + distance * params.rotateScale) * distance +
        randomX;
      positions[current + 1] = 0 + randomY;
      positions[current + 2] =
        Math.sin(branchAngel + distance * params.rotateScale) * distance +
        randomZ;

      // 混合颜色，形成渐变色
      const mixColor = centerColor.clone();
      mixColor.lerp(endColor, distance / params.radius);

      colors[current] = mixColor.r;
      colors[current + 1] = mixColor.g;
      colors[current + 2] = mixColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    //   设置点材质
    const material = new THREE.PointsMaterial({
      // color: new THREE.Color(params.color),
      size: params.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: particlesTexture,
      alphaMap: particlesTexture,
      transparent: true,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    return points
  };

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    /** --- 设置光源 --- */
    // 环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const points = generateGalaxy()
    scene.add(points)

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

export default Chapter6_3;
