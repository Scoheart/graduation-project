import MultipleChoiceBox from './choice/MultipleChoiceBox';
import SingleChoiceBox from './choice/SingleChoiceBox';
import MultipleLineInput from './input/MultipleLineInput';
import SingleLineInput from './input/SingleLineInput';
import QuestionInfo from './text/QuestionInfo';
import SingleLineHeading from './text/SingleLineHeading';
import SingleLineParagraph from './text/SingleLineParagraph';

type ComponentInfoType = {
  com_id: string;
  type: string;
  // title: string
  isHidden: string;
  props: any;
};

export const getComponent = (comp: ComponentInfoType) => {
  const { com_id, type, isHidden, props = {} } = comp;

  if (isHidden) return null;

  if (type === 'questionInfo') {
    return <QuestionInfo {...props} />;
  }
  if (type === 'singleLineHeading') {
    return <SingleLineHeading {...props} />;
  }
  if (type === 'singleLineParagraph') {
    return <SingleLineParagraph {...props} />;
  }
  if (type === 'singleLineInput') {
    return <SingleLineInput com_id={com_id} props={props} />;
  }
  if (type === 'multipleLineInput') {
    return <MultipleLineInput com_id={com_id} props={props} />;
  }
  if (type === 'singleChoiceBox') {
    return <SingleChoiceBox com_id={com_id} props={props} />;
  }
  if (type === 'multipleChoiceBox') {
    return <MultipleChoiceBox com_id={com_id} props={props} />;
  }

  return null;
};
