'use client';

import React, { FC, useEffect, useState } from 'react';

type PropsType = {
  com_id: string;
  props: {
    title: string;
    isVertical?: boolean;
    list: Array<{
      value: string;
      text: string;
      checked: boolean;
    }>;
  };
};

const MultipleChoiceBox: FC<PropsType> = ({ com_id, props }) => {
  const { title, isVertical, list = [] } = props;

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const selected = selectedValues.map((selectedValue) => {
      const a = list.find((i) => i.value === selectedValue);
      return a?.text!;
    });
    setData(selected);
  }, [selectedValues]);

  // 初始化时，判断默认选中
  useEffect(() => {
    list.forEach((item) => {
      const { value, checked, text } = item;
      if (checked) {
        setSelectedValues((selectedValues) => selectedValues.concat(value));
      }
    });
  }, [list]);

  // 切换选中
  function toggleChecked(value: string) {
    if (selectedValues.includes(value)) {
      // 已经被选中了，则取消选择
      setSelectedValues((selectedValues) =>
        selectedValues.filter((v) => v !== value)
      );
    } else {
      // 未被选中，则增加选择
      setSelectedValues(selectedValues.concat(value));
    }
  }

  return (
    <>
      <p>{title}</p>

      <input type="hidden" name={com_id} value={data.toString()} />
      <ul className=" p-0 list-none ">
        {list.map((item) => {
          const { value, text, checked } = item;

          let className;
          if (isVertical) className = ' mb-[10px]';
          else className = 'inline-block mr-[10px]';

          return (
            <li key={value} className={className}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => toggleChecked(value)}
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

export default MultipleChoiceBox;
