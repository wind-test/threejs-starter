/*
 * @Descripttion: three.js基本介绍
 * @Author: huangjitao
 * @Date: 2021-08-05 19:36:19
 * @Function: 该文件用途描述
 */

import { Typography } from "antd";

const { Title, Text, Paragraph } = Typography

const Chapter1_1 = () => {

  return (
    <div style={{ padding: '50px' }}>
      <Typography>
        <Title level={2}>什么是Three.js</Title>
        <ul>
          <li>Three.js是基于原生WebGL封装运行的三维引擎。</li>
          <li>WebGL是一种Javascript的3D图形接口，把JavaScript和OpenGL ES 2.0结合在一起。</li>
          <li>Unity、UnReal等是客户端的三维引擎; Three.js则是网页端的三维引擎。</li>
        </ul>

        <Title level={2}>为什么要使用Three.js</Title>
        <ul>
          <li>利用Three.JS可以制作出很多酷炫的3D动画，并且Three.js还可以通过鼠标、键盘、拖拽等事件形成交互，在页面上增加一些3D动画和3D交互可以产生更好的用户体验。</li>
          <li>通过Three.JS可以实现全景视图，这些全景视图应用在房产、家装行业能够带来更直观的视觉体验。在电商行业利用Three.JS可以实现产品的3D效果，这样用户就可以360度全方位地观察商品了，给用户带来更好的购物体验。</li>
          <li>使用Three.JS还可以制作类似微信跳一跳那样的小游戏。随着技术的发展、基础网络的建设，web3D技术还能得到更广泛的应用。</li>
        </ul>
      </Typography>
    </div>
  );
}

export default Chapter1_1
