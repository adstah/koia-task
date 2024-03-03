import { useState } from "react";
import { HouseParamsForm } from "../components/homePage/houseParamsForm/HouseParamsForm";
import { PricesGraph } from "../components/homePage/pricesGraph/PricesGraph";
import { PostHouseParametersResponseDTO } from "../services/dto/SSBService.dto";
import { StyledHomePage } from "./styles";
import { FullPageSpinner } from "../components/shared/fullPageSpinner/FullPageSpinner";

export const HomePage = () => {
  const [priceStatistics, setPriceStatistics] = useState<
    PostHouseParametersResponseDTO | null | undefined
  >(null);
  return (
    <StyledHomePage component="main">
      <HouseParamsForm setPriceStatistics={setPriceStatistics} />
      {priceStatistics?.dimension && <PricesGraph data={priceStatistics} />}
      <FullPageSpinner isLoading={priceStatistics === undefined} />
    </StyledHomePage>
  );
};
