/*
 * @Descripttion: 页面通用头部组件
 * @Date: 2021-08-04 22:09:56
 * @Function: 该文件用途描述
 */

import { useSelectedMenu } from "../utils/useSelectedMenu";

const PageHeader = () => {
  const { title } = useSelectedMenu();
  return (
    <div style={{ marginLeft: 25 }}>
      <h1 style={{ color: "#fff" }}>{title}</h1>
    </div>
  );
};

export default PageHeader;
