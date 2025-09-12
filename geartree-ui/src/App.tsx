// App.tsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Artists from "./pages/Artists";
import Guitars from "./pages/Guitars";
import Amplifiers from "./pages/Amplifiers";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ArtistPage from "./pages/ArtistPage";
import AmpDetail from "./pages/AmpDetail";
import GuitarDetail from "./pages/GuitarDetail";


function App() {
  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main className="page-content">
        <Routes>
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="/guitars/:id" element={<GuitarDetail />} />
          <Route path="/amplifiers/:id" element={<AmpDetail/>} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/guitars" element={<Guitars />} />
          <Route path="/amplifiers" element={<Amplifiers />} />
          <Route path="/" element={<Home />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;