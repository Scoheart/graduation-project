import { BASE_URL } from '@/constants';

const baseURL = BASE_URL;

export async function get(url: string) {
  const res = await fetch(`${baseURL}${url}`, {
    cache: 'no-store',
  });
  const data = res.json();
  return data;
}

export async function post(url: string, body: any) {
  const res = await fetch(`${baseURL}${url}`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  const data = res.json();
  return data;
}
