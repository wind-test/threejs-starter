import React from 'react';

/*
 * @Title: three.js的动画
 * @Author: huangjitao
 * @Date: 2022-09-14 17:27:20
 * @Description: 轨道控制器、移动、翻转、缩放等
 */
import { useSize } from "ahooks";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene: THREE.Scene | THREE.Object3D<THREE.Event>, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera,
  controls: OrbitControls, axesHelper, clock: THREE.Clock, mesh: THREE.Mesh

const Chapter2_2 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene()

    /** --- 创建一个网格模型 --- */
    // 创建一个几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 创建一个材质对象
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    // 创建一个网格模型对象
    mesh = new THREE.Mesh(geometry, material)
    // 将网格模型对象添加到场景中
    scene.add(mesh)

    /** --- 设置光源 --- */
    // 点光源
    const point = new THREE.PointLight(0xffffff);
    point.position.set(4, 2, 3);
    scene.add(point); //点光源添加到场景中
    //环境光
    const ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

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
    camera.position.set(0, 0, 5);
    //设置相机方向(指向的场景对象)
    camera.lookAt(scene.position);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    renderer.render(scene, camera);
    ref.current?.appendChild(renderer.domElement); //body元素中插入canvas对象

    /** ---创建轨道控制器--- */
    controls = new OrbitControls(camera, renderer.domElement);

    /** ---创建时钟--- */
    clock = new THREE.Clock();
    clock.start();

    /** ---渲染--- */
    render();
  }

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
  }

  function render() {
    controls.update();
    const time = clock.getElapsedTime()
    const offSet = time % 5;
    mesh.position.x = offSet
    mesh.position.y = offSet
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
  }

  useEffect(() => {
    // 初始化three场景
    initThree()
    // 添加双击时间
    window.addEventListener("dblclick", fullScreen);
    return () => {
      window.removeEventListener('dblclick', fullScreen)
    }
  }, [])

  useEffect(() => {
    if (size?.width && size?.height) {
      // 场景大小根据浏览器自适应
      changeSize()
    }
  }, [size?.width, size?.height])

  return (
    <div
      id="container"
      style={{ width: '100%', height: '100%' }}
      ref={ref}
    />
  );
}

export default Chapter2_2
