import { Box, CircularProgress, styled } from "@mui/material";

export const StyledSpinner = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background: #00000020;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledCircularProgress = styled(CircularProgress)`
  filter: brightness(1.4);
`;
