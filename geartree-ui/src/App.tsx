// App.tsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Artists from "./pages/Artists";
import Guitars from "./pages/Guitars";
import Amplifiers from "./pages/Amplifiers";
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main className="page-content">
        <Routes>
          <Route path="/artists" element={<Artists />} />
          <Route path="/guitars" element={<Guitars />} />
          <Route path="/amplifiers" element={<Amplifiers />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;