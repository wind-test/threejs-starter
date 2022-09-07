/*
 * @Descripttion: 右侧导航栏
 * @Author: huangjitao
 * @Date: 2021-08-04 21:14:56
 * @Function: 该文件用途描述
 */

import { Menu } from "antd";
import { menu } from "../consts/menu";
import { Link } from "react-router-dom";
import { useSelectedMenu } from "../utils/useSelectedMenu";

const { SubMenu } = Menu;

const SideMenu = () => {
  const { selectedKeys, openKeys } = useSelectedMenu();
  return (
    <Menu
      style={{ width: "100%", height: "100%" }}
      selectedKeys={selectedKeys}
      // openKeys={openKeys}
      mode="inline"
    >
      {menu.map((item) => (
        <SubMenu key={item.key} title={item.label}>
          {item.children.map((child) => (
            <Menu.Item key={child.key}>
              <Link to={child.path} key={child.path}>{child.label}</Link>
            </Menu.Item>
          ))}
        </SubMenu>
      ))}
    </Menu>
  );
};

export default SideMenu;
