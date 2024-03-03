import { Box, styled } from "@mui/material";

export const StyledHomePage = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(0.5)};

  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
    padding: ${({ theme }) => theme.spacing(5)};
  }
`;
