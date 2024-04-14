import React, { FC } from 'react';

type PropsType = {
  com_id: string;
  props: {
    title: string;
    placeholder?: string;
  };
};

const SingleLineInput: FC<PropsType> = ({ com_id, props }) => {
  const { title, placeholder = '' } = props;

  return (
    <>
      <p>{title}</p>
      <div className=" mb-4">
        <input
          name={com_id}
          placeholder={placeholder}
          className=" w-full border border-[#d8d8d8] rounded box-border py-[6px] px-3"
        />
      </div>
    </>
  );
};

export default SingleLineInput;
