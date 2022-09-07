/*
 * @Descripttion: 菜单配置
 * @Author: huangjitao
 * @Date: 2021-08-04 20:56:55
 * @Function: 该文件用途描述
 */

import Chapter1_1 from "../pages/chapter1-1";

export const menu = [
  {
    label: "1. React Introduce",
    key: "1",
    children: [
      {
        label: "1.1 Three.js简介",
        key: "1-1",
        path: "/abstract/feature",
        component: Chapter1_1,
      },
    ]
  },
]