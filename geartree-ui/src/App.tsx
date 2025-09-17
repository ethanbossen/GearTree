// App.tsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Guitars from "./pages/Guitars";
import Amplifiers from "./pages/Amplifiers";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ArtistPage from "./pages/ArtistPage";
import AmpDetailPage from "./pages/AmpDetailPage";
import GuitarDetailPage from "./pages/GuitarDetailPage";
import Admin from "./pages/Admin";
import AllArtistsPage from "./pages/AllArtistsPage";
import ScrollToTop from "./components/ScrollToTop";


function App() {
  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main className="page-content">
        <ScrollToTop />
        <Routes>
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="/guitars/:id" element={<GuitarDetailPage />} />
          <Route path="/amplifiers/:id" element={<AmpDetailPage/>} />
          <Route path="/artists" element={<AllArtistsPage />} />
          <Route path="/guitars" element={<Guitars />} />
          <Route path="/amplifiers" element={<Amplifiers />} />
          <Route path="/" element={<Home />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;