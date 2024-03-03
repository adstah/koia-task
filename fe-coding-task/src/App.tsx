import { RoutingProvider } from "./routing/RoutingProvider";
import { SSBServiceContextProvider } from "./services/SSBServiceProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastSnackbar } from "./components/shared/ToastSnackbar/ToastSnackbar";
import "./App.css";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <SSBServiceContextProvider>
      <>
        <CssBaseline />
        <RoutingProvider />
        <ToastSnackbar />
      </>
    </SSBServiceContextProvider>
  );
}

export default App;
