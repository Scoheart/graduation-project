import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { FC, useState } from 'react';
import {
  getUserInfoRequest,
  loginRequest,
  registerUserRequest,
} from '../../request/user';
import { useRequest } from 'ahooks';
import { message, Space, Typography } from 'antd';
import { getToken, setToken } from '../../utils';
import { useUserInfoStore } from '../../store/userInfoStore';

const { Title } = Typography;

const Sign: FC = () => {
  const [isSign, setIsSign] = useState(true);

  const changeSign = () => {
    setIsSign(!isSign);
  };

  return (
    <div className="h-[calc(100vh-64px-70px)] flex justify-center items-center">
      <div className="flex w-full max-w-[1080px] h-[640px] rounded-xl shadow-[0_0_20px_4px_rgba(0,0,0,0.3)]">
        <div className="flex-1 bg-[#1778f2] rounded-l-xl flex items-center justify-center">
          <div className="!leading-none !text-center">
            <Space>
              <Title className=" !text-[64px] !text-[#f7f7f7]">在线问卷</Title>
            </Space>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-r-xl gap-4">
          {isSign ? (
            <SignIn changeSign={changeSign} />
          ) : (
            <SignUp changeSign={changeSign} />
          )}
        </div>
      </div>
    </div>
  );
};

type SignProps = {
  changeSign: any;
};
const SignUp: FC<SignProps> = ({ changeSign }) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    nickname: '',
  });

  const { run: signup } = useRequest(
    async () => {
      const data = await registerUserRequest(
        user.username,
        user.password,
        user.nickname
      );
      return data;
    },
    {
      manual: true,
      onSuccess() {
        message.success('注册成功');
        changeSign();
      },
    }
  );

  return (
    <>
      <h2 className=" font-extrabold text-3xl">注册</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="请输入您的昵称"
          className="border border-gray-300 rounded-lg p-3 w-full"
          onChange={(e) => {
            setUser({
              ...user,
              nickname: e.target.value.trim(),
            });
          }}
        />
        <input
          type="text"
          placeholder="请输入您的用户名"
          className="border border-gray-300 rounded-lg p-3 w-full"
          onChange={(e) => {
            setUser({
              ...user,
              username: e.target.value.trim(),
            });
          }}
        />
        <input
          type="password"
          placeholder="请输入您的密码"
          className="border border-gray-300 rounded-lg p-3 w-full"
          onChange={(e) => {
            setUser({
              ...user,
              password: e.target.value.trim(),
            });
          }}
        />
        <div className="flex justify-center gap-4 my-2">
          <span>已经有账号了 ?</span>
          <span
            className=" text-[#1778f2] hover:cursor-pointer"
            onClick={() => {
              changeSign();
            }}
          >
            登录
          </span>
        </div>
        <button
          className=" p-3 w-full rounded-lg bg-[#1778f2] text-white font-medium text-md hover:opacity-75 transition"
          onClick={signup}
        >
          提交
        </button>
        <div className="flex justify-center items-center gap-4 my-6 text-gray-300">
          <hr className="w-24" />
          或者使用以下方式登录
          <hr className="w-24" />
        </div>
        <div className="flex gap-2">
          <button className="border hover:border-gray-300 w-[120px] h-[60px] rounded-lg hover:shadow-md transition">
            <img src="/google.svg" alt="" className="mx-auto w-7 h-7" />
          </button>
          <button className="border hover:border-gray-300 w-[120px] h-[60px] rounded-lg hover:shadow-md transition">
            <img src="/apple.svg" alt="" className="mx-auto w-7 h-7" />
          </button>
          <button className="border hover:border-gray-300 w-[120px] h-[60px] rounded-lg hover:shadow-md  transition">
            <img src="/facebook.svg" alt="" className="mx-auto w-7 h-7" />
          </button>
        </div>
      </div>
    </>
  );
};

const SignIn: FC<SignProps> = ({ changeSign }) => {
  const USERNAME_KEY = 'USERNAME';
  const PASSWORD_KEY = 'PASSWORD';

  function rememberUser(username: string, password: string) {
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(PASSWORD_KEY, password);
  }

  function deleteUserFromStorage() {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(PASSWORD_KEY);
  }

  function getUserInfoFromStorage() {
    return {
      username: localStorage.getItem(USERNAME_KEY),
      password: localStorage.getItem(PASSWORD_KEY),
    };
  }

  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const { setUserInfo } = useUserInfoStore();
  const navigate = useNavigate();
  const { run: login } = useRequest(
    async () => {
      const data = await loginRequest(user.username, user.password);
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const { access_token } = result;
        setToken(access_token);

        getUserInfoRequest(user.username).then((userInfo) => {
          setUserInfo({
            username: userInfo.username,
            nickname: userInfo.nickname,
          });
        });

        message.success('登录成功');
        navigate({
          to: '/manage/list',
        });
      },
      onError() {
        setUser({
          username: '',
          password: '',
        });
        message.error('用户名或密码错误');
      },
    }
  );

  return (
    <>
      <h2 className=" font-extrabold text-3xl">登录</h2>
      <div className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="请输入您的用户名"
            value={user.username}
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
            }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="请输入您的密码"
            value={user.password}
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
        </div>
        <div className="flex justify-center gap-4 my-2">
          <span>还没有账号 ?</span>
          <span
            className=" text-[#1778f2] hover:cursor-pointer"
            onClick={() => {
              changeSign();
            }}
          >
            注册
          </span>
        </div>
        <button
          className="p-3 w-full rounded-lg bg-[#1778f2] text-white font-medium text-md hover:opacity-75 transition"
          onClick={login}
        >
          登录
        </button>
        <div className="flex justify-center items-center gap-4 my-6 text-gray-300">
          <hr className="w-24" />
          或者使用以下方式登录
          <hr className="w-24" />
        </div>
        <div className="flex gap-2">
          <button className="border hover:border-gray-300 w-[120px] h-[60px] rounded-lg hover:shadow-md transition">
            <img src="/google.svg" alt="" className="mx-auto w-7 h-7" />
          </button>
          <button className="border hover:border-gray-300 w-[120px] h-[60px] rounded-lg hover:shadow-md transition">
            <img src="/apple.svg" alt="" className="mx-auto w-7 h-7" />
          </button>
          <button className="border hover:border-gray-300 w-[120px] h-[60px] rounded-lg hover:shadow-md  transition">
            <img src="/facebook.svg" alt="" className="mx-auto w-7 h-7" />
          </button>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_indexLayout/sign')({
  beforeLoad: () => {
    const access_token = getToken();
    if (access_token) {
      throw redirect({
        to: '/manage/list',
      });
    }
  },
  component: Sign,
});
