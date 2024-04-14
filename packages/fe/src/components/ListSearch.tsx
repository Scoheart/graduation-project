import { FC, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Input } from 'antd';
import { SEARCH_KEYWORD } from '../constants';
import { useNavigate, useRouterState } from '@tanstack/react-router';

const { Search } = Input;

const ListSearch: FC = () => {
  const navigate = useNavigate();
  const context = useRouterState();
  const {
    location: { pathname, search },
  } = context;

  const [value, setValue] = useState('');
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  useEffect(() => {
    const curVal = (search as any)[SEARCH_KEYWORD] || '';
    setValue(curVal);
  }, [search]);

  function handleSearch(value: string) {
    // 跳转页面，增加 url 参数
    navigate({
      to: `${pathname}`,
      search: {
        [SEARCH_KEYWORD]: value,
      }, // 去掉了 page pageSize
    });
  }

  return (
    <Search
      size="large"
      allowClear
      placeholder="输入关键字"
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      className=" w-[260px]"
    />
  );
};

export default ListSearch;
