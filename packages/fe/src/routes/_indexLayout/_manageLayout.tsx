import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getToken } from '../../utils';

export const Route = createFileRoute('/_indexLayout/_manageLayout')({
  beforeLoad: () => {
    const access_token = getToken();
    if (!access_token) {
      throw redirect({
        to: '/sign',
      });
    }
  },
  component: () => <Outlet />,
});
