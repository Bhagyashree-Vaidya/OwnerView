import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Reviews from './pages/Reviews';
import WorkingFiles from './pages/WorkingFiles';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/working-files" element={<WorkingFiles />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;