/*
 * @Title: 3d物理引擎
 * @Author: huangjitao
 * @Date: 2022-11-14 15:02:40
 * @Description: 使用cannon-es创建物理世界
 */

import React from "react";
import { useSize } from "ahooks";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

let renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera;

const Chapter9_1 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const initThree = () => {
    /** --- 创建一个场景 --- */
    const scene = new THREE.Scene();

    /** --- 设置光源 --- */
    // 环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    //直线光源
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.castShadow = true;
    scene.add(dirLight);

    /** --- 创建球和平面 --- */
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial();
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    scene.add(sphere);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial()
    );
    floor.position.set(0, -5, 0);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    /** --- 创建物理世界 --- */
    const world = new CANNON.World();
    // 仅设置y轴（垂直方向）的重力加速度
    world.gravity.set(0, -9.8, 0);
    // 创建物理小球
    const sphereShape = new CANNON.Sphere(1);
    // 设置物理小球材质
    const sphereWorldMaterial = new CANNON.Material();
    // 创建物理世界的物体
    const sphereBody = new CANNON.Body({
      shape: sphereShape,
      material: sphereWorldMaterial,
      mass: 1, // 小球质量
      position: new CANNON.Vec3(0, 0, 0), // 起始位置和three.js中的小球相同
    });
    world.addBody(sphereBody);

    // 创建物理地面
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    // 设置质量为0时，可以使得地面不动
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    // 地面位置
    floorBody.position.set(0, -5, 0);
    // 旋转地面的位置
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    world.addBody(floorBody);

    /** --- 相机设置 --- */
    // 创建相机
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    // 设置相机位置
    camera.position.set(0, 0, 18);
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
    const controls = new OrbitControls(camera, renderer.domElement);

    const clock = new THREE.Clock();

    function render() {
      let deltaTime = clock.getDelta();
      // 更新物理引擎里世界的物体
      world.step(1 / 120, deltaTime);
      sphere.position.copy(sphereBody.position as any);

      controls.update();
      renderer.render(scene, camera);
      // 渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }
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

  useEffect(() => {
    if (size?.width && size?.height) {
      // 场景大小根据浏览器自适应
      changeSize();
    }
  }, [size?.width, size?.height]);

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
    // window.addEventListener("resize", changeSize);
    return () => {
      window.removeEventListener("dblclick", fullScreen);
      // window.removeEventListener("resize", changeSize);
    };
  }, []);

  return (
    <div
      id="container"
      style={{ width: "100%", height: "100%" }}
      ref={ref}
    ></div>
  );
};

export default Chapter9_1;
