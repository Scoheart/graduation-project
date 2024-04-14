import PageWrapper from '@/components/PageWrapper';
import { getComponent } from '@/components/QuestionComponents';
import { getQuestionById } from '@/request/question';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default async function question({
  params: { questionId },
}: {
  params: { questionId: string };
}) {
  const { status, data, msg = '' } = await getQuestionById(questionId);
  // console.log(status, msg, data);
  // 数据错误
  if (!(status >= 200 && status < 300)) {
    return (
      <PageWrapper title="错误">
        <h1>错误</h1>
        <p>{msg}</p>
      </PageWrapper>
    );
  }

  const {
    id,
    title = '',
    desc = '',
    isDeleted,
    isPublished,
    componentList = [],
  } = data || {};

  metadata.title = title;
  metadata.description = desc;

  // 已经被删除的，提示错误
  if (isDeleted) {
    return (
      <PageWrapper title={title} desc={desc}>
        <h1>{title}</h1>
        <p>该问卷已经被删除</p>
      </PageWrapper>
    );
  }

  // 尚未发布的，提示错误
  if (!isPublished) {
    return (
      <PageWrapper title={title} desc={desc}>
        <h1>{title}</h1>
        <p>该问卷尚未发布</p>
      </PageWrapper>
    );
  }

  // 遍历组件
  const ComponentListElem = (
    <>
      {componentList.map((c: any) => {
        const ComponentElem = getComponent(c);
        return (
          <div key={c.com_id} className=" border-b border-[#f1f1f1]">
            {ComponentElem}
          </div>
        );
      })}
    </>
  );

  return (
    <PageWrapper title={title} desc={desc}>
      <form method="post" action="/api/answer">
        <input type="hidden" name="questionId" value={id} />

        {ComponentListElem}
        <div className="text-center m-4">
          {/* <input type="submit" value="提交"/> */}
          <button type="submit" className=' text-white bg-[#1677ff] border border-transparent rounded py-1 px-[15px]'>提交</button>
        </div>
      </form>
    </PageWrapper>
  );
}
