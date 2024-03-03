import { PostHouseParametersResponseDTO } from "../../../services/dto/SSBService.dto";

export const processData = (data: PostHouseParametersResponseDTO) => {
  const xAxis = Object.keys(data.dimension.Tid.category.label);
  const yAxis = data.value;
  const outputArray = [];
  for (let i in xAxis) {
    outputArray.push({ timestamp: xAxis[i], value: yAxis[i] });
  }
  return outputArray;
};
