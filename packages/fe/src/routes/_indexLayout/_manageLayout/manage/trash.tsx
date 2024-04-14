import { createFileRoute, useSearch } from '@tanstack/react-router';

import { useState } from 'react';
import { useTitle } from 'ahooks';
import {
  Typography,
  Empty,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Spin,
  message,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  deleteQuestionsRequest,
  getQuestionListRequest,
  updateQuestionRequest,
} from '../../../../request/question';
import ListPage from '../../../../components/ListPage';
import ListSearch from '../../../../components/ListSearch';
import {
  SEARCH_KEYWORD,
  SEARCH_PAGE,
  SEARCH_LIMIT,
  LIMIT_NUM,
} from '../../../../constants';
const { Title } = Typography;
const { confirm } = Modal;

export const Route = createFileRoute(
  '/_indexLayout/_manageLayout/manage/trash'
)({
  component: Trash,
});

function Trash() {
  useTitle('小慕问卷 - 回收站');
  type OptionType = {
    isStar: boolean;
    isDeleted: boolean;
  };
  function useLoadQuestionListData(opt: Partial<OptionType> = {}) {
    const { isStar, isDeleted } = opt;
    const searchParams = useSearch({
      from: '/_indexLayout/_manageLayout/manage/trash',
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

  const {
    data = {},
    loading,
    refresh,
  } = useLoadQuestionListData({ isDeleted: true });
  const { list = [], total = 0 } = data;

  // 记录选中的 id
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 恢复
  const { run: recover } = useRequest(
    async () => {
      for await (const id of selectedIds) {
        await updateQuestionRequest(id, { isDeleted: false });
      }
    },
    {
      manual: true,
      debounceWait: 500, // 防抖
      onSuccess() {
        message.success('恢复成功');
        refresh(); // 手动刷新列表
        setSelectedIds([]);
      },
    }
  );

  // 删除
  const { run: deleteQuestion } = useRequest(
    async () => await deleteQuestionsRequest(selectedIds),
    {
      manual: true,
      onSuccess() {
        message.success('删除成功');
        refresh();
        setSelectedIds([]);
      },
    }
  );

  function del() {
    confirm({
      title: '确认彻底删除该问卷？',
      icon: <ExclamationCircleOutlined />,
      content: '删除以后不可以找回',
      onOk: deleteQuestion,
    });
  }

  const tableColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      // key: 'title', // 循环列的 key ，它会默认取 dataIndex 的值
    },
    {
      title: '是否发布',
      dataIndex: 'isPublished',
      render: (isPublished: boolean) => {
        return isPublished ? (
          <Tag color="processing">已发布</Tag>
        ) : (
          <Tag>未发布</Tag>
        );
      },
    },
    {
      title: '答卷',
      dataIndex: 'answerCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ];

  // 可以把 JSX 片段定义为一个变量
  const TableElem = (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Button
            className=' bg-[#1677ff]'
            type="primary"
            disabled={selectedIds.length === 0}
            onClick={recover}
          >
            恢复
          </Button>
          <Button danger disabled={selectedIds.length === 0} onClick={del}>
            彻底删除
          </Button>
        </Space>
      </div>
      <div style={{ border: '1px solid #e8e8e8' }}>
        <Table
          dataSource={list}
          columns={tableColumns}
          pagination={false}
          rowKey={(q) => q.id}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
              setSelectedIds(selectedRowKeys as string[]);
            },
          }}
        />
      </div>
    </>
  );

  return (
    <>
      <div className=" flex mb-[20px]">
        <div className=" flex-1">
          <Title level={3}>回收站</Title>
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
        {list.length > 0 && TableElem}
      </div>
      <div className=" text-center">
        <ListPage total={total} />
      </div>
    </>
  );
}

export default Trash;
