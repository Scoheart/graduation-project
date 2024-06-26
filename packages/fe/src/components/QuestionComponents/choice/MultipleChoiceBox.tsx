import { FC } from 'react';
import { Typography, Space, Checkbox, Button, Form, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
const { Paragraph } = Typography;

type OptionType = {
  value: string;
  text: string;
  checked: boolean;
};

interface MultipleChoiceBoxProps {
  title?: string;
  isVertical?: boolean;
  list?: OptionType[];

  // 用于 PropComponent
  onChange?: (newProps: MultipleChoiceBoxProps) => void;
  disabled?: boolean;
}

const defaultMultipleChoiceBoxProps: MultipleChoiceBoxProps = {
  title: '多选标题',
  isVertical: false,
  list: [
    { value: 'item1', text: '选项1', checked: false },
    { value: 'item2', text: '选项2', checked: false },
    { value: 'item3', text: '选项3', checked: false },
  ],
};

const MultipleChoiceBox: FC<MultipleChoiceBoxProps> = (
  props: MultipleChoiceBoxProps
) => {
  const {
    title,
    isVertical,
    list = [],
  } = {
    ...defaultMultipleChoiceBoxProps,
    ...props,
  };
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Space direction={isVertical ? 'vertical' : 'horizontal'}>
        {list.map((opt) => {
          const { value, text, checked } = opt;
          return (
            <Checkbox key={value} value={value} checked={checked}>
              {text}
            </Checkbox>
          );
        })}
      </Space>
    </div>
  );
};

const PropComponent: FC<MultipleChoiceBoxProps> = (
  props: MultipleChoiceBoxProps
) => {
  const { title, isVertical, list = [], onChange, disabled } = props;
  const [form] = Form.useForm();

  function handleValuesChange() {
    if (onChange == null) return;

    const newValues = form.getFieldsValue() as MultipleChoiceBoxProps;

    if (newValues.list) {
      newValues.list = newValues.list.filter((opt) => !(opt.text == null));
    }

    const { list = [] } = newValues;
    list.forEach((opt) => {
      if (opt.value) return;
      opt.value = nanoid(5);
    });

    onChange(newValues);
  }

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ title, isVertical, list }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="list">
          {(fields, { add, remove }) => (
            <>
              {/* 遍历所有的选项（可删除） */}
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline">
                    {/* 当前选项 是否选中 */}
                    <Form.Item name={[name, 'checked']} valuePropName="checked">
                      <Checkbox />
                    </Form.Item>
                    {/* 当前选项 输入框 */}
                    <Form.Item
                      name={[name, 'text']}
                      rules={[
                        { required: true, message: '请输入选项文字' },
                        {
                          validator: (_, text) => {
                            const { list = [] } = form.getFieldsValue();
                            let num = 0;
                            list.forEach((opt: OptionType) => {
                              if (opt.text === text) num++; // 记录 text 相同的个数，预期只有 1 个（自己）
                            });
                            if (num === 1) return Promise.resolve();
                            return Promise.reject(
                              new Error('和其他选项重复了')
                            );
                          },
                        },
                      ]}
                    >
                      <Input placeholder="输入选项文字..." />
                    </Form.Item>

                    {/* 当前选项 删除按钮 */}
                    {index > 0 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                );
              })}

              {/* 添加选项 */}
              <Form.Item>
                <Button
                  type="link"
                  onClick={() => add({ text: '', value: '', checked: false })}
                  icon={<PlusOutlined />}
                  block
                >
                  添加选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  );
};

// 统计组件的属性类型
export type QuestionCheckboxStatPropsType = {
  stat: Array<{ name: string; count: number }>;
};

const StatComponent: FC<QuestionCheckboxStatPropsType> = ({ stat }) => {
  return (
    <div style={{ width: '400px', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={400}
          height={300}
          data={stat}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MultipleChoiceBoxConf = {
  title: '多选',
  type: 'multipleChoiceBox',
  Component: MultipleChoiceBox,
  PropComponent: PropComponent,
  defaultProps: defaultMultipleChoiceBoxProps,
  StatComponent: StatComponent,
};

export default MultipleChoiceBox;
