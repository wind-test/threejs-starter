/*
 * @Descripttion: 菜单配置
 * @Author: huangjitao
 * @Date: 2021-08-04 20:56:55
 * @Function: 该文件用途描述
 */

import Chapter1_1 from "../pages/chapter1-1";
import Chapter1_2 from "../pages/chapter1-2";
import Chapter2_1 from "../pages/chapter2-1";
import Chapter2_2 from "../pages/chapter2-2";
import Chapter2_3 from "../pages/chapter2-3";
import Chapter3_1 from "../pages/chapter3-1";
import Chapter3_2 from "../pages/chapter3-2";
import Chapter4_1 from "../pages/chapter4-1";
import Chapter4_2 from "../pages/chapter4-2";
import Chapter4_3 from "../pages/chapter4-3";

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
    ]
  },
]