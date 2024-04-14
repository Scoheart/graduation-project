import { get } from '.';

export async function getQuestionById(id: string) {
  const url = `/api/question/${id}`;
  const data = await get(url);
  return data;
}
