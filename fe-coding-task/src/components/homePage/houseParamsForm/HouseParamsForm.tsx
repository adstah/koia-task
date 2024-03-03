import { useForm, Controller, useWatch } from "react-hook-form";
import { StyledHouseParamsForm, StyledTimeBoundarySection } from "./styles";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HOUSING_TYPES, QUARTERS, SSB_TABLE } from "./const";
import { useSSBService } from "../../../services/SSBServiceProvider";
import { FormParams } from "./types";
import { ConfirmationDialog } from "../../shared/confirmationDialog/ConfirmationDialog";
import { addNewParametersToStorage } from "../../../utils/storage";
import {
  processFormValues,
  updateURL,
  validateDateLogic,
  validateYear,
} from "./utils";
import { ImportDataDialog } from "../importDataDialog/ImportDataDialog";
import { useNavigate } from "react-router-dom";
import { PostHouseParametersResponseDTO } from "../../../services/dto/SSBService.dto";
import { useLoadFromURL } from "./hooks";

interface HouseParamsFormI {
  setPriceStatistics: Dispatch<
    SetStateAction<PostHouseParametersResponseDTO | null | undefined>
  >;
}

export const HouseParamsForm = ({ setPriceStatistics }: HouseParamsFormI) => {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const defaultValues = useLoadFromURL();

  const {
    register,
    handleSubmit,
    getValues,
    control,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormParams>({
    defaultValues,
  });
  const data = useWatch({ control });
  const { postHouseParameters } = useSSBService();

  useEffect(() => {
    updateURL(getValues(), navigate);
  }, [data]);

  const handlePostParams = (data: FormParams) => {
    if (!validateDateLogic(getValues(), setError)) return;
    const processedParameters = processFormValues(data);
    setPriceStatistics(undefined);
    postHouseParameters(processedParameters)
      .then(setPriceStatistics)
      .then(() => {
        setIsSaveDialogOpen(true);
      })
      .catch(() => setPriceStatistics(null));
  };

  const handleSaveToStorage = () => {
    addNewParametersToStorage(getValues());
    setIsSaveDialogOpen(false);
  };

  const handleLoadDataFromStorage = (values: FormParams) => {
    reset(values);
  };

  const handleOpenLoadDialog = () => {
    setIsLoadDialogOpen(true);
  };

  const handleCloseSaveDialog = () => {
    setIsSaveDialogOpen(false);
  };

  const handleCloseLoadDialog = () => {
    setIsLoadDialogOpen(false);
  };

  return (
    <StyledHouseParamsForm
      component="form"
      onSubmit={handleSubmit(handlePostParams)}
    >
      <Typography variant="h4">House params</Typography>
      <Button variant="outlined" onClick={handleOpenLoadDialog}>
        Load saved data
      </Button>
      <Divider />
      <TextField label="Table #" disabled value={SSB_TABLE} />
      <FormControl>
        <InputLabel id="housing-type-input">Housing type</InputLabel>
        <Controller
          name="houseType"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              labelId={`housing-type-input`}
              label="Housing type"
              onChange={onChange}
              value={value}
              ref={ref}
            >
              {HOUSING_TYPES.map(({ label, value }) => (
                <MenuItem key={label} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      {[
        { title: "Starting from", variant: "start" },
        { title: "Until", variant: "end" },
      ].map(({ title, variant }) => (
        <StyledTimeBoundarySection key={`${title}${variant}`}>
          <Typography>{title}</Typography>
          <TextField
            label="Year"
            type="number"
            {...register(`${variant}Year` as "startYear", {
              required: true,
              validate: validateYear,
            })}
          />
          <FormControl>
            <InputLabel id={`quarter-input-${variant}`}>Quarter</InputLabel>
            <Controller
              name={`${variant}Quarter` as "startQuarter"}
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  labelId={`quarter-input-${variant}`}
                  label="Quarter"
                  onChange={onChange}
                  value={value}
                  ref={ref}
                >
                  {QUARTERS.map((q) => (
                    <MenuItem key={q} value={q}>
                      {q}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </StyledTimeBoundarySection>
      ))}
      {(errors.endQuarter || errors.startQuarter) && (
        <Typography color="error">Quarters need to be filled</Typography>
      )}
      {(errors.endYear || errors.startYear) && (
        <Typography color="error">
          Years less than 2019 and greater than the current date are not
          allowed.
        </Typography>
      )}
      {errors.root && (
        <Typography color="error">
          {'"Until" cannot be earlier than "Starting from"'}
        </Typography>
      )}
      <Button type="submit" variant="contained">
        Submit
      </Button>
      <ConfirmationDialog
        open={isSaveDialogOpen}
        handleClose={handleCloseSaveDialog}
        handleConfirm={handleSaveToStorage}
        title="Would you like to save this query?"
      />
      <ImportDataDialog
        open={isLoadDialogOpen}
        handleClose={handleCloseLoadDialog}
        handleLoad={handleLoadDataFromStorage}
      />
    </StyledHouseParamsForm>
  );
};
