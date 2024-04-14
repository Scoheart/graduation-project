import request, { ResDataType } from '.';

// 创建问卷
export async function createQuestionRequest(): Promise<ResDataType> {
  const url = '/api/question';
  const data = (await request.post(url)) as ResDataType;
  return data;
}

// 批量彻底删除
export async function deleteQuestionsRequest(
  ids: string[]
): Promise<ResDataType> {
  const url = '/api/question';
  const data = (await request.delete(url, { data: { ids } })) as ResDataType;
  return data;
}

// 更新单个问卷
export async function updateQuestionRequest(
  id: string,
  opt: { [key: string]: any }
): Promise<ResDataType> {
  const url = `/api/question/${id}`;
  const data = (await request.patch(url, opt)) as ResDataType;
  return data;
}

// 获取单个问卷信息
export async function getQuestionRequest(id: string): Promise<ResDataType> {
  const url = `/api/question/${id}`;
  const data = (await request.get(url)) as ResDataType;
  return data;
}

type SearchOption = {
  keyword: string;
  isStar: boolean;
  isDeleted: boolean;
  page: number;
  limit: number;
};

// 获取（查询）问卷列表
export async function getQuestionListRequest(
  opt: Partial<SearchOption> = {}
): Promise<ResDataType> {
  const url = '/api/question';
  const data = (await request.get(url, { params: opt })) as ResDataType;
  return data;
}

// 复制问卷
export async function duplicateQuestionRequest(
  id: string
): Promise<ResDataType> {
  const url = `/api/question/duplicate/${id}`;
  const data = (await request.post(url)) as ResDataType;
  return data;
}
