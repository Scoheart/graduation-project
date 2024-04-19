import {
  createFileRoute,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { nanoid } from 'nanoid';
import { useDebounceEffect, useKeyPress, useRequest } from 'ahooks';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Space,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
} from 'antd';
import classNames from 'classnames';
import {
  BlockOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  LeftOutlined,
  LoadingOutlined,
  LockOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useComponentStore } from '../../../../store/componentStore';
import {
  componentConfGroup,
  getComponentConfByType,
} from '../../../../components/QuestionComponents';
import { useComponentStoreData } from '../../../../hooks/useComponentStoreData';
import { usePageInfoStore } from '../../../../store/pageInfoStore';
import {
  getQuestionRequest,
  updateQuestionRequest,
} from '../../../../request/question';
import { getToken } from '../../../../utils';
import SortableContainer from '../../../../components/DragSortable/SortableContainer';
import SortableItem from '../../../../components/DragSortable/SortableItem';
import useBindCanvasKeyPress from '../../../../hooks/useBindCanvasKeyPress';

const { Title } = Typography;
const { TextArea } = Input;

export const Route = createFileRoute('/question/$questionId/(Edit)/Edit')({
  beforeLoad: () => {
    const access_token = getToken();
    if (!access_token) {
      throw redirect({
        to: '/sign',
      });
    }
  },
  loader: async ({ params: { questionId } }) => {
    const { componentList } = await getQuestionRequest(questionId);
    return { componentList, questionId };
  },
  component: Edit,
});

function Edit() {
  return (
    <div className="aa bg-[#f0f2f5] w-full h-screen flex flex-col">
      <EditHeader />
      <div className=" flex flex-auto p-4 ">
        <aside className=" bg-white px-3 w-[295px]">
          <LeftPanel />
        </aside>
        <EditCanvas />
        <aside className=" bg-white px-3 w-[300px]">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}

const EditHeader: FC = () => {
  const navigateigate = useNavigate();

  return (
    <div className=" bg-white border border-solid border-[#e8e8e8] py-3">
      <div className=" flex mx-6">
        <div className=" flex-1">
          <Space>
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() =>
                navigateigate({
                  to: '/manage/list',
                })
              }
            >
              返回
            </Button>
            <QuestionTitle />
          </Space>
        </div>
        <div className=" flex-1 text-center">
          <EditToolbar />
        </div>
        <div className=" flex-1 text-right">
          <Space>
            <SaveButton />
            <PublishButton />
          </Space>
        </div>
      </div>
    </div>
  );
};

const QuestionTitle: FC = () => {
  const { title } = usePageInfoStore();
  const { changePageTitle } = usePageInfoStore();

  const [editState, SetEditState] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value.trim();
    if (!newTitle) return;
    changePageTitle(newTitle);
  }

  if (editState) {
    return (
      <Input
        value={title}
        onChange={handleChange}
        onPressEnter={() => SetEditState(false)}
        onBlur={() => SetEditState(false)}
      />
    );
  }

  return (
    <Space>
      <Title className="!text-[18px] !eading-none !mb-0">{title}</Title>
      <Button
        icon={<EditOutlined />}
        type="text"
        onClick={() => SetEditState(true)}
      />
    </Space>
  );
};

const SaveButton: FC = () => {
  const { questionId } = useLoaderData({ from: '/question/$questionId/Edit' });

  const { title, desc, js, css } = usePageInfoStore();

  const { componentList } = useComponentStore();

  const { loading, run: save } = useRequest(
    async () => {
      if (!questionId) return;
      await updateQuestionRequest(questionId, {
        title,
        desc,
        js,
        css,
        componentList,
      });
    },
    { manual: true }
  );

  // 快捷键
  useKeyPress(['ctrl.s', 'meta.s'], (event: KeyboardEvent) => {
    event.preventDefault();
    if (!loading) save();
  });
  
  // 自定保存（不是定期保存，不是定时器）
  useDebounceEffect(
    () => {
      save();
    },
    [componentList, title, desc, js, css],
    {
      wait: 1000,
    }
  );

  return (
    <Button
      onClick={save}
      disabled={loading}
      icon={loading ? <LoadingOutlined /> : null}
    >
      保存
    </Button>
  );
};

