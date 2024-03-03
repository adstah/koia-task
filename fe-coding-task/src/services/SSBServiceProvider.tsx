import { createContext, useContext } from "react";
import { SERVER_URL } from "../xhr/urls";
import { POST } from "../xhr/httpUtils";
import {
  PostHouseParametersRequestDTO,
  PostHouseParametersResponseDTO,
} from "./dto/SSBService.dto";
import { SSB_TABLE } from "../components/homePage/houseParamsForm/const";

interface SSBServiceContextI {
  postHouseParameters: (
    body: PostHouseParametersRequestDTO
  ) => Promise<PostHouseParametersResponseDTO>;
}

interface SSBServiceContextProviderI {
  children: React.ReactElement;
}

export const SSBServiceContext = createContext({} as SSBServiceContextI);

const useService = () => {
  const url = SERVER_URL;

  const postHouseParameters: SSBServiceContextI["postHouseParameters"] = (
    body
  ) => POST(`${url}/no/table/${SSB_TABLE}`, body).then((res) => res.json());

  return { postHouseParameters };
};

export const SSBServiceContextProvider = ({
  children,
}: SSBServiceContextProviderI) => {
  return (
    <SSBServiceContext.Provider value={useService()}>
      {children}
    </SSBServiceContext.Provider>
  );
};

export const useSSBService = () => useContext(SSBServiceContext);
