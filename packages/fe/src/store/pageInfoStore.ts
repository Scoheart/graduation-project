import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  title: string;
  desc?: string;
  js?: string;
  css?: string;
  isPublished?: boolean;
}

interface Action {
  changePageTitle: (title: string) => void;
  resetPageInfo: (pageInfo: State) => void;
}

export const usePageInfoStore = create<State & Action>()(
  devtools(
    persist(
      immer((set) => ({
        title: '',
        desc: '',
        js: '',
        css: '',
        changePageTitle: (title) => {
          set((state: State) => {
            state.title = title;
          });
        },
        resetPageInfo: ({ title, desc, js, css }: State) => {
          set({
            title,
            desc,
            js,
            css,
          });
        },
      })),
      {
        name: 'pageInfo',
      }
    )
  )
);
