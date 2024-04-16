import { CLINET_URL } from '@/constants';
import { postAnswer } from '@/request/answer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    // 不是 post 则返回错误
    NextResponse.json({ status: 400, msg: 'Method 错误' }, { status: 400 });
  }
  const answerInfo = genAnswerInfo(await request.formData());
  const baseURL = CLINET_URL;
  const successUrl = new URL('/success', baseURL);
  const failUrl = new URL('/fail', baseURL);

  try {
    // 提交到服务端 Mock
    const { status } = await postAnswer(answerInfo);
    if (status >= 200 && status < 300) {
      // 如果提交成功了
      return NextResponse.redirect(successUrl, 302);
    } else {
      // 提交失败了
      return NextResponse.redirect(failUrl, 302);
    }
  } catch (err) {
    return NextResponse.redirect(failUrl, 302);
  }
}

function genAnswerInfo(formData: any) {
  const json: any = {
    questionId: '',
    answerList: [],
  };
  formData.forEach((value: any, key: any) => {
    console.log(value, key);
    // 如果键已经存在，将值追加到数组中
    if (key === 'questionId') {
      json.questionId = value;
    } else {
      json.answerList.push({
        componentId: key,
        value: value,
      });
    }
  });
  return json;
}
