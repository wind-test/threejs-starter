/*
 * @Descripttion: 应用主入口
 * @Author: huangjitao
 * @Date: 2021-08-04 20:27:49
 * @Function: 该文件用途描述
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import { Layout } from "antd";
import SideMenu from "./components/SideMunu";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { menu } from "./consts/menu";
import PageHeader from "./components/PageHeader";
import { pages } from "./consts/pages";

const { Sider, Header, Content, Footer } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  const location = useLocation();
  if (location.pathname.includes('/pages')) {
    console.log('111')
    return (
      <div className="App">
        <Routes>
          {pages.map(item => (
            <Route path={item.path} element={<item.component />} />
          ))}
        </Routes>
      </div>
    )
  }
  return (
    <div className="App">
      <Layout style={{ height: "100%" }}>
        <Sider
          width={256}
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          <SideMenu />
        </Sider>
        <Layout>
          <Header>
            <PageHeader />
          </Header>
          <Content>
            <Routes>
              {menu.map((item) => {
                if (item.children) {
                  return item.children.map((child) => (
                    <Route path={child.path} element={<child.component />} />
                  ));
                }
              })}
              <Navigate to={"/abstract/feature"} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