const PublishButton: FC = () => {
  const navigate = useNavigate();

  const { questionId: id } = useParams({
    from: '/question/$questionId/Edit',
  });

  const { componentList = [] } = useComponentStore();
  const { title, desc, js, css } = usePageInfoStore();
  // const pageInfo = useGetPageInfo();

  const { loading, run: pub } = useRequest(
    async () => {
      if (!id) return;
      await updateQuestionRequest(id, {
        title,
        desc,
        js,
        css,
        componentList,
        isPublished: true, // 标志着问卷已经被发布
      });
    },
    {
      manual: true,
      onSuccess() {
        message.success('发布成功');
        navigate({
          to: `/question/${id}/Stat`,
        }); // 发布成功，跳转到统计页面
      },
    }
  );

  return (
    <Button
      className="bg-blue-500"
      type="primary"
      onClick={pub}
      disabled={loading}
    >
      发布
    </Button>
  );
};

const EditToolbar: FC = () => {
  const { selectedId, selectedComponent, copiedComponent } =
    useComponentStoreData();

  const {
    removeSelectedComponent,
    changeComponentHidden,
    toggleComponentLocked,
    copySelectedComponent,
    pasteCopiedComponent,
  } = useComponentStore();

  const deleteComponent = () => removeSelectedComponent();
  const hiddenComponent = () => changeComponentHidden(selectedId, true);

  const { isLocked } = selectedComponent || {};
  const lockedComponent = () => toggleComponentLocked(selectedId);
  const copyComponent = () => copySelectedComponent();
  const pasteComponent = () => pasteCopiedComponent();
  return (
    <Space>
      <Tooltip title="删除">
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={deleteComponent}
        ></Button>
      </Tooltip>
      <Tooltip title="隐藏">
        <Button
          shape="circle"
          icon={<EyeInvisibleOutlined />}
          onClick={hiddenComponent}
        ></Button>
      </Tooltip>
      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          onClick={lockedComponent}
          className={classNames({
            'bg-blue-500': isLocked,
          })}
          type={isLocked ? 'primary' : 'default'}
        ></Button>
      </Tooltip>
      <Tooltip title="复制">
        <Button
          shape="circle"
          icon={<CopyOutlined />}
          onClick={copyComponent}
        ></Button>
      </Tooltip>
      <Tooltip title="粘贴">
        <Button
          shape="circle"
          icon={<BlockOutlined />}
          onClick={pasteComponent}
          disabled={copiedComponent == null}
        ></Button>
      </Tooltip>
    </Space>
  );
};

const LeftPanel: FC = () => {
  const items: TabsProps['items'] = [
    {
      key: 'componentLib',
      label: '组件库',
      children: <ComponentLib />,
    },
    {
      key: 'layer',
      label: '图层',
      children: <Layer />,
    },
  ];
  return <Tabs items={items} />;
};

