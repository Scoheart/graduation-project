import PageWrapper from '@/components/PageWrapper';

export default function Fail() {
  return (
    <PageWrapper title="提交失败">
      <div className="text-center">
        <h1>失败</h1>
        <p>问卷提交失败</p>
      </div>
    </PageWrapper>
  );
}
