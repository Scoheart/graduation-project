import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Button, Result } from 'antd';
import MainLayout from '../layout/MainLayout';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const _404: React.FC = () => (
  <MainLayout>
    <div className="flex flex-col justify-center items-center h-full ">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="default">回到主页</Button>}
      />
    </div>
  </MainLayout>
);
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: _404,
});
