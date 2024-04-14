import {
  PlusOutlined,
  BarsOutlined,
  StarOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useRequest } from 'ahooks';
import { Button, Divider, message, Space } from 'antd';
import { createQuestionRequest } from '../../../request/question';

export const Route = createFileRoute('/_indexLayout/_manageLayout/manage')({
  beforeLoad: ({ search }) => {
    return search;
  },
  component: Manage,
});

function Manage() {
  const navigate = useNavigate();

  const {
    loading,
    // error,
    run: handleCreateClick,
  } = useRequest(createQuestionRequest, {
    manual: true,
    onSuccess(result) {
      const { id } = result;
      // @ts-ignore
      navigate({
        to: `/question/${id}/Edit/`,
      });
      message.success('创建成功');
    },
  });

  return (
    <div className=" py-4 w-[1200px] mx-auto flex">
      <div className=" w-[120px]">
        <Space direction="vertical">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className=" bg-[#1677ff]"
            onClick={handleCreateClick}
            disabled={loading}
          >
            新建问卷
          </Button>
          <Divider style={{ borderTop: 'transparent' }} />
          <Button
            // type={pathname.startsWith('/manage/list') ? 'default' : 'text'}
            size="large"
            icon={<BarsOutlined />}
            onClick={() =>
              navigate({
                to: '/manage/list',
              })
            }
          >
            我的问卷
          </Button>
          <Button
            // type={pathname.startsWith('/manage/star') ? 'default' : 'text'}
            size="large"
            icon={<StarOutlined />}
            onClick={() =>
              navigate({
                to: '/manage/star',
              })
            }
          >
            星标问卷
          </Button>
          <Button
            // type={pathname.startsWith('/manage/trash') ? 'default' : 'text'}
            size="large"
            icon={<DeleteOutlined />}
            onClick={() =>
              navigate({
                to: '/manage/trash',
              })
            }
          >
            回收站
          </Button>
        </Space>
      </div>
      <div className=" flex-1 ml-[60px]">
        <Outlet />
      </div>
    </div>
  );
}
