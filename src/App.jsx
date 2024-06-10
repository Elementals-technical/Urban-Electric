import { useEffect } from "react";
import "./App.css";
import { PlayerThreeKit } from "./PlayerThreeKit/PlayerThreekit";
import axios from "axios";
import { ControlConfig } from "./ControlConfig/ControlConfig";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoaderWrap } from "./LoaderWrap/LoaderWrap";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <LoaderWrap/>
        <PlayerThreeKit />
        <ControlConfig />
      </>
    ),
  },
]);

export const THREEKIT_PARAMS = {
  threekitUrl: "https://preview.threekit.com/",
  authToken: "7de00d68-4ac7-4622-9169-e96ffea0aa85",
  // authToken: "44999d4a-2071-455b-94f1-6f8b2b240517",
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
