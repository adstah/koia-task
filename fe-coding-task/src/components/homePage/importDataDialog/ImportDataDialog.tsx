import { Button, ListItem, Typography } from "@mui/material";
import {
  ConfirmationDialog,
  ConfirmationDialogI,
} from "../../shared/confirmationDialog/ConfirmationDialog";
import { FormParams } from "../houseParamsForm/types";
import { useMemo } from "react";
import { StyledSavesToLoadList } from "./styles";
import { getSavedParametersFromStorage } from "../../../utils/storage";
import { convertArrayToObject } from "../../../utils/arrayToObject";
import { HOUSING_TYPES } from "../houseParamsForm/const";

interface ImportDataDialogI
  extends Omit<ConfirmationDialogI, "title" | "handleConfirm"> {
  title?: string;
  handleLoad: (values: FormParams) => void;
}

export const ImportDataDialog = ({
  open,
  handleClose,
  handleLoad,
}: ImportDataDialogI) => {
  const savedParams = useMemo(() => getSavedParametersFromStorage(), [open]);

  const housingTypes = useMemo(
    () => convertArrayToObject(HOUSING_TYPES, "value"),
    []
  );

  const handleSelectSave = (save: FormParams) => () => {
    handleLoad(save);
    handleClose();
  };

  return (
    <ConfirmationDialog
      title={"Load your saved data"}
      open={open}
      handleClose={handleClose}
    >
      <>
        {savedParams.length ? (
          <>
            <Typography>Select one from below ones:</Typography>
            <StyledSavesToLoadList>
              {savedParams.map((save: FormParams, i: number) => (
                <ListItem key={i}>
                  <Button onClick={handleSelectSave(save)} variant="contained">
                    {`House type: ${housingTypes[save.houseType].label}`}
                    <br />
                    {`Starting from: ${save.startYear} ${save.startQuarter} `}
                    <br />
                    {`Until: ${save.endYear} ${save.endQuarter}`}
                  </Button>
                </ListItem>
              ))}
            </StyledSavesToLoadList>
          </>
        ) : (
          <Typography>Nothing to load</Typography>
        )}
      </>
    </ConfirmationDialog>
  );
};
