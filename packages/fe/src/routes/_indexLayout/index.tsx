import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const Route = createFileRoute('/_indexLayout/')({
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  return (
    <div className=" h-[calc(100vh-64px-70px)] flex flex-col justify-center items-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe]">
      <div className=" text-center">
        <Title>问卷调查 | 在线投票</Title>
        <Paragraph>
          已累计创建问卷 1028 份，发布问卷 906 份，收到答卷 1314 份
        </Paragraph>
        <div>
          <Button
            type="primary"
            className=" bg-[#1677ff] h-[60px] text-[24px]"
            onClick={() =>
              navigate({
                to: '/manage/list',
              })
            }
          >
            开始使用
          </Button>
        </div>
      </div>
    </div>
  );
}
