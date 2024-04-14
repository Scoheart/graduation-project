import { FC, useEffect } from 'react';
import { Form, Input, Select, Checkbox, Typography } from 'antd';

const { Title } = Typography;

interface SingleLineHeadingProps {
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5;
  isCenter?: boolean;

  onChange?: (newProps: SingleLineHeadingProps) => void;
  disabled?: boolean;
}

const defaultSingleLineHeadingProps: SingleLineHeadingProps = {
  text: '一行标题',
  level: 1,
  isCenter: false,
};

const SingleLineHeading: FC<SingleLineHeadingProps> = (
  props: SingleLineHeadingProps
) => {
  const {
    text,
    level = 1,
    isCenter,
  } = {
    ...defaultSingleLineHeadingProps,
    ...props,
  };
  const genFontSize = (level: number) => {
    if (level === 1) return '24px';
    if (level === 2) return '20px';
    if (level === 3) return '16px';
    return '16px';
  };

  return (
    <Title
      level={level}
      style={{
        textAlign: isCenter ? 'center' : 'start',
        marginBottom: '0',
        fontSize: genFontSize(level),
      }}
    >
      {text}
    </Title>
  );
};

const PropComponent: FC<SingleLineHeadingProps> = (
  props: SingleLineHeadingProps
) => {
  const { text, level, isCenter, onChange, disabled } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      text,
      level,
      isCenter,
    });
  }, [text, level, isCenter]);

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue());
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValueChange}
      initialValues={{ text, level, isCenter }}
      disabled={disabled}
    >
      <Form.Item
        label="标题内容"
        name="text"
        rules={[{ required: true, message: '请输入标题内容' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="层级" name="level">
        <Select
          options={[
            { value: 1, text: 1 },
            { value: 2, text: 2 },
            { value: 3, text: 3 },
          ]}
        ></Select>
      </Form.Item>
      <Form.Item name="isCenter" valuePropName="checked">
        <Checkbox>居中显示</Checkbox>
      </Form.Item>
    </Form>
  );
};

export const SingleLineHeadingConf = {
  title: '单行标题',
  type: 'singleLineHeading',
  Component: SingleLineHeading,
  PropComponent: PropComponent,
  defaultProps: defaultSingleLineHeadingProps,
};

export default SingleLineHeading;
