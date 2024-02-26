import { useEffect } from "react";
import "./App.css";
import { PlayerThreeKit } from "./PlayerThreeKit/PlayerThreekit";
import axios from "axios";
import { ControlConfig } from "./ControlConfig/ControlConfig";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <PlayerThreeKit />
        <ControlConfig />
      </>
    ),
  },
]);

export const THREEKIT_PARAMS = {
  threekitUrl: "https://preview.threekit.com/",
  authToken: "5d3654ea-188c-4096-ae42-fcecb79bc16d",
  assetId: "ed10ae9e-aa26-437a-bb0f-61e09430c89e",
};

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("asset");

  useEffect(() => {
    axios({
      method: "get",
      url: `https://preview.threekit.com/api/v2/assets/${product}?bearer_token=${THREEKIT_PARAMS.authToken}`,
    }).then(function (response) {
      document.title = response.data.name;
    });
  }, []);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
