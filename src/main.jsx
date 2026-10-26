import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Home from "./modules/Home";
import PokemonDetail from "./modules/PokemonDetail";
import TypeDetail from "./modules/TypeDetail";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:nombre" element={<PokemonDetail />} />
        <Route path="/tipo/:nombre" element={<TypeDetail />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>,
);
