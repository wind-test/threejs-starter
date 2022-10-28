/*
 * @Title: 3d全屏滚动实现页面
 * @Author: huangjitao
 * @Date: 2022-10-25 15:22:12
 * @Description: description of this file
 */

import { useEffect } from "react";
import "./index.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from 'gsap'

let renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  mouse = { x: 0, y: 0 },
  previousTime = 0,
  sectionMeshes: THREE.Mesh< THREE.BufferGeometry, THREE.MeshToonMaterial >[] = [];

const parameters = {
  materialColor: "#FFF59D",
};
let objectsDistance = 5;
const particlesCount = 200;
let currentSection = 0;
const isPortrait = window.innerWidth < window.innerHeight; // 是否横屏

const ScrollFull3d = () => {
  const initThree = () => {
    // Canvas画布
    const canvas = document.querySelector("#mainCanvas") as HTMLCanvasElement;
    // Scene场景
    const scene = new THREE.Scene();
    // 设置相机
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(0, 0, 4);
    cameraGroup.add(camera);
    if (isPortrait) {
      camera.position.setZ(8)
      objectsDistance = 11
    }

    // 设置材质
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load(
      "https://gw.alicdn.com/imgextra/i1/O1CN01Kv3xWT1kImpSDZI8n_!!6000000004661-0-tps-5-1.jpg"
    );
    gradientTexture.magFilter = THREE.NearestFilter;
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture,
    });

    // 设置Meshes
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );
    scene.add(mesh1, mesh2, mesh3);

    mesh1.position.y = -objectsDistance * 0;
    mesh2.position.y = -objectsDistance * 1;
    mesh3.position.y = -objectsDistance * 2;
    sectionMeshes = [mesh1, mesh2, mesh3];

    // 设置粒子效果
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03,
    });
    const particels = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particels);
    sectionMeshes.forEach((mesh, index) => {
      if (isPortrait) {
        mesh.position.setY(-objectsDistance * index)
      } else {
        mesh.position.setX(index % 2 === 0 ? 2 : -2)
        mesh.position.setY(-objectsDistance * index)
      }
    });

    // 设置灯光
    const directionLight = new THREE.DirectionalLight();
    directionLight.position.set(1, 1, 0);
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color("#ffffff"),
      0.28
    );
    scene.add(ambientLight, directionLight);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 设置渲染方法
    const clock = new THREE.Clock();
    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      // 设置mesh动画
      sectionMeshes.forEach((mesh, index) => {
        mesh.rotation.set(deltaTime * 0.1 + mesh.rotation.x, deltaTime * 0.1 + mesh.rotation.y, 0);
      });
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      camera.position.setY((-scrollY / height) * objectsDistance);
      if (mouse.x && mouse.y) {
        const parallaxX = mouse.x * 0.5;
        const parallaxY = mouse.y * 0.5;
        cameraGroup.position.x +=
          (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
        cameraGroup.position.y +=
          (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render();

    const gui = new dat.GUI();
    gui.addColor(parameters, "materialColor").onChange(() => {
      material.color.set(parameters.materialColor);
      particlesMaterial.color.set(parameters.materialColor)
    });
  };

  // three.js场景自适应
  const changeSize = () => {
    /** --- 相机设置 --- */
    const width = window.innerWidth;
    const height = window.innerHeight;
    // 更新摄像头
    camera.aspect = width / height;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    //  更新渲染区域尺寸
    renderer.setSize(width, height);
    //  设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  };

  // 鼠标滑动设置视差效果
  const mouseMove = (event: MouseEvent) => {
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -((event.clientY / height) * 2 - 1);
  };

  // 设置滚动动画
  const scrollAnimation = () => {
    const { scrollY, innerHeight } = window
    const newSection = Math.round(scrollY / innerHeight)
    if (currentSection !== newSection) {
      currentSection = newSection;
      console.log('changed', currentSection)
      gsap.to(sectionMeshes[currentSection].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
      })
    }
  }

  useEffect(() => {
    initThree();
    window.addEventListener("resize", changeSize);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("scroll", scrollAnimation);
    return () => {
      window.removeEventListener("resize", changeSize);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("scroll", scrollAnimation);
    };
  }, []);

  return (
    <div className="scroll3d">
      <canvas id="mainCanvas" className="webgl"></canvas>
      <section className="section">
        <h1>Hello</h1>
      </section>
      <section className="section">
        <h2>My projects</h2>
      </section>
      <section className="section">
        <h2>Contact me</h2>
      </section>
    </div>
  );
};

export default ScrollFull3d;
