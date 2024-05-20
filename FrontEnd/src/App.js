import './App.css';
import './styles/prettify.css';
import './styles/base.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoveragesPage from './pages/CoveragesPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coverages" element={<CoveragesPage />} />
      </Routes>
    </>
  );
}

export default App;
