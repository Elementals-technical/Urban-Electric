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

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("asset");

  useEffect(() => {
    axios({
      method: "get",
      url: `https://preview.threekit.com/api/v2/assets/${product}?bearer_token=17862278-d8a2-4522-a7c2-53943e097393`,
    }).then(function (response) {
      document.title = response.data.name;
    });
  }, []);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