const ComponentLib: FC = () => {
  const { addComponentList } = useComponentStore();
  const handleClick = (type: string, title: string, defaultProps: any) => {
    addComponentList({
      com_id: nanoid(),
      type,
      title,
      props: defaultProps,
    });
  };

  return (
    <>
      {componentConfGroup.map(({ groupId, groupName, componentConfList }) => {
        return (
          <div key={groupId}>
            <h1 className=" text-lg mb-2">{groupName}</h1>
            {componentConfList.map((componentConf, index) => {
              const { type, title, defaultProps, Component } = componentConf;
              return (
                <div
                  key={index}
                  className=" bg-[#f7f7f7] p-3 rounded mb-3 border border-solid border-[#f7f7f7] hover:border-[#d9d9d9] cursor-pointer"
                  onClick={() => handleClick(type, title, defaultProps)}
                >
                  <div className="pointer-events-none">
                    <Component />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const Layer: FC = () => {
  const { selectedId, componentList } = useComponentStore();
  const [changingTitleId, setChangingTitleId] = useState('');

  const {
    changeSelectedId,
    toggleComponentLocked,
    changeComponentHidden,
    changeComponentTitle,
    moveComponent,
  } = useComponentStore();

  const handleTitleClick = (com_id: string) => {
    const curComp = componentList.find((c) => c.com_id === com_id);
    if (curComp && curComp.isHidden) {
      message.info('不能选中隐藏的组件');
      return;
    }
    if (com_id !== selectedId) {
      // 当前组件未被选中，执行选中
      changeSelectedId(com_id);
      setChangingTitleId('');
      return;
    }

    // 点击修改标题
    setChangingTitleId(com_id);
  };

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value.trim();
    if (!newTitle) return;
    if (!selectedId) return;
    changeComponentTitle(selectedId, newTitle);
  };

  const changeHidden = (com_id: string, isHidden: boolean) =>
    changeComponentHidden(com_id, isHidden);
  const changeLocked = (com_id: string) => toggleComponentLocked(com_id);

  // SortableContainer 组件的 items 属性，需要每个 item 都有 id
  const componentListWithId = componentList.map((c) => {
    return { ...c, id: c.com_id };
  });

  // 拖拽排序结束
  function handleDragEnd(oldIndex: number, newIndex: number) {
    moveComponent(oldIndex, newIndex);
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      {componentList.map((c) => {
        const { com_id, title, isHidden, isLocked } = c;

        // 拼接 title className
        const titleDefaultClassName = 'flex-auto leading-loose';
        const selectedClassName = 'text-[#1890ff]';
        const titleClassName = classNames({
          [titleDefaultClassName]: true,
          [selectedClassName]: com_id === selectedId,
        });

        return (
          <SortableItem key={com_id} id={com_id}>
            <div className=" py-2 border-b-[1px] border-[rgba(0, 0, 0, .06)] flex">
              <div
                className={titleClassName}
                onClick={() => handleTitleClick(com_id)}
              >
                {com_id === changingTitleId && (
                  <Input
                    value={title}
                    onChange={changeTitle}
                    onPressEnter={() => setChangingTitleId('')}
                    onBlur={() => setChangingTitleId('')}
                  />
                )}
                {com_id !== changingTitleId && title}
              </div>
              <div className="w-[50px] text-end">
                <Space>
                  <Button
                    size="small"
                    shape="circle"
                    className={!isHidden ? 'opacity-20 ' : 'bg-[#1677ff]'}
                    icon={<EyeInvisibleOutlined />}
                    type={isHidden ? 'primary' : 'text'}
                    onClick={() => changeHidden(com_id, !isHidden)}
                  />
                  <Button
                    size="small"
                    shape="circle"
                    className={!isLocked ? 'opacity-20' : 'bg-[#1677ff]'}
                    icon={<LockOutlined />}
                    type={isLocked ? 'primary' : 'text'}
                    onClick={() => changeLocked(com_id)}
                  />
                </Space>
              </div>
            </div>
          </SortableItem>
        );
      })}
    </SortableContainer>
  );
};

const EditCanvas: FC = () => {
  const { componentList: getComponentList } = useLoaderData({
    from: '/question/$questionId/Edit',
  });
  const {
    selectedId,
    componentList,
    setComponentList,
    changeSelectedId,
    moveComponent,
  } = useComponentStore();

  // 第一次加载设置默认选中第一个
  useEffect(() => {
    if (componentList.length > 0) {
      changeSelectedId(componentList[0].com_id);
    }
  }, []);

  useEffect(() => {
    setComponentList(getComponentList);
  }, []);
  // 绑定快捷键
  useBindCanvasKeyPress();
  // SortableContainer 组件的 items 属性，需要每个 item 都有 id
  const componentListWithId = componentList.map((c) => {
    return { ...c, id: c.com_id };
  });

  // 拖拽排序结束
  function handleDragEnd(oldIndex: number, newIndex: number) {
    moveComponent(oldIndex, newIndex);
  }

  return (
    <>
      <main
        className=" flex-1 flex items-center overflow-hidden"
        onClick={() => changeSelectedId('')}
      >
        <SortableContainer
          items={componentListWithId}
          onDragEnd={handleDragEnd}
        >
          <div className=" w-[400px] h-[712px] bg-white mx-auto overflow-auto shadow-[0px_2px_10px_#0000001f]">
            {componentList
              .filter((c) => !c.isHidden)
              .map((component, index) => {
                const { com_id, type, props, isLocked } = component;
                const { Component } = getComponentConfByType(type)!;
                const wrapperClassName =
                  'border border-solid border-[#fff] hover:border-[#d9d9d9] cursor-pointer m-3 p-3 rounded';
                const selectClassName = '!border-[#1890ff]';
                const lockedClassName = 'opacity-50 cursor-not-allowed';
                const classname = classNames(wrapperClassName, {
                  [selectClassName]: com_id === selectedId,
                  [lockedClassName]: isLocked,
                });
                return (
                  <SortableItem key={com_id} id={com_id}>
                    <div
                      key={index}
                      className={classname}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeSelectedId(com_id);
                      }}
                    >
                      <div className="pointer-events-none">
                        <Component {...props} />
                      </div>
                    </div>
                  </SortableItem>
                );
              })}
          </div>
        </SortableContainer>
      </main>
    </>
  );
};
// TS 枚举
enum TAB_KEYS {
  PROP_KEY = 'prop',
  SETTING_KEY = 'setting',
}
const RightPanel: FC = () => {
  const [activeKey, setActiveKey] = useState(TAB_KEYS.SETTING_KEY);

  const { selectedId } = useComponentStore();

  useEffect(() => {
    if (selectedId) setActiveKey(TAB_KEYS.PROP_KEY);
    else setActiveKey(TAB_KEYS.SETTING_KEY);
  }, [selectedId]);

  const items: TabsProps['items'] = [
    {
      key: TAB_KEYS.PROP_KEY,
      label: (
        <div>
          <FileTextOutlined />
          <span>属性</span>
        </div>
      ),
      children: <ComponentProp />,
    },
    {
      key: TAB_KEYS.SETTING_KEY,
      label: (
        <div>
          <SettingOutlined />
          <span>页面设置</span>
        </div>
      ),
      children: <PageSettings />,
    },
  ];
  return <Tabs activeKey={activeKey} items={items} />;
};

const ComponentProp: FC = () => {
  const { changeComponentProps } = useComponentStore();

  const NoProp: FC = () => {
    return <div className=" text-center">未选中组件</div>;
  };
  const { selectedComponent } = useComponentStoreData();
  if (!selectedComponent) {
    return <NoProp />;
  }

  const { type, props, isLocked, isHidden } = selectedComponent;
  const componentConf = getComponentConfByType(type);
  if (!componentConf) {
    return <NoProp />;
  }

  const { PropComponent } = componentConf;

  function changeProps(newProps: any) {
    if (!selectedComponent) return;
    const { com_id } = selectedComponent;
    changeComponentProps(com_id, newProps);
  }
  return (
    <PropComponent
      {...props}
      onChange={changeProps}
      disabled={isLocked || isHidden}
    />
  );
};

const PageSettings: FC = () => {
  const { title, desc, js, css } = usePageInfoStore();
  const { resetPageInfo } = usePageInfoStore();
  const [form] = Form.useForm();

  // 实时更新表单内容
  useEffect(() => {
    form.setFieldsValue({
      title,
      desc,
      js,
      css,
    });
  }, [title, desc, js, css]);

  function handleValuesChange() {
    resetPageInfo(form.getFieldsValue());
  }
  return (
    <Form
      layout="vertical"
      initialValues={{
        title,
        desc,
        js,
        css,
      }}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="问卷标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="问卷描述" name="desc">
        <TextArea placeholder="问卷描述..." />
      </Form.Item>
      <Form.Item label="样式代码" name="css">
        <TextArea placeholder="输入 CSS 样式代码..." />
      </Form.Item>
      <Form.Item label="脚本代码" name="js">
        <TextArea placeholder="输入 JS 脚本代码..." />
      </Form.Item>
    </Form>
  );
};
