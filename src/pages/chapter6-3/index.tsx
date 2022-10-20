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
import GUI from "lil-gui";

let scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>,
  geometry: THREE.BufferGeometry,
  material: THREE.PointsMaterial

const params = {
  count: 1000, // 粒子个数
  size: 0.02,  // 粒子大小
  radius: 5,  // 银河系半径
  branch: 3,  // 银河系分支书
  spin: 1, // 偏转角度
  randomness: 0.2,  // 随机扩散
  randomnessPower: 3, // 随机扩散幂
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};


const Chapter6_3 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const generateGalaxy = () => {
    if (points) {
      geometry.dispose()
      material.dispose()
      scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)
    for (let i = 0; i < params.count; i++) {
      const radius = Math.random() * params.radius;
      // 根据所在的分支来获取坐标上的角度
      const branchesAngle = ((i % params.branch) / params.branch) * Math.PI * 2;
      // 设置偏转角度，将直线变成曲线
      const spinAngle = radius * params.spin;

      // 设置粒子颜色
      const colorInside = new THREE.Color(params.insideColor)
      const colorOutside = new THREE.Color(params.outsideColor)
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / params.radius)
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
      // 设置粒子的随机扩散
      const randomX = Math.random() ** params.randomnessPower
        * (Math.random() < 0.5 ? 1 : -1)
        * params.randomness
        * radius
      const randomY = Math.random() ** params.randomnessPower
        * (Math.random() < 0.5 ? 1 : -1)
        * params.randomness
        * radius
      const randomZ = Math.random() ** params.randomnessPower
        * (Math.random() < 0.5 ? 1 : -1)
        * params.randomness
        * radius

      positions[i * 3] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
      size: params.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    // 银河系粒子生成
    generateGalaxy();

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
      100
    );
    // 设置相机位置
    camera.position.set(4, 1.8, 4)
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
    controls.enableDamping = true
    controls.zoomSpeed = 0.3

    const gui = new GUI()
    gui.add(controls, 'autoRotate')
    gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
    gui.add(params, 'count', 100, 100000, 100).onFinishChange(generateGalaxy)
    gui.add(params, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy)
    gui.add(params, 'radius', 0.01, 20, 0.01).onFinishChange(generateGalaxy)
    gui.add(params, 'branch', 2, 20, 1).onFinishChange(generateGalaxy)
    gui.add(params, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy)
    gui.add(params, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy)
    gui.add(params, 'randomnessPower', 1, 10, 0.001).onFinishChange(generateGalaxy)
    gui.addColor(params, 'insideColor').onFinishChange(generateGalaxy)
    gui.addColor(params, 'outsideColor').onFinishChange(generateGalaxy)
    gui.close()

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
