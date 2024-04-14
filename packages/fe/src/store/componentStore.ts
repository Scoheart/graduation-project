import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import cloneDeep from 'lodash.clonedeep';
import { nanoid } from 'nanoid';
interface Component {
  com_id: string;
  type: string;
  title: string;
  isHidden?: boolean;
  isLocked?: boolean;
  props: {
    [key: string]: any;
  };
}

interface State {
  selectedId: string;
  componentList: Array<Component>;
  copiedComponent: Component | null;
}

interface Action {
  resetComponent: (stat: State) => void;
  setComponentList: (componentList: Array<Component>) => void;
  changeSelectedId: (id: string) => void;
  addComponentList: (newComponent: Component) => void;
  changeComponentProps: (com_id: string, newProps: any) => void;
  removeSelectedComponent: () => void;
  changeComponentHidden: (com_id: string, isHidden: boolean) => void;
  toggleComponentLocked: (com_id: string) => void;
  copySelectedComponent: () => void;
  pasteCopiedComponent: () => void;
  changeComponentTitle: (com_id: string, title: string) => void;
  removeComponentList: () => void;
}

export const useComponentStore = create<State & Action>()(
  devtools(
    persist(
      immer((set) => ({
        selectedId: '',
        componentList: [],
        copiedComponent: null,
        resetComponent: ({ selectedId, componentList, copiedComponent }) =>
          set({ selectedId, componentList, copiedComponent }),
        setComponentList: (componentList) => set({ componentList }),
        changeSelectedId: (id) => set({ selectedId: id }),
        addComponentList: (newComponent) =>
          set(({ selectedId, componentList }: State) => {
            const index = componentList.findIndex(
              (component) => component.com_id === selectedId
            );
            if (index < 0) {
              // 未选中任何组件
              componentList.push(newComponent);
            } else {
              // 选中了组件，插入到 index 后面
              componentList.splice(index + 1, 0, newComponent);
            }
          }),
        changeComponentProps: (com_id, newProps) =>
          set(({ componentList }: State) => {
            const curComp = componentList.find(
              (component) => component.com_id === com_id
            );
            if (curComp) {
              curComp.props = {
                ...curComp.props,
                ...newProps,
              };
            }
          }),
        removeSelectedComponent: () =>
          set((state: State) => {
            let { selectedId, componentList } = state;
            const removedId = selectedId;
            const newSelectedId = getNextSelectedId(removedId, componentList);
            // 上面的解构的 selectedId 是另一个，这里重新赋值到 state 里面
            state.selectedId = newSelectedId;
            const index = componentList.findIndex(
              (c) => c.com_id === removedId
            );
            componentList.splice(index, 1);
          }),
        changeComponentHidden: (com_id, isHidden) =>
          set((state: State) => {
            const { componentList } = state;
            // 重新计算 selectedId
            let newSelectedId = '';
            if (isHidden) {
              // 要隐藏
              newSelectedId = getNextSelectedId(com_id, componentList);
            } else {
              // 要显示
              newSelectedId = com_id;
            }
            state.selectedId = newSelectedId;

            const curComp = componentList.find((c) => c.com_id === com_id);
            if (curComp) {
              curComp.isHidden = isHidden;
            }
          }),
        toggleComponentLocked: (com_id) =>
          set(({ componentList }: State) => {
            const curComp = componentList.find((c) => c.com_id === com_id);
            if (curComp) {
              curComp.isLocked = !curComp.isLocked;
            }
          }),
        copySelectedComponent: () =>
          set((state: State) => {
            const { selectedId, componentList = [] } = state;
            const selectedComponent = componentList.find(
              (c) => c.com_id === selectedId
            );
            if (selectedComponent == null) return;
            state.copiedComponent = cloneDeep(selectedComponent); // 深拷贝
          }),
        pasteCopiedComponent: () =>
          set((state: State) => {
            const { copiedComponent } = state;
            if (copiedComponent == null) return;

            // 要把 fe_id 给修改了，重要！！
            copiedComponent.com_id = nanoid();

            // 插入 copiedComponent
            insertNewComponent(state, copiedComponent);
          }),
        changeComponentTitle: (com_id, title) =>
          set((state: State) => {
            const curComp = state.componentList.find(
              (c) => c.com_id === com_id
            );
            if (curComp) curComp.title = title;
          }),
        removeComponentList: () => set({ componentList: [] }),
      })),
      { name: 'componentList' }
    )
  )
);

export function getNextSelectedId(
  com_id: string,
  componentList: Array<Component>
) {
  const visibleComponentList = componentList.filter((c) => !c.isHidden);
  const index = visibleComponentList.findIndex((c) => c.com_id === com_id);
  if (index < 0) return '';

  // 重新计算 selectedId
  let newSelectedId = '';
  const length = visibleComponentList.length;
  if (length <= 1) {
    // 组件长度就一个，被删除了，就没有组件
    newSelectedId = '';
  } else {
    // 组件长度 > 1
    if (index + 1 === length) {
      // 要删除最后一个，就要选中上一个
      newSelectedId = visibleComponentList[index - 1].com_id;
    } else {
      // 要删除的不是最后一个，删除以后，选中下一个
      newSelectedId = visibleComponentList[index + 1].com_id;
    }
  }

  return newSelectedId;
}

export function insertNewComponent(state: State, newComponent: Component) {
  const { selectedId, componentList } = state;
  const index = componentList.findIndex((c) => c.com_id === selectedId);

  if (index < 0) {
    // 未选中任何组件
    state.componentList.push(newComponent);
  } else {
    // 选中了组件，插入到 index 后面
    state.componentList.splice(index + 1, 0, newComponent);
  }

  state.selectedId = newComponent.com_id;
}
