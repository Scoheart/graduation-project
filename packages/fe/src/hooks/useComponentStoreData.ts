import { useComponentStore } from '../store/componentStore';

export const useComponentStoreData = () => {
  const { componentList, selectedId, copiedComponent } = useComponentStore();

  const selectedComponent = componentList.find(
    (component) => component.com_id === selectedId
  );

  return {
    componentList,
    selectedId,
    selectedComponent,
    copiedComponent,
  };
};
