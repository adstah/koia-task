export type PostHouseParametersRequestDTO = {
  query: Array<{
    code: string;
    selection: { filter: string; values: string[] };
  }>;
  response: { format: string };
};

export type PostHouseParametersResponseDTO = {
  dimension: { Tid: { category: { label: { [key: string]: string } } } };
  value: Array<number>;
};
