import { StyledCircularProgress, StyledSpinner } from "./styles";

interface FullPageSpinnerI {
  isLoading: boolean;
}

// IMPORTANT: normally I would build a spinner that takes children, so it works as a wrapper, but for this case I like the full page general one.
export const FullPageSpinner = ({ isLoading }: FullPageSpinnerI) => {
  if (!isLoading) return null;

  return (
    <StyledSpinner>
      <StyledCircularProgress size={100} />
    </StyledSpinner>
  );
};
