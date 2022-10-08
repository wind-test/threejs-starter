/*
 * @Title: 标准材质的参数
 * @Author: huangjitao
 * @Date: 2022-09-29 10:38:09
 * @Description: 透明度纹理、环境遮挡贴图
 */

import { useSize } from "ahooks";
import GUI from "lil-gui";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene: THREE.Scene | THREE.Object3D<THREE.Event>,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  axesHelper;

const Chapter4_5 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const [loadTip, setLoadTip] = useState<string>("");

  const initThree = () => {
    /** --- 创建一个场景 --- */
    scene = new THREE.Scene();

    /** --- 创建一个网格模型 --- */
    // 创建一个几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      setLoadTip(
        `开始加载资源: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
      );
    };
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setLoadTip(
        `加载资源中: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
      );
    };
    loadingManager.onLoad = () => {
      setLoadTip("加载资源完成");
    };
    loadingManager.onError = (url) => {
      setLoadTip(`加载资源出错 ${url}`);
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const ColorTexture = textureLoader.load("/textures/door/color.jpg");
    const AlphaTexture = textureLoader.load("/textures/door/alpha.jpg"); // 透明贴图
    const AoTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg"); // 环境遮挡贴图
    const DisplaceTexture = textureLoader.load("/textures/door/height.jpg"); // 置换贴图
    const RoughnessTexture = textureLoader.load("/textures/door/roughness.jpg"); // 粗糙度贴图
    const MetalnessTexture = textureLoader.load("/textures/door/metalness.jpg"); // 金属度贴图
    const NormalTexture = textureLoader.load("/textures/door/normal.jpg");// 法线贴图

    const material = new THREE.MeshStandardMaterial({
      color: "#ffff00",
      map: ColorTexture,
      alphaMap: null,
      transparent: true,
      opacity: 1,
      aoMap: null,
      aoMapIntensity: 1,
      displacementMap: DisplaceTexture,
      displacementScale: 0.1,
      roughnessMap: null,
      roughness: 1,
      metalnessMap: null,
      metalness: 1,
      normalMap: null,
      side: THREE.DoubleSide,
    });
    // aoMap需要第二组UV。
    geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
    );
    // 创建一个网格模型对象
    const mesh = new THREE.Mesh(geometry, material);
    // 将网格模型对象添加到场景中
    scene.add(mesh);

    /** ---创建图形界面工具--- */
    const panel = new GUI();
    const basicMaterialPanel = panel.addFolder("BasicMaterial");
    basicMaterialPanel
      .add(material, "alphaMap", { hasMap: AlphaTexture, none: null })
      .name("透明贴图")
      .onChange((value: any) => {
        material.needsUpdate = true;
      });
    basicMaterialPanel
      .add(material, "transparent")
      .name("是否透明")
      .onChange(() => console.log(`当前物体是否显示：${mesh.visible}`));
    basicMaterialPanel
      .add(material, "opacity")
      .min(0)
      .max(1)
      .step(0.01)
      .name("设置透明度");
    basicMaterialPanel
      .add(material, "aoMap", { hasMap: AoTexture, none: null })
      .name("环境遮挡贴图")
      .onChange((value: any) => {
        material.needsUpdate = true;
      });
    basicMaterialPanel
      .add(material, "aoMapIntensity")
      .min(0)
      .max(1)
      .step(0.01)
      .name("环境遮挡强度");
    basicMaterialPanel
      .add(material, "side", {
        "THREE.FrontSide": THREE.FrontSide,
        "THREE.BackSide": THREE.BackSide,
        "THREE.DoubleSide": THREE.DoubleSide,
      })
      .name("渲染面")
      .onChange((value: any) => {
        material.needsUpdate = true;
      });

    const standardMaterialPanel = panel.addFolder("StandardMaterial");
    standardMaterialPanel
      .add(material, "displacementMap", { hasMap: DisplaceTexture, none: null })
      .name("置换贴图")
      .onChange((value: any) => {
        material.needsUpdate = true;
      });
    standardMaterialPanel
      .add(material, "displacementScale")
      .min(0)
      .max(0.1)
      .step(0.0001)
      .name("置换贴图顶点细分度")

    standardMaterialPanel
      .add(material, "roughnessMap", { hasMap: RoughnessTexture, none: null })
      .name("粗糙度贴图")
      .onChange((value: any) => {
        material.needsUpdate = true;
      });
    standardMaterialPanel
      .add(material, "roughness")
      .min(0)
      .max(1)
      .step(0.01)
      .name("粗糙程度")

    standardMaterialPanel
      .add(material, "metalnessMap", { hasMap: MetalnessTexture, none: null })
      .name("金属度贴图")
      .onChange((value: any) => {
        material.needsUpdate = true;
      });
    standardMaterialPanel
      .add(material, "metalness")
      .min(0)
      .max(1)
      .step(0.01)
      .name("金属相似度")
    standardMaterialPanel
      .add(material, "normalMap", { hasMap: NormalTexture, none: null })
      .name("法线贴图")
      .onChange((value: any) => {
        material.needsUpdate = true;
      });

    /** --- 设置光源 --- */
    // // 点光源
    // const point = new THREE.PointLight(0xffffff);
    // point.position.set(0, 5, 10);
    // scene.add(point); //点光源添加到场景中
    // 环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    // 直线光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

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
    <div id="container" style={{ width: "100%", height: "100%" }} ref={ref}>
      <div className="load-tip" id="tip">
        {loadTip}
      </div>
    </div>
  );
};

export default Chapter4_5;
