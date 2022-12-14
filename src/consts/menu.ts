/*
 * @Descripttion: 菜单配置
 * @Author: huangjitao
 * @Date: 2021-08-04 20:56:55
 * @Function: 菜单页面的路由配置
 */

import Chapter1_1 from "../pages/chapter1-1";
import Chapter1_2 from "../pages/chapter1-2";
import Chapter10_1 from "../pages/chapter10-1";
import Chapter10_2 from "../pages/chapter10-2";
import Chapter11_1 from "../pages/chapter11-1";
import Chapter11_2 from "../pages/chapter11-2";
import Chapter12_1 from "../pages/chapter12-1";
import Chapter2_1 from "../pages/chapter2-1";
import Chapter2_2 from "../pages/chapter2-2";
import Chapter2_3 from "../pages/chapter2-3";
import Chapter3_1 from "../pages/chapter3-1";
import Chapter3_2 from "../pages/chapter3-2";
import Chapter4_1 from "../pages/chapter4-1";
import Chapter4_2 from "../pages/chapter4-2";
import Chapter4_3 from "../pages/chapter4-3";
import Chapter4_4 from "../pages/chapter4-4";
import Chapter4_5 from "../pages/chapter4-5";
import Chapter4_6 from "../pages/chapter4-6";
import Chapter5_1 from "../pages/chapter5-1";
import Chapter5_2 from "../pages/chapter5-2";
import Chapter5_3 from "../pages/chapter5-3";
import Chapter6_1 from "../pages/chapter6-1";
import Chapter6_2 from "../pages/chapter6-2";
import Chapter6_3 from "../pages/chapter6-3";
import Chapter7_1 from "../pages/chapter7-1";
import Chapter8_1 from "../pages/chapter8-1";
import Chapter9_1 from "../pages/chapter9-1";
import Chapter9_2 from "../pages/chapter9-2";

export const menu = [
  {
    label: "1. Three.js介绍",
    key: "1",
    children: [
      {
        label: "1.1 Three.js简介",
        key: "1-1",
        path: "/abstract/feature",
        component: Chapter1_1,
      },
      {
        label: "1.2 Three.js快速上手",
        key: "1-2",
        path: "/abstract/firstTry",
        component: Chapter1_2,
      },
    ]
  },
  {
    label: "2. Three.js基本操作",
    key: "2",
    children: [
      {
        label: "2.1 操作物体",
        key: "2-1",
        path: "/basicOpt/objOpt",
        component: Chapter2_1,
      },
      {
        label: "2.2 基本动画操作",
        key: "2-2",
        path: "/basicOpt/animation",
        component: Chapter2_2,
      },
      {
        label: "2.3 图形界面工具",
        key: "2-3",
        path: "/basicOpt/gui-tool",
        component: Chapter2_3,
      },
    ]
  },
  {
    label: "3. Three.js物体",
    key: "3",
    children: [
      {
        label: "3.1 自定义几何体",
        key: "3-1",
        path: "/mesh/customGeometry",
        component: Chapter3_1,
      },
      {
        label: "3.2 随机炫酷几何体",
        key: "3-2",
        path: "/mesh/awesomeGeometry",
        component: Chapter3_2,
      },
    ]
  },
  {
    label: "4. 材质与纹理",
    key: "4",
    children: [
      {
        label: "4.1 加载纹理",
        key: "4-1",
        path: "/textures/loadTexture",
        component: Chapter4_1,
      },
      {
        label: "4.2 纹理变换",
        key: "4-2",
        path: "/textures/textureTransform",
        component: Chapter4_2,
      },
      {
        label: "4.3 纹理显示算法",
        key: "4-3",
        path: "/textures/textureMinMap",
        component: Chapter4_3,
      },
      {
        label: "4.4 基础材质参数",
        key: "4-4",
        path: "/textures/basicMaterial",
        component: Chapter4_4,
      },
      {
        label: "4.5 标准材质参数",
        key: "4-5",
        path: "/textures/standardMaterial",
        component: Chapter4_5,
      },
      {
        label: "4.6 环境贴图与hdr",
        key: "4-6",
        path: "/textures/envhdr",
        component: Chapter4_6,
      },
    ]
  },
  {
    label: "5. 光源",
    key: "5",
    children: [
      {
        label: "5.1 平行光",
        key: "5-1",
        path: "/light/directionalLight",
        component: Chapter5_1,
      },
      {
        label: "5.2 聚光灯",
        key: "5-2",
        path: "/light/spotLight",
        component: Chapter5_2,
      },
      {
        label: "5.3 点光源",
        key: "5-3",
        path: "/light/pointLight",
        component: Chapter5_3,
      },
    ]
  },
  {
    label: "6. 粒子特效",
    key: "6",
    children: [
      {
        label: "6.1 点材质",
        key: "6-1",
        path: "/particles/pointsMaterial",
        component: Chapter6_1,
      },
      {
        label: "6.2 自定义雪花粒子特效",
        key: "6-2",
        path: "/particles/customSnow",
        component: Chapter6_2,
      },
      {
        label: "6.3 银河系粒子特效",
        key: "6-3",
        path: "/particles/galaxy",
        component: Chapter6_3,
      },
    ]
  },
  {
    label: "7. 光线投射",
    key: "7",
    children: [
      {
        label: "7.1 光线投射",
        key: "7-1",
        path: "/raycaster",
        component: Chapter7_1,
      },
    ]
  },
  {
    label: "8. 3d全屏滚动",
    key: "8",
    children: [
      {
        label: "8.1 3d全屏滚动",
        key: "8-1",
        path: "/scrollFull3d",
        component: Chapter8_1,
      },
    ]
  },
  {
    label: "9. 应用物理引擎",
    key: "9",
    children: [
      {
        label: "9.1 使用cannon创建物理世界",
        key: "9-1",
        path: "/physics/createWorld",
        component: Chapter9_1,
      },
      {
        label: "9.2 模拟物理世界的相互作用力",
        key: "9-2",
        path: "/physics/applyForce",
        component: Chapter9_2,
      },
    ]
  },
  {
    label: "10. webgl原理",
    key: "10",
    children: [
      {
        label: "10.1 使用webgl绘制图形",
        key: "10-1",
        path: "/webgl/drawTriangle",
        component: Chapter10_1,
      },
      {
        label: "10.2 使用webgl绘制动画",
        key: "10-2",
        path: "/webgl/animate",
        component: Chapter10_2,
      },
    ]
  },
  {
    label: "11. 着色器编程：入门",
    key: "11",
    children: [
      {
        label: "11.1 着色器材质",
        key: "11-1",
        path: "/webglBasic/shaderMaterial",
        component: Chapter11_1,
      },
      {
        label: "11.2 原始着色器材质",
        key: "11-2",
        path: "/webglBasic/rawShaderMaterial",
        component: Chapter11_2,
      },
    ]
  },
  {
    label: "12. 着色器编程：进阶",
    key: "12",
    children: [
      {
        label: "12.1 着色器编写图案",
        key: "12-1",
        path: "/webglAdvance/basicGraph",
        component: Chapter12_1,
      },
    ]
  },
]