import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  Spin,
  Result,
  Button,
  Input,
  InputRef,
  message,
  Popover,
  Space,
  Tooltip,
  Typography,
  Table,
  Pagination,
} from 'antd';
import QRCode from "qrcode.react"
import { useRequest, useTitle } from 'ahooks';
import { usePageInfoStore } from '../../../../store/pageInfoStore';
import { CopyOutlined, QrcodeOutlined, LeftOutlined } from '@ant-design/icons';
import { useComponentStore } from '../../../../store/componentStore';
import { getComponentConfByType } from '../../../../components/QuestionComponents';
import classNames from 'classnames';
import { STAT_LIMIT } from '../../../../constants';

const { Title } = Typography;

export const Route = createFileRoute('/question/$questionId/(Stat)/Stat')({
  component: Stat,
});

function Stat() {
  const navigate = useNavigate();
  // const { loading } = useLoadQuestionData();
  const loading = 0;
  const { title, isPublished } = usePageInfoStore();

  // 状态提升 selectedId type
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [selectedComponentType, setSelectedComponentType] = useState('');

  // 修改标题
  useTitle(`问卷统计 - ${title}`);

  // loading 效果
  const LoadingELem = (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <Spin />
    </div>
  );

  // Content Elem
  function genContentElem() {
    if (typeof isPublished === 'boolean' && !isPublished) {
      return (
        <div style={{ flex: '1' }}>
          <Result
            status="warning"
            title="该页面尚未发布"
            extra={
              <Button
                type="primary"
                onClick={() =>
                  navigate({
                    to: '/manage/list',
                  })
                }
              >
                返回
              </Button>
            }
          ></Result>
        </div>
      );
    }

    return (
      <>
        <div className=" w-[350px] mr-6 bg-white">
          <ComponentList
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={setSelectedComponentId}
            setSelectedComponentType={setSelectedComponentType}
          />
        </div>
        <div className=" flex-auto bg-white px-[18px] py-3">
          <PageStat
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={setSelectedComponentId}
            setSelectedComponentType={setSelectedComponentType}
          />
        </div>
        <div className=" w-[400px] ml-6 bg-white px-[18px] py-3 overflow-hidden">
          <ChartStat
            selectedComponentId={selectedComponentId}
            selectedComponentType={selectedComponentType}
          />
        </div>
      </>
    );
  }

  return (
    <div className=" flex flex-col bg-[#f0f2f5] min-h-[100vh]">
      <StatHeader />
      <div className=" flex-auto py-3">
        {loading && LoadingELem}
        {!loading && <div className=" mx-6 flex">{genContentElem()}</div>}
      </div>
    </div>
  );
}

const StatHeader: FC = () => {
  const navigate = useNavigate();
  const { questionId } = useParams({
    from: '/question/$questionId/Stat',
  });

  const { title, isPublished } = usePageInfoStore();

  // 拷贝链接
  const urlInputRef = useRef<InputRef>(null);
  function copy() {
    const elem = urlInputRef.current;
    if (elem == null) return;
    elem.select(); // 选中 input 的内容
    document.execCommand('copy'); // 拷贝选中内容 （富文本编辑器的操作）
    message.success('拷贝成功');
  }

  // 使用 useMemo 1. 依赖项是否经常变化; 2. 缓存的元素是否创建成本较高
  const LinkAndQRCodeElem = useMemo(() => {

    // if (!isPublished) return null;

    // 拼接 url ，需要参考 C 端的规则
    const url = `http://192.168.10.3:3000/question/${questionId}`;

    // 定义二维码组件
    const QRCodeElem = (
      <div style={{ textAlign: 'center' }}>
        <QRCode value={url} size={150} />
      </div>
    );

    return (
      <Space>
        <Input value={url} style={{ width: '300px' }} ref={urlInputRef} />
        <Tooltip title="拷贝链接">
          <Button icon={<CopyOutlined />} onClick={copy}></Button>
        </Tooltip>
        <Popover content={QRCodeElem}>
          <Button icon={<QrcodeOutlined />}></Button>
        </Popover>
      </Space>
    );
  }, [questionId, isPublished]);

  return (
    <div className=" bg-white border-b border-[#e8e8e8] py-3">
      <div className=" flex mx-6">
        <div className=" flex-1">
          <Space>
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() =>
                navigate({
                  to: '/manage/list',
                })
              }
            >
              返回
            </Button>
            <Title className="!text-[18px] !leading-none !mb-0">{title}</Title>
          </Space>
        </div>
        <div className=" flex-1 text-center">{LinkAndQRCodeElem}</div>
        <div className=" flex-1 text-right">
          <Button
            className="bg-[#1677ff]"
            type="primary"
            onClick={() =>
              navigate({
                to: `/question/${questionId}/edit`,
              })
            }
          >
            编辑问卷
          </Button>
        </div>
      </div>
    </div>
  );
};

