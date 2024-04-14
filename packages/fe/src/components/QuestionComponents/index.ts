import { MultipleChoiceBoxConf } from './choice/MultipleChoiceBox';
import { SingleChoiceBoxConf } from './choice/SingleChoiceBox';
import { MultipleLineInputConf } from './input/MultipleLineInput';
import { SingleLineInputConf } from './input/SingleLineInput';
import { QuestionInfoConf } from './text/QuestionInfo';
import { SingleLineHeadingConf } from './text/SingleLineHeading';
import { SingleLineParagraphConf } from './text/SingleLineParagraph';

export const componentConfGroup = [
  {
    groupId: 'textGroup',
    groupName: '文本显示',
    componentConfList: [
      QuestionInfoConf,
      SingleLineHeadingConf,
      SingleLineParagraphConf,
    ],
  },
  {
    groupId: 'inputGroup',
    groupName: '用户输入',
    componentConfList: [SingleLineInputConf, MultipleLineInputConf],
  },
  {
    groupId: 'chooseGroup',
    groupName: '用户选择',
    componentConfList: [SingleChoiceBoxConf, MultipleChoiceBoxConf],
  },
];

export const componentConf = [
  QuestionInfoConf,
  SingleLineHeadingConf,
  SingleLineParagraphConf,
  SingleLineInputConf,
  MultipleLineInputConf,
  SingleChoiceBoxConf,
  MultipleChoiceBoxConf,
];

export function getComponentConfByType(type: string) {
  return componentConf.find((i) => i.type === type);
}
