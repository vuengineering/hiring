import * as React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import axios from "axios";
import { EuiProvider } from "@elastic/eui";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

const App: React.FC = () => {
  return (
    <>
      <EuiProvider colorMode="dark">
        <RouterProvider router={router} />
      </EuiProvider>
    </>
  );
};

export default App;
