import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export interface ConfirmationDialogI {
  open: boolean;
  handleClose: () => void;
  handleConfirm?: () => void;
  title: string;
  children?: string | React.ReactElement;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmationDialog = ({
  title,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  children,
  open,
  handleClose,
  handleConfirm,
}: ConfirmationDialogI) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          {cancelLabel}
        </Button>
        {handleConfirm && (
          <Button onClick={handleConfirm} variant="contained">
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
