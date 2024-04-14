import { message } from 'antd';
import axios from 'axios';
import { getToken } from '../utils';

export type ResType = {
  status: number;
  data?: ResDataType;
  msg?: string;
};
export type ResDataType = {
  [key: string]: any;
};
const request = axios.create({
  baseURL: 'http://192.168.10.3:8888',
  // baseURL: 'http://localhost:8888',
});

// request 拦截：每次请求都带上 token
request.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${getToken()}`; // JWT 的固定格式
    return config;
  },
  (error) => Promise.reject(error)
);

// response 拦截：统一处理 errno 和 msg
request.interceptors.response.use((res) => {
  const resData = (res.data || {}) as ResType;
  const { status, data, msg } = resData;

  if (!(status >= 200 && status < 300)) {
    // 错误提示
    if (msg) {
      message.error(msg);
    }

    throw new Error(msg);
  }

  return data as any;
});

export default request;
