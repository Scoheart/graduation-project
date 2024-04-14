import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useRequest, useTitle } from 'ahooks';
import { Empty, Spin, Typography } from 'antd';
import QuestionCard from '../../../../components/QuestionCard';
import {
  LIMIT_NUM,
  SEARCH_KEYWORD,
  SEARCH_LIMIT,
  SEARCH_PAGE,
} from '../../../../constants';
import { getQuestionListRequest } from '../../../../request/question';
import ListSearch from '../../../../components/ListSearch';
import ListPage from '../../../../components/ListPage';

const { Title } = Typography;

export const Route = createFileRoute('/_indexLayout/_manageLayout/manage/star')(
  {
    component: Star,
  }
);

function Star() {
  useTitle('小慕问卷 - 星标问卷');
  type OptionType = {
    isStar: boolean;
    isDeleted: boolean;
  };
  function useLoadQuestionListData(opt: Partial<OptionType> = {}) {
    const { isStar, isDeleted } = opt;
    const searchParams = useSearch({
      from: '/_indexLayout/_manageLayout/manage/star',
    }); // url 参数，虽然没有 page pageSize ，但有 keyword
    const { data, loading, error, refresh } = useRequest(
      async () => {
        const keyword = (searchParams as any)[SEARCH_KEYWORD] || '';

        const page = parseInt((searchParams as any)[SEARCH_PAGE] || '') || 1;
        const limit =
          parseInt((searchParams as any)[SEARCH_LIMIT] || '') || LIMIT_NUM;

        const data = await getQuestionListRequest({
          keyword,
          isStar,
          isDeleted,
          page,
          limit,
        });
        return data;
      },
      {
        refreshDeps: [searchParams], // 刷新的依赖项
      }
    );

    return { data, loading, error, refresh };
  }

  const { data = {}, loading } = useLoadQuestionListData({ isStar: true });
  const { list = [], total = 0 } = data;

  return (
    <>
      <div className=" flex mb-[20px]">
        <div className=" flex-1">
          <Title level={3}>星标问卷</Title>
        </div>
        <div className=" flex-1 text-right">
          <ListSearch />
        </div>
      </div>
      <div className=" mb-[20px]">
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        )}
        {!loading && list.length === 0 && <Empty description="暂无数据" />}
        {list.length > 0 &&
          list.map((q: any) => {
            const { id } = q;
            return <QuestionCard key={id} {...q} />;
          })}
      </div>
      <div className=" text-center">
        <ListPage total={total} />
      </div>
    </>
  );
}
