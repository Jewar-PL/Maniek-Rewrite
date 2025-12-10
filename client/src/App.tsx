import { BrowserRouter, Routes, Route } from "react-router";

import Map from "@/pages/Map";
import Info from "@/pages/Info";
import TVPlayer from "@/pages/TVPlayer";

import Layout from "@/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Map />} />
          <Route path="info" element={<Info />} />
          {/* TODO: The rest of routes */}
        </Route>

        <Route path="tv-player" element={<TVPlayer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
