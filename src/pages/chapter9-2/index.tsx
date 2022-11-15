/*
 * @Title: 物体之间的相互作用力
 * @Author: huangjitao
 * @Date: 2022-11-15 10:01:08
 * @Description: 创建一个具有物理效果的真实世界
 */

import React from "react";
import { useSize } from "ahooks";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

let renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  cubeArr: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

const Chapter9_2 = () => {
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

    // 创建物理世界
    const world = new CANNON.World();
    // 仅设置y轴（垂直方向）的重力加速度
    world.gravity.set(0, -9.8, 0);
    // 创建击打声音
    const hitSound = new Audio("/audio/metal_hit.mp3");
    // 设置物理立方体材质
    const cubeWorldMaterial = new CANNON.Material("sphere");

    const createCube = () => {
      // 创建立方体
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshStandardMaterial();
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;
      scene.add(cube);

      // 创建物理立方体
      const cubeShape = new CANNON.Sphere(1);
      // 创建物理世界的物体
      const cubeBody = new CANNON.Body({
        shape: cubeShape,
        material: cubeWorldMaterial,
        mass: 1,
        position: new CANNON.Vec3(0, 0, 0),
      });
      cubeBody.applyLocalForce(
        new CANNON.Vec3(300, 0, 0), //添加的力的大小和方向
        new CANNON.Vec3(0, 0, 0) //施加的力所在的位置
      );
      world.addBody(cubeBody);

      // 添加监听碰撞事件
      const HitEvent = (e: any) => {
        // 获取碰撞的强度
        const impactStrength = e.contact.getImpactVelocityAlongNormal();
        console.log(impactStrength);
        if (impactStrength > 2) {
          //   重新从零开始播放
          hitSound.currentTime = 0;
          hitSound.volume = impactStrength / 12;
          hitSound.play();
        }
      };
      cubeBody.addEventListener("collide", HitEvent);

      cubeArr.push({
        mesh: cube,
        body: cubeBody,
      });
    };

    window.addEventListener("click", createCube);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial()
    );
    floor.position.set(0, -5, 0);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 创建物理地面
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    // 设置物理地面材质
    const floorMaterial = new CANNON.Material("floor");
    floorBody.material = floorMaterial;
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

    // 设置立方体和地面材质的碰撞参数
    const defaultContactMaterial = new CANNON.ContactMaterial(
      cubeWorldMaterial,
      floorMaterial,
      {
        friction: 0.1, // 设置摩擦力
        restitution: 0.7, // 设置弹力
      }
    );
    world.addContactMaterial(defaultContactMaterial);
    // 设置世界碰撞的默认材料，如果材料没有设置，都用这个
    world.defaultContactMaterial = defaultContactMaterial;


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
      // 更新物理引擎里世界的物体
      cubeArr.forEach((item) => {
        item.mesh.position.copy(item.body.position as any);
        // 设置渲染的物体跟随物理的物体旋转
        item.mesh.quaternion.copy(item.body.quaternion as any);
      });

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
    return () => {
      window.removeEventListener("dblclick", fullScreen);
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

export default Chapter9_2;
