/*
 * @Descripttion: 右侧导航栏
 * @Author: huangjitao
 * @Date: 2021-08-04 21:14:56
 * @Function: 该文件用途描述
 */

import { Menu } from "antd";
import { menu } from "../consts/menu";
import { useSelectedMenu } from "../utils/useSelectedMenu";

const { SubMenu } = Menu;

const SideMenu = () => {
  const { selectedKeys } = useSelectedMenu();
  const changeChapter = (path: string) => {
    window.location.href = `http://${window.location.host}/#${path}`
    window.location.reload()
  }
  return (
    <Menu
      style={{ width: "100%", height: "100%" }}
      selectedKeys={selectedKeys}
      mode="inline"
    >
      {menu.map((item) => (
        <SubMenu key={item.key} title={item.label}>
          {item.children.map((child) => (
            <Menu.Item key={child.key} onClick={() => changeChapter(child.path)}>
              {child.label}
            </Menu.Item>
          ))}
        </SubMenu>
      ))}
    </Menu>
  );
};

export default SideMenu;
