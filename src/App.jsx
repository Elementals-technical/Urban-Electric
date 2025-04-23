import { useEffect } from "react";
import "./App.css";
import axios from "axios";
import {
  createBrowserRouter,
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import { PlayerScreen } from "./screen/PlayerScreen/PlayerScreen";
import { UrlService } from "./services/UrlService";

export const THREEKIT_PARAMS = {
  threekitUrl: "https://preview.threekit.com/",
  authToken: "eaef7621-6bf7-43d3-b8a3-cfe5afd9bc26",
  assetId: "37ccc1f5-f061-4c7b-9e15-5339214deef7",
};

function App() {
  const product = UrlService.getAsset();

  console.log("product", product);

  useEffect(() => {
    axios({
      method: "get",
      url: `https://preview.threekit.com/api/v2/assets/${product}?bearer_token=${THREEKIT_PARAMS.authToken}`,
    }).then(function (response) {
      document.title = response.data.name;
    });
  }, []);
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlayerScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
