import { FC, useState } from 'react';
import { Button, Space, Divider, Tag, Popconfirm, Modal, message } from 'antd';
import {
  EditOutlined,
  LineChartOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  duplicateQuestionRequest,
  updateQuestionRequest,
} from '../request/question';

const { confirm } = Modal;

type PropsType = {
  id: string;
  title: string;
  isStar: boolean;
  isPublished: boolean;
  answerCount: number;
  createdAt: string;
};

const QuestionCard: FC<PropsType> = (props: PropsType) => {
  const navigate = useNavigate();
  const { id, title, createdAt, answerCount, isPublished, isStar } = props;

  // 修改 标星
  const [isStarState, setIsStarState] = useState(isStar);
  const { loading: changeStarLoading, run: changeStar } = useRequest(
    async () => {
      await updateQuestionRequest(id, { isStar: !isStarState });
    },
    {
      manual: true,
      onSuccess() {
        setIsStarState(!isStarState); // 更新 state
        message.success('已更新');
      },
    }
  );

  // 复制
  const { loading: duplicateLoading, run: duplicate } = useRequest(
    // async () => {
    //   const data = await duplicateQuestionService(id)
    //   return data
    // },
    async () => await duplicateQuestionRequest(id),
    {
      manual: true,
      onSuccess(result) {
        message.success('复制成功');
        navigate({
          to: `/question/${result.id}/Edit`,
        }); // 跳转到问卷编辑页
      },
    }
  );

  // 删除
  const [isDeletedState, setIsDeletedState] = useState(false);
  const { loading: deleteLoading, run: deleteQuestion } = useRequest(
    async () => await updateQuestionRequest(id, { isDeleted: true }),
    {
      manual: true,
      onSuccess() {
        message.success('删除成功');
        setIsDeletedState(true);
      },
    }
  );

  function del() {
    confirm({
      title: '确定删除该问卷？',
      icon: <ExclamationCircleOutlined />,
      onOk: deleteQuestion,
    });
  }

  // 已经删除的问卷，不要再渲染卡片了
  if (isDeletedState) return null;

  return (
    <div className=" mb-4 p-3 rounded bg-white">
      <div className=" flex">
        <div className=" flex-1">
          <Link
            to={isPublished ? `/question/${id}/stat` : `/question/${id}/edit`}
          >
            <Space>
              {isStarState && <StarOutlined style={{ color: 'red' }} />}
              {title}
            </Space>
          </Link>
        </div>
        <div className=" flex-1 text-right text-[12px]">
          <Space>
            {isPublished ? (
              <Tag color="processing">已发布</Tag>
            ) : (
              <Tag>未发布</Tag>
            )}
            <span>答卷: {answerCount}</span>
            <span>{createdAt}</span>
          </Space>
        </div>
      </div>
      <Divider style={{ margin: '12px 0' }} />
      <div className=" flex">
        <div className=" flex-1">
          <Space>
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              onClick={() =>
                navigate({
                  to: `/question/${id}/Edit`,
                })
              }
            >
              编辑问卷
            </Button>
            <Button
              icon={<LineChartOutlined />}
              type="text"
              size="small"
              onClick={() =>
                navigate({
                  to: `/question/${id}/stat`,
                })
              }
              disabled={!isPublished}
            >
              问卷统计
            </Button>
          </Space>
        </div>
        <div className=" flex-1 text-right ">
          <Space>
            <Button
              type="text"
              icon={<StarOutlined />}
              size="small"
              onClick={changeStar}
              disabled={changeStarLoading}
              className=" text-[#999]"
            >
              {isStarState ? '取消标星' : '标星'}
            </Button>
            <Popconfirm
              title="确定复制该问卷？"
              okText={<div className="text-black">确定</div>}
              cancelText="取消"
              onConfirm={duplicate}
            >
              <Button
                className=" text-[#999]"
                type="text"
                icon={<CopyOutlined />}
                size="small"
                disabled={duplicateLoading}
              >
                复制
              </Button>
            </Popconfirm>
            <Button
              className=" text-[#999]"
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              onClick={del}
              disabled={deleteLoading}
            >
              删除
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
