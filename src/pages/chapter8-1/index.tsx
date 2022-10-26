/*
 * @Title: 3d全屏滚动
 * @Author: huangjitao
 * @Date: 2022-10-25 15:18:11
 * @Description: description of this file
 */


import { Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography

const Chapter8_1 = () => {

  return (
    <div style={{ padding: '50px' }}>
      <Typography>
        <Title level={2}>
          <Link to="/pages/scrollFull3d">3d全屏滚动</Link>
        </Title>
      </Typography>
    </div>
  );
}

export default Chapter8_1