/*
 * @Title: three.js快速上手第一个项目
 * @Author: huangjitao
 * @Date: 2022-09-07 16:31:50
 * @Description: description of this file
 */

import { useSize } from "ahooks";
import { useEffect, useRef } from "react";
import * as THREE from "three";

let scene: THREE.Scene | THREE.Object3D<THREE.Event>, renderer: THREE.WebGLRenderer, camera: THREE.Camera

const Chapter1_2 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene()

    /** --- 创建一个网格模型 --- */
    // 创建一个几何体
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    // 创建一个材质对象
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    // 创建一个网格模型对象
    const mesh = new THREE.Mesh(geometry, material)
    // 将网格模型对象添加到场景中
    scene.add(mesh)

    /** --- 设置光源 --- */
    // 点光源
    const point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300);
    scene.add(point); //点光源添加到场景中
    //环境光
    const ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer();
    ref.current?.appendChild(renderer.domElement); //body元素中插入canvas对象
  }

  const changeSize = () => {
    /** --- 相机设置 --- */
    const width = Number(size?.width); //窗口宽度
    const height = Number(size?.height); //窗口高度
    const k = width / height; //窗口宽高比
    const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    // 创建相机
    camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(200, 300, 200); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

    /** --- 渲染器设置 ---*/
    renderer.setSize(width, height);//设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    //执行渲染操作   指定场景、相机作为参数
    renderer.render(scene, camera);
  }

  useEffect(() => {
    // 初始化three场景
    initThree()
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

export default Chapter1_2
