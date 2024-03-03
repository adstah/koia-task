import { RoutingProvider } from "./routing/RoutingProvider";
import { SSBServiceContextProvider } from "./services/SSBServiceProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastSnackbar } from "./components/shared/ToastSnackbar/ToastSnackbar";
import { AppCssBaseline } from "./AppCssBaseline";
import "./App.css";

function App() {
  return (
    <SSBServiceContextProvider>
      <>
        <AppCssBaseline />
        <RoutingProvider />
        <ToastSnackbar />
      </>
    </SSBServiceContextProvider>
  );
}

export default App;
