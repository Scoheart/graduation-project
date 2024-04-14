import { FC, useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { LIMIT_NUM, SEARCH_LIMIT, SEARCH_PAGE } from '../constants';
import { useNavigate, useRouterState } from '@tanstack/react-router';

type PropsType = {
  total: number;
};

const ListPage: FC<PropsType> = (props: PropsType) => {
  const { total } = props;
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(LIMIT_NUM);

  // 从 url 参数中找到 page pageSize ，并且同步到 Pagination 组件中
  const context = useRouterState();
  const {
    location: { pathname, search },
  } = context;

  useEffect(() => {
    const page = parseInt((search as any)[SEARCH_PAGE] || '') || 1;
    setCurrent(page);
    const pageSize = parseInt((search as any)[SEARCH_LIMIT] || '') || LIMIT_NUM;
    setPageSize(pageSize);
  }, [search]);

  // 当 page pageSize 改变时，跳转页面（改变 url 参数）
  const navigate = useNavigate();
  function handlePageChange(page: number, pageSize: number) {
    navigate({
      to: pathname,
      search: {
        ...search,
        [SEARCH_PAGE]: page,
        [SEARCH_LIMIT]: pageSize,
      },
    });
  }

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={handlePageChange}
    />
  );
};

export default ListPage;
