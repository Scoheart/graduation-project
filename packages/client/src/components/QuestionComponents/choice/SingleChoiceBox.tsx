import React, { FC } from 'react';

type PropsType = {
  com_id: string;
  props: {
    title: string;
    options: Array<{
      value: string;
      text: string;
    }>;
    value: string;
    isVertical: boolean;
  };
};

const SingleChoiceBox: FC<PropsType> = ({ com_id, props }) => {
  const { title, options = [], value, isVertical } = props;

  return (
    <>
      <p>{title}</p>
      <ul className=" p-0 list-none ">
        {options.map((opt) => {
          const { value: val, text } = opt;

          // 判断竖向、横向
          let liClassName = '';
          if (isVertical) liClassName = ' mb-[10px]';
          else liClassName = 'inline-block mr-[10px]';

          return (
            <li key={val} className={liClassName}>
              <label>
                <input
                  type="radio"
                  name={com_id}
                  value={val}
                  defaultChecked={val === value}
                />
                {text}
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SingleChoiceBox;
