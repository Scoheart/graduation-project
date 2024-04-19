import { useKeyPress } from 'ahooks';
import { useComponentStore } from '../store/componentStore';

/**
 * 判断 activeElem 是否合法
 */
function isActiveElementValid() {
  const activeElem = document.activeElement;

  // // 没有增加 dnd-kit 之前
  // if (activeElem === document.body) return true // 光标没有 focus 到 input

  // 增加了 dnd-kit 以后
  if (activeElem === document.body) return true;
  if (activeElem?.matches('div[role="button"]')) return true;

  return false;
}

function useBindCanvasKeyPress() {
  const {
    removeSelectedComponent,
    copySelectedComponent,
    pasteCopiedComponent,
    selectPrevComponent,
    selectNextComponent
  } = useComponentStore();
  // 删除组件
  useKeyPress(['backspace', 'delete'], () => {
    if (!isActiveElementValid()) return;
    removeSelectedComponent();
  });

  // 复制
  useKeyPress(['ctrl.c', 'meta.c'], () => {
    if (!isActiveElementValid()) return;
    copySelectedComponent();
  });

  // 粘贴
  useKeyPress(['ctrl.v', 'meta.v'], () => {
    if (!isActiveElementValid()) return;
    pasteCopiedComponent();
  });

  // 选中上一个
  useKeyPress('uparrow', () => {
    if (!isActiveElementValid()) return;
    selectPrevComponent();
  });

  // 选中下一个
  useKeyPress('downarrow', () => {
    if (!isActiveElementValid()) return;
    selectNextComponent();
  });

  // 撤销

  // 重做
}

export default useBindCanvasKeyPress;
