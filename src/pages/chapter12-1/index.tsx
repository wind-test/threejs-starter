/*
 * @Title: 着色器材质
 * @Author: huangjitao
 * @Date: 2022-11-28 10:08:07
 * @Description: 结合Three.js和着色器语言，使用着色器材质（ShaderMaterial）创建平面
 */

import { useSize } from "ahooks";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import VertexShader from './shader/vertex';
import GUI from "lil-gui";
import FragmentShader_1 from './shader/fragment_1';
import FragmentShader_2 from './shader/fragment_2';
import FragmentShader_3 from "./shader/fragment_3";
import FragmentShader_4 from "./shader/fragment_4";
import FragmentShader_5 from "./shader/fragment_5";
import FragmentShader_6 from "./shader/fragment_6";

let scene: THREE.Scene | THREE.Object3D<THREE.Event>,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera

const Chapter12_1 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    // 创建纹理加载器对象
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/textures/flag_paralympic.jpeg");

    const params = {
      uFrequency: 10,
      uScale: 0.1,
    };

    /** --- 创建一个网格模型 --- */
    // 创建一个几何体
    const geometry = new THREE.PlaneGeometry(1, 1, 64, 64)
    // 创建一个材质对象
    const ShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: VertexShader,
      fragmentShader: FragmentShader_1,
      uniforms: {
        uColor: {
          value: new THREE.Color("purple"),
        },
        // 波浪的频率
        uFrequency: {
          value: params.uFrequency,
        },
        // 波浪的幅度
        uScale: {
          value: params.uScale,
        },
        // 动画时间
        uTime: {
          value: 0,
        },
        uTexture: {
          value: texture,
        },
      },
      side: THREE.DoubleSide,
      transparent: true,
    })

    // 创建一个网格模型对象
    const mesh = new THREE.Mesh(geometry, ShaderMaterial);
    // 将网格模型对象添加到场景中
    scene.add(mesh);

    /** --- 设置光源 --- */
    // 点光源
    const point = new THREE.PointLight(0xffffff);
    point.position.set(4, 2, 3);
    scene.add(point); //点光源添加到场景中
    //环境光
    const ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    /** ---添加坐标辅助--- */
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    /** --- 相机设置 --- */
    // 创建相机
    camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // 设置相机位置
    camera.position.set(0, 0, 2);
    //设置相机方向(指向的场景对象)
    camera.lookAt(scene.position);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    renderer.render(scene, camera);
    ref.current?.appendChild(renderer.domElement); //body元素中插入canvas对象

    /** ---创建图形界面工具--- */
    const panel = new GUI();
    panel
      .add(ShaderMaterial, "fragmentShader", {
        '1': FragmentShader_1,
        '2': FragmentShader_2,
        '3': FragmentShader_3,
        '4': FragmentShader_4,
        '5': FragmentShader_5,
        '6': FragmentShader_6,
      })
      .name('片元着色器')
      .onChange((value: any) => {
        ShaderMaterial.fragmentShader = value;
        ShaderMaterial.needsUpdate = true;
      })

    /** ---创建轨道控制器--- */
    const controls = new OrbitControls(camera, renderer.domElement);

    const clock = new THREE.Clock();
    function render() {
      const elapsedTime = clock.getElapsedTime();
      ShaderMaterial.uniforms.uTime.value = elapsedTime;
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
    <div id="container" style={{ width: "100%", height: "100%" }} ref={ref} />
  );
};

export default Chapter12_1;
