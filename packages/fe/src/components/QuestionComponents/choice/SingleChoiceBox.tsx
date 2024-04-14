import { FC, useEffect } from 'react';
import { nanoid } from 'nanoid';
import {
  Typography,
  Radio,
  Space,
  Form,
  Input,
  Button,
  Select,
  Checkbox,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { Paragraph } = Typography;

type OptionType = {
  value: string;
  text: string;
};

interface SingleChoiceBoxProps {
  title?: string;
  isVertical?: boolean;
  options?: OptionType[];
  value?: string;

  // 用于 PropComponent
  onChange?: (newProps: SingleChoiceBoxProps) => void;
  disabled?: boolean;
}

const defaultSingleChoiceBoxProps: SingleChoiceBoxProps = {
  title: '单选标题',
  isVertical: false,
  options: [
    { value: 'item1', text: '选项1' },
    { value: 'item2', text: '选项2' },
    { value: 'item3', text: '选项3' },
  ],
  value: '',
};

const SingleChoiceBox: FC<SingleChoiceBoxProps> = (
  props: SingleChoiceBoxProps
) => {
  const {
    title,
    options = [],
    value,
    isVertical,
  } = {
    ...defaultSingleChoiceBoxProps,
    ...props,
  };
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Radio.Group value={value}>
        <Space direction={isVertical ? 'vertical' : 'horizontal'}>
          {options.map((opt) => {
            const { value, text } = opt;
            return (
              <Radio key={value} value={value}>
                {text}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
    </div>
  );
};

const PropComponent: FC<SingleChoiceBoxProps> = (
  props: SingleChoiceBoxProps
) => {
  const { title, isVertical, value, options = [], onChange, disabled } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ title, isVertical, value, options });
  }, [title, isVertical, value, options]);

  function handleValuesChange() {
    if (onChange == null) return;
    // 触发 onChange 函数
    const newValues = form.getFieldsValue() as SingleChoiceBoxProps;

    if (newValues.options) {
      // 需要清除 text undefined 的选项
      newValues.options = newValues.options.filter(
        (opt) => !(opt.text == null)
      );
    }

    const { options = [] } = newValues;
    options.forEach((opt) => {
      if (opt.value) return;
      opt.value = nanoid(5); // 补齐 opt value
    });

    onChange(newValues);
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, isVertical, value, options }}
      onValuesChange={handleValuesChange}
      disabled={disabled}
      form={form}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {/* 遍历所有的选项（可删除） */}
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline">
                    {/* 当前选项 输入框 */}
                    <Form.Item
                      name={[name, 'text']}
                      rules={[
                        { required: true, message: '请输入选项文字' },
                        {
                          validator: (_, text) => {
                            const { options = [] } = form.getFieldsValue();
                            let num = 0;
                            options.forEach((opt: OptionType) => {
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
                    {index > 1 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                );
              })}

              {/* 添加选项 */}
              <Form.Item>
                <Button
                  type="link"
                  onClick={() => add({ text: '', value: '' })}
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
      <Form.Item label="默认选中" name="value">
        <Select
          value={value}
          options={options.map(({ text, value }) => ({
            value,
            label: text || '',
          }))}
        ></Select>
      </Form.Item>
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  );
};

export const SingleChoiceBoxConf = {
  title: '单选',
  type: 'singleChoiceBox',
  Component: SingleChoiceBox,
  PropComponent: PropComponent,
  defaultProps: defaultSingleChoiceBoxProps,
};

export default SingleChoiceBox;
