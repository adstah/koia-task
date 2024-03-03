import { Box, styled } from "@mui/material";

export const StyledHouseParamsForm = styled(Box)`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.palette.primary.dark};
  border-radius: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  box-shadow: ${({ theme }) => theme.shadows[11]};
  max-width: 600px;
  gap: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

export const StyledTimeBoundarySection = styled(Box)`
  width: 100%;
  display: grid;
  grid-template-columns: 100px 1fr 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;