type ComponentListPropsType = {
  selectedComponentId: string;
  setSelectedComponentId: (id: string) => void;
  setSelectedComponentType: (type: string) => void;
};

const ComponentList: FC<ComponentListPropsType> = (props) => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    setSelectedComponentType,
  } = props;
  const { componentList } = useComponentStore();

  return (
    <div className=" min-h-full ">
      {componentList
        .filter((c) => !c.isHidden) // 过滤隐藏的组件
        .map((c) => {
          const { com_id, props, type } = c;

          const componentConf = getComponentConfByType(type);
          if (componentConf == null) return null;

          const { Component } = componentConf;

          // 拼接 class name
          const wrapperDefaultClassName =
            ' m-4 border border-white hover:border-[#d9d9d9] py-3 px-[6px] rounded';
          const selectedClassName = '!border-[#1890ff]';
          const wrapperClassName = classNames({
            [wrapperDefaultClassName]: true,
            [selectedClassName]: com_id === selectedComponentId, // 是否选中
          });

          return (
            <div
              className={wrapperClassName}
              key={com_id}
              onClick={() => {
                setSelectedComponentId(com_id);
                setSelectedComponentType(type);
              }}
            >
              <div className=" pointer-events-none opacity-80">
                <Component {...props}></Component>
              </div>
            </div>
          );
        })}
    </div>
  );
};

type PageStatPropsType = {
  selectedComponentId: string;
  setSelectedComponentId: (id: string) => void;
  setSelectedComponentType: (type: string) => void;
};

const PageStat: FC<PageStatPropsType> = (props: PageStatPropsType) => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    setSelectedComponentType,
  } = props;

  const { questionId } = useParams({
    from: '/question/$questionId/Stat',
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(STAT_LIMIT);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const { loading } = useRequest(
    async () => {
      const res = await getQuestionStatListService(id, { page, pageSize });
      return res;
    },
    {
      refreshDeps: [questionId, page, pageSize],
      onSuccess(res) {
        const { total, list = [] } = res;
        setTotal(total);
        setList(list);
      },
    }
  );
  const { componentList } = useComponentStore();
  const columns = componentList.map((c) => {
    const { com_id, title, props = {}, type } = c;

    const colTitle = props!.title || title;

    return {
      // title: colTitle,
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedComponentId(com_id);
            setSelectedComponentType(type);
          }}
        >
          <span
            style={{
              color: com_id === selectedComponentId ? '#1890ff' : 'inherit',
            }}
          >
            {colTitle}
          </span>
        </div>
      ),
      dataIndex: com_id,
    };
  });

  const dataSource = list.map((i: any) => ({ ...i, key: i._id }));
  const TableElem = (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      ></Table>
      <div style={{ textAlign: 'center', marginTop: '18px' }}>
        <Pagination
          total={total}
          pageSize={pageSize}
          current={page}
          onChange={(page) => setPage(page)}
          onShowSizeChange={(page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </>
  );

  return (
    <div>
      <Title level={3}>答卷数量: {!loading && total}</Title>
      {loading && (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      )}
      {!loading && TableElem}
    </div>
  );
};

type ChartStatPropsType = {
  selectedComponentId: string;
  selectedComponentType: string;
};

const ChartStat: FC<ChartStatPropsType> = (props: ChartStatPropsType) => {
  const { selectedComponentId, selectedComponentType } = props;
  const { questionId } = useParams({
    from: '/question/$questionId/Stat',
  });

  const [stat, setStat] = useState([]);
  const { run } = useRequest(
    async (questionId, componentId) =>
      await getComponentStatService(questionId, componentId),
    {
      manual: true,
      onSuccess(res) {
        setStat(res.stat);
      },
    }
  );

  useEffect(() => {
    if (selectedComponentId) run(questionId, selectedComponentId);
  }, [questionId, selectedComponentId]);

  // 生成统计图表
  function genStatElem() {
    if (!selectedComponentId) return <div>未选中组件</div>;

    const { StatComponent } =
      getComponentConfByType(selectedComponentType) || {};
    if (StatComponent == null) return <div>该组件无统计图表</div>;

    return <StatComponent stat={stat} />;
  }

  return (
    <>
      <Title level={3}>图表统计</Title>
      <div>{genStatElem()}</div>
    </>
  );
};

export default Stat;
