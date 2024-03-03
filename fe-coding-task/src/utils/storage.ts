import { FormParams } from "../components/homePage/houseParamsForm/types";

export enum StorageKeys {
  SEARCH_HISTORY = "SEARCH_HISTORY",
}

export const getSavedParametersFromStorage = () => {
  const items = localStorage.getItem(StorageKeys.SEARCH_HISTORY);
  return items ? JSON.parse(items) : [];
};

export const addNewParametersToStorage = (value: FormParams) => {
  const currentSave = getSavedParametersFromStorage();
  localStorage.setItem(
    StorageKeys.SEARCH_HISTORY,
    JSON.stringify([value, ...currentSave])
  );
};
