/*
 * @Title: 光线投射
 * @Author: huangjitao
 * @Date: 2022-10-21 10:39:11
 * @Description: 光线投射 Raycaster 的使用
 */

import React, { PointerEvent } from "react";
import { useSize } from "ahooks";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  cubeArr: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = [],
  rayCaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  redMaterial: THREE.MeshBasicMaterial,
  material: THREE.MeshBasicMaterial


const Chapter7_1 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ wireframe: true });
    redMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' })
    // 创建立方体
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 5; k++) {
          const cube = new THREE.Mesh(boxGeometry, material)
          cube.position.set(i, j, k)
          scene.add(cube)
          cubeArr.push(cube)
        }
      }
    }

    // 创建光线投射
    rayCaster = new THREE.Raycaster();
    // 创建鼠标位置对象
    mouse = new THREE.Vector2();

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
      300
    );
    // 设置相机位置
    camera.position.set(0, 0, 20);
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

  const mouseClick = (event: any) => {
    const width = Number(size?.width); //窗口宽度
    const height = Number(size?.height); //窗口高度
    mouse.x = (event.offsetX / width) * 2 - 1;
    mouse.y = -((event.offsetY / height) * 2 - 1);
    rayCaster.setFromCamera(mouse, camera);
    let result = rayCaster.intersectObjects(cubeArr);
    result.forEach((item: any) => {
      item.object.material = redMaterial
    });
    if (result.length === 0) {
      cubeArr.forEach((item: any) => {
        item.material = material
      });
    }
  }

  useEffect(() => {
    if (size?.width && size?.height) {
      // 场景大小根据浏览器自适应
      changeSize();
    }
    window.addEventListener("click", mouseClick)
    return () => {
      window.removeEventListener("click", mouseClick)
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

export default Chapter7_1;
