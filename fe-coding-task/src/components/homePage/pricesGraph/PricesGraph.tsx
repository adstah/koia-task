import {
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  YAxis,
  Legend,
  TooltipProps,
} from "recharts";
import { PostHouseParametersResponseDTO } from "../../../services/dto/SSBService.dto";
import { useMemo } from "react";
import { processData } from "./utils";
import { StyledLineChart, StyledTooltipValue } from "./styles";
import { useTheme } from "@mui/material";

interface PricesGraphI {
  data: PostHouseParametersResponseDTO;
}

export const PricesGraph = ({ data }: PricesGraphI) => {
  const processedData = useMemo(() => processData(data), [data]);
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height={400}>
      <StyledLineChart data={processedData}>
        <XAxis
          dataKey="timestamp"
          name="Quarter"
          label={{
            value: "Time Period",
            position: "insideBottom",
            offset: -5,
          }}
        />
        <YAxis
          name="Price"
          label={{
            value: "Price [NOK] / m2",
            angle: -90,
            position: "insideLeft",
            offset: -5,
          }}
        />
        <Tooltip content={CustomTooltip} />
        <CartesianGrid stroke={theme.palette.grey[400]} />
        <Line
          type="natural"
          dataKey="value"
          stroke={theme.palette.primary.main}
        />
        <Legend formatter={CustomizedLegend} />
      </StyledLineChart>
    </ResponsiveContainer>
  );
};

const CustomizedLegend = () => {
  return (
    <span>
      <b>Average prices of m2 over time</b>
    </span>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p>
          <b>{`Date: ${label}`}</b>
        </p>
        <StyledTooltipValue>{`Price: ${payload[0].value} NOK / m2`}</StyledTooltipValue>
      </div>
    );
  }

  return null;
};
