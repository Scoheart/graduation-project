import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  username: string;
  nickname: string;
}

interface Action {
  setUserInfo: (state: State) => void;
  removeUserInfo: () => void;
}

export const useUserInfoStore = create<State & Action>()(
  devtools(
    persist(
      immer((set) => ({
        username: '',
        nickname: '',
        setUserInfo: ({ username, nickname }) =>
          set((state: State) => {
            state.username = username;
            state.nickname = nickname;
          }),
        removeUserInfo: () =>
          set((state: State) => {
            state.username = '';
            state.nickname = '';
          }),
      })),
      {
        name: 'userInfo',
      }
    )
  )
);
