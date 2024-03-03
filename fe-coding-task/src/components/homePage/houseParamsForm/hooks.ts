import { useSearchParams } from "react-router-dom";

export const useLoadFromURL = () => {
  const [searchParams] = useSearchParams();
  const defaultValues = {
    houseType: searchParams.get("houseType") || "",
    startQuarter: searchParams.get("startQuarter") || "",
    endQuarter: searchParams.get("endQuarter") || "",
    startYear: searchParams.get("startYear") || "",
    endYear: searchParams.get("endYear") || "",
  };
  return defaultValues;
};
