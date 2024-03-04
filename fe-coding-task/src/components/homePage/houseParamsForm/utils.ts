import { NavigateFunction } from "react-router-dom";
import { PostHouseParametersRequestDTO } from "../../../services/dto/SSBService.dto";
import { FormParams } from "./types";
import { UseFormSetError } from "react-hook-form";
import { STARTING_YEAR } from "./const";

function generateQuarters(
  startYear: string,
  startQuarter: string,
  endYear: string,
  endQuarter: string
): string[] {
  const quarters: string[] = [];
  const startQuarterNum = +startQuarter[1];
  const endQuarterNum = +endQuarter[1];
  const startYearNum = +startYear;
  const endYearNum = +endYear;
  for (let year = +startYear; year <= endYearNum; +year++) {
    const firstQuarter = year === startYearNum ? startQuarterNum : 1;
    const lastQuarter = year === endYearNum ? endQuarterNum : 4;
    for (let quarter = firstQuarter; quarter <= lastQuarter; quarter++) {
      quarters.push(`${year}K${quarter}`);
    }
  }
  return quarters;
}

export const processFormValues = ({
  houseType,
  startYear,
  startQuarter,
  endYear,
  endQuarter,
}: FormParams): PostHouseParametersRequestDTO => {
  return {
    query: [
      { code: "Boligtype", selection: { filter: "item", values: [houseType] } },
      {
        code: "ContentsCode",
        selection: { filter: "item", values: ["KvPris"] },
      },
      {
        code: "Tid",
        selection: {
          filter: "item",
          values: generateQuarters(
            startYear,
            startQuarter,
            endYear,
            endQuarter
          ),
        },
      },
    ],
    response: { format: "json-stat2" },
  };
};

export const updateURL = (
  { houseType, startQuarter, startYear, endQuarter, endYear }: FormParams,
  navigate: NavigateFunction
) => {
  navigate(
    `?houseType=${houseType}&startYear=${startYear}&startQuarter=${startQuarter}&endQuarter=${endQuarter}&endYear=${endYear}`,
    { replace: true }
  );
};

export const validateYear = (value: string) => {
  return +value >= STARTING_YEAR && +value < new Date().getFullYear();
};

// validates whether end date is not earlier than starting date in filter
export const validateDateLogic = (
  values: FormParams,
  setErrors: UseFormSetError<FormParams>
) => {
  const areYearsSame = values.startYear === values.endYear;
  const isEndQLessThanStartQ = +values.endQuarter[1] < +values.startQuarter[1];
  const isStartYBiggerThanEndY = values.startYear > values.endYear;
  if ((areYearsSame && isEndQLessThanStartQ) || isStartYBiggerThanEndY) {
    setErrors("root", {});
    return false;
  }
  return true;
};
