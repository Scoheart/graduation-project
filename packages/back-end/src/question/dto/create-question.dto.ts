export class CreateQuestionDto {
  id: number;
  title: string;
  desc: string;
  js: string;
  css: string;
  isStar: boolean;
  isPublished: boolean;
  isDeleted: boolean;
  componentList: Array<Component>;
}

interface Component {
  com_id: string;
  type: string;
  title: string;
  isHidden?: boolean;
  isLocked?: boolean;
  props: {
    [key: string]: any;
  };
}
