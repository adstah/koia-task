import { styled } from "@mui/material";
import { LineChart } from "recharts";

export const StyledLineChart = styled(LineChart)`
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.primary.dark};
  border-radius: ${({ theme }) => theme.spacing(3)};
  box-shadow: ${({ theme }) => theme.shadows[11]};
`;

export const StyledTooltipValue = styled("p")`
  color: ${({ theme }) => theme.palette.primary.dark};
  font-weight: bold;
`;
