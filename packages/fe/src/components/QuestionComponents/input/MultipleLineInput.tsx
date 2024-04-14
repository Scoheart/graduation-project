import { FC, useEffect } from 'react';
import { Typography, Input, Form } from 'antd';
const { Paragraph } = Typography;
const { TextArea } = Input;
interface MultipleLineInputProps {
  title?: string;
  placeholder?: string;

  onChange?: (newProps: MultipleLineInputProps) => void;
  disabled?: boolean;
}

const defaultMultipleLineInputProps: MultipleLineInputProps = {
  title: '多行输入',
  placeholder: '请输入……',
};

const MultipleLineInput: FC<MultipleLineInputProps> = (
  props: MultipleLineInputProps
) => {
  const { title, placeholder } = {
    ...defaultMultipleLineInputProps,
    ...props,
  };
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <div>
        <TextArea placeholder={placeholder}></TextArea>
      </div>
    </div>
  );
};

const PropComponent: FC<MultipleLineInputProps> = (
  props: MultipleLineInputProps
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

export const MultipleLineInputConf = {
  title: '多行输入',
  type: 'multipleLineInput',
  Component: MultipleLineInput,
  PropComponent: PropComponent,
  defaultProps: defaultMultipleLineInputProps,
};

export default MultipleLineInput;
