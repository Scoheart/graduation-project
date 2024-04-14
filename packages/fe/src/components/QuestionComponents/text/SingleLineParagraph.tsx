import { FC, useEffect } from 'react';
import { Form, Input, Checkbox, Typography } from 'antd';
const { TextArea } = Input;
const { Paragraph } = Typography;

interface SingleLineParagraphProps {
  text?: string;
  isCenter?: boolean;

  // 用于 PropComponent
  onChange?: (newProps: SingleLineParagraphProps) => void;
  disabled?: boolean;
}

const defaultSingleLineParagraphProps: SingleLineParagraphProps = {
  text: '一行段落',
  isCenter: false,
};

const SingleLineParagraph: FC<SingleLineParagraphProps> = (
  props: SingleLineParagraphProps
) => {
  const { text = '', isCenter } = {
    ...defaultSingleLineParagraphProps,
    ...props,
  };
  const textList = text.split('\n'); // 例如 ['hello', '123', '456']

  return (
    <Paragraph
      style={{ textAlign: isCenter ? 'center' : 'start', marginBottom: '0' }}
    >
      {textList.map((t, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {t}
        </span>
      ))}
    </Paragraph>
  );
};

const PropComponent: FC<SingleLineParagraphProps> = (
  props: SingleLineParagraphProps
) => {
  const { text, isCenter, onChange, disabled } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ text, isCenter });
  }, [text, isCenter]);

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue());
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ text, isCenter }}
      onValuesChange={handleValuesChange}
      disabled={disabled}
      form={form}
    >
      <Form.Item
        label="段落内容"
        name="text"
        rules={[{ required: true, message: '请输入段落内容' }]}
      >
        <TextArea />
      </Form.Item>
      <Form.Item name="isCenter" valuePropName="checked">
        <Checkbox>居中显示</Checkbox>
      </Form.Item>
    </Form>
  );
};

export const SingleLineParagraphConf = {
  title: '单行段落',
  type: 'singleLineParagraph',
  Component: SingleLineParagraph,
  PropComponent: PropComponent,
  defaultProps: defaultSingleLineParagraphProps,
};

export default SingleLineParagraph;
