import { FC, useEffect } from 'react';
import { Form, Input, Typography } from 'antd';

const { Paragraph } = Typography;
interface SingleLineInputProps {
  title?: string;
  placeholder?: string;

  onChange?: (newProps: SingleLineInputProps) => void;
  disabled?: boolean;
}

const defaultSingleLineInputProps: SingleLineInputProps = {
  title: '输入框标题',
  placeholder: '请输入...',
};

const SingleLineInput: FC<SingleLineInputProps> = (
  props: SingleLineInputProps
) => {
  const { title, placeholder } = {
    ...defaultSingleLineInputProps,
    ...props,
  };
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <div>
        <Input placeholder={placeholder}></Input>
      </div>
    </div>
  );
};

const PropComponent: FC<SingleLineInputProps> = (
  props: SingleLineInputProps
) => {
  const { title, placeholder, onChange, disabled } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ title, placeholder });
  }, [title, placeholder]);

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue());
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, placeholder }}
      form={form}
      onValuesChange={handleValuesChange}
      disabled={disabled}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Placeholder" name="placeholder">
        <Input />
      </Form.Item>
    </Form>
  );
};

export const SingleLineInputConf = {
  title: '单行输入',
  type: 'singleLineInput',
  Component: SingleLineInput,
  PropComponent: PropComponent,
  defaultProps: defaultSingleLineInputProps,
};

export default SingleLineInput;
