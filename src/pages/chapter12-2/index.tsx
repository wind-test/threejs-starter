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
import FragmentShader from './shader/fragment';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

let scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera

const Chapter12_2 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    // 创建纹理加载器对象
    // 创建纹理加载器对象
    const rgbeLoader = new RGBELoader();
    rgbeLoader.loadAsync("/textures/hdr/003.hdr").then((texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    /** --- 创建一个网格模型 --- */
    // 创建一个几何体
    const geometry = new THREE.PlaneGeometry(1, 1, 64, 64)
    // 创建一个材质对象
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
      uniforms: {},
      side: THREE.DoubleSide,
    })

    // 创建一个网格模型对象
    const mesh = new THREE.Mesh(geometry, shaderMaterial);
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
    renderer = new THREE.WebGLRenderer({ alpha: true});
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.2;
    renderer.render(scene, camera);
    ref.current?.appendChild(renderer.domElement); //body元素中插入canvas对象

    const gltfLoader = new GLTFLoader();
    let LightBox: any = null;
    gltfLoader.load("/model/flyLight.glb", (gltf) => {
      LightBox = gltf.scene.children[1];
      LightBox.material = shaderMaterial;

      for (let i = 0; i < 150; i++) {
        let flyLight = gltf.scene.clone(true);
        let x = (Math.random() - 0.5) * 300;
        let z = (Math.random() - 0.5) * 300;
        let y = Math.random() * 60 + 25;
        flyLight.position.set(x, y, z);
        gsap.to(flyLight.rotation, {
          y: 2 * Math.PI,
          duration: 10 + Math.random() * 30,
          repeat: -1,
        });
        gsap.to(flyLight.position, {
          x: "+=" + Math.random() * 5,
          y: "+=" + Math.random() * 20,
          yoyo: true,
          duration: 5 + Math.random() * 10,
          repeat: -1,
        });
        scene.add(flyLight);
      }
    });

    /** ---创建轨道控制器--- */
    const controls = new OrbitControls(camera, renderer.domElement);

    function render() {
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

export default Chapter12_2;
