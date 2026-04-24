import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExcursionsPage from './pages/ExcursionsPage';
import ExcursionDetailPage from './pages/ExcursionDetailPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminRoot from './pages/admin/AdminRoot';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin — bez Navbara i Footera */}
        <Route path="/admin/*" element={<AdminRoot />} />

        {/* Javna stranica */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/izleti" element={<ExcursionsPage />} />
                <Route path="/izleti/:slug" element={<ExcursionDetailPage />} />
                <Route path="/galerija" element={<GalleryPage />} />
                <Route path="/o-nama" element={<AboutPage />} />
                <Route path="/kontakt" element={<ContactPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
