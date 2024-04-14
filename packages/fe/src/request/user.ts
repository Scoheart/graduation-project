import request, { ResDataType } from '.';

// 获取用户信息
export async function getUserInfoRequest(
  username: string
): Promise<ResDataType> {
  const url = `/api/user/${username}`;
  const data = (await request.get(url)) as ResDataType;
  return data;
}

// 注册用户
export async function registerUserRequest(
  username: string,
  password: string,
  nickname?: string
): Promise<ResDataType> {
  const url = '/api/user/register';
  const body = { username, password, nickname: nickname || username };
  const data = (await request.post(url, body)) as ResDataType;
  return data;
}

// 登录
export async function loginRequest(
  username: string,
  password: string
): Promise<ResDataType> {
  const url = '/api/auth/login';
  const body = { username, password };
  const data = (await request.post(url, body)) as ResDataType;
  return data;
}
