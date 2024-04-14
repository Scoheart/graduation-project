import { Link } from '@tanstack/react-router';
import { FC, ReactNode } from 'react';

type propsType = {
  children: ReactNode;
};

const MainLayout: FC<propsType> = ({ children }) => {
  return (
    <>
      <header className="backdrop-blur-sm bg-white/30 fixed w-full">
        <nav className="flex justify-between items-center h-16 px-12">
          <Link to="/" className="text-3xl font-extrabold">
            在线问卷
          </Link>
          <Link to="/sign" className="text-xl font-extrabold">
            登陆
          </Link>
        </nav>
      </header>
      <main className="h-[calc(100vh-64px)] pt-16 bg-slate-100">
        {children}
      </main>
      <footer className="h-16 flex justify-center items-center gap-2">
        在线问卷 2023 - present. Created by
        <span className=" text-blue-500">@Scoheart</span>
      </footer>
    </>
  );
};

export default MainLayout;
