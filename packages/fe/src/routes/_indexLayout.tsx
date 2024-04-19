import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';
import { FC, useEffect, useState } from 'react';
import { Button, Layout, message, Space, Typography } from 'antd';
import { FormOutlined, UserOutlined } from '@ant-design/icons';
import { useUserInfoStore } from '../store/userInfoStore';
import { removeToken } from '../utils';
const { Title } = Typography;
const { Header, Content, Footer } = Layout;
export const Route = createFileRoute('/_indexLayout')({
  component: Home,
});

function Home() {
  return (
    <Layout>
      <Header className=" px-6 bg-[#1778f2]">
        <div className=" float-left">
          <Logo />
        </div>
        <div className=" float-right">
          <UserInfo />
        </div>
      </Header>
      <Layout className=" min-h-[calc(100vh-64px-70px)]">
        <Content>
          <Outlet />
        </Content>
      </Layout>
      <Footer className=" text-center bg-[#f7f7f7] border-t-[1px] border-solid border-[#e8e8e8]">
        在线问卷 &copy;2024 - present. Created by Scoheart
      </Footer>
    </Layout>
  );
}

const Logo: FC = () => {
  const { username } = useUserInfoStore();

  const [pathname, setPathname] = useState('/');
  useEffect(() => {
    if (username) {
      setPathname('/manage/list');
    } else {
      setPathname('/');
    }
  }, [username]);

  return (
    <div className="!w-[200px] my-3 !leading-none !text-center">
      <Link to={pathname}>
        <Space>
          <Title className=" !text-[32px] !text-[#f7f7f7]">
            <FormOutlined />
          </Title>
          <Title className=" !text-[32px] !text-[#f7f7f7]">在线问卷</Title>
        </Space>
      </Link>
    </div>
  );
};

const UserInfo: FC = () => {
  const { username, nickname, removeUserInfo } = useUserInfoStore();

  const navigate = useNavigate();

  function logout() {
    removeUserInfo(); // 清空了 redux user 数据
    removeToken(); // 清除 token 的存储
    message.success('退出成功');
    navigate({
      to: '/sign',
    });
  }

  const User = (
    <div className=" flex justify-center items-center gap-2">
      <span className=" text-[#e8e8e8] flex gap-1">
        <UserOutlined />
        {nickname}
      </span>
      <Button type="link" onClick={logout} className=" text-white">
        退出
      </Button>
    </div>
  );

  const Login = (
    <Link to="/sign" className=" text-white">
      登录
    </Link>
  );

  return <div>{username ? User : Login}</div>;
};
