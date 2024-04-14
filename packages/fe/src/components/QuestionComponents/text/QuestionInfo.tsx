import { FC, useEffect } from 'react';
import { Form, Input, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface QuestionInfoProps {
  title?: string;
  description?: string;

  // 用于 PropComponent
  onChange?: (newProps: QuestionInfoProps) => void;
  disabled?: boolean;
}

const defaultQuestionInfoProps: QuestionInfoProps = {
  title: '问卷标题',
  description: '问卷描述',
};

const QuestionInfo: FC<QuestionInfoProps> = (props: QuestionInfoProps) => {
  const { title, description = '' } = {
    ...defaultQuestionInfoProps,
    ...props,
  };

  const descTextList = description.split('\n');

  return (
    <div style={{ textAlign: 'center' }}>
      <Title style={{ fontSize: '24px' }}>{title}</Title>
      <Paragraph>
        {descTextList.map((t, index) => (
          <span key={index}>
            {index > 0 && <br />}
            {t}
          </span>
        ))}
      </Paragraph>
    </div>
  );
};

const PropComponent: FC<QuestionInfoProps> = (props: QuestionInfoProps) => {
  const { title, description, onChange, disabled } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ title, description });
  }, [title, description]);

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue());
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, description }}
      onValuesChange={handleValuesChange}
      disabled={disabled}
      form={form}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入问卷标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="描述" name="description">
        <TextArea />
      </Form.Item>
    </Form>
  );
};

export const QuestionInfoConf = {
  title: '标题',
  type: 'questionInfo',
  Component: QuestionInfo,
  PropComponent: PropComponent,
  defaultProps: defaultQuestionInfoProps,
};

export default QuestionInfo;
