import request, { ResDataType } from '.';

// 获取问卷的统计列表
export async function getQuestionStatListRequest(
  questionId: string,
  opt: { page: number; pageSize: number }
): Promise<ResDataType> {
  const url = `/api/stat/${questionId}`;
  const data = (await request.get(url, { params: opt })) as ResDataType;
  return data;
}

// 获取组件统计数据汇总
export async function getComponentStatRequest(
  questionId: string,
  componentId: string
): Promise<ResDataType> {
  const url = `/api/stat/${questionId}/${componentId}`;
  const data = (await request.get(url)) as ResDataType;
  return data;
}
