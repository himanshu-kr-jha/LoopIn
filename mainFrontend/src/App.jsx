import './App.css';
import Homepage from './Pages/Homepage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './Pages/User/Profile';
import Navbar from './Components/Navbar';
import Profileupdate from './Pages/User/Profileupdate';
import TabbedLogin from './Components/TabbedLogin';
import AuthSuccess from './Pages/AuthSuccess';
import ErrorPage from './Components/ErrorPage';
import Footer from './Components/Footer';
import Society from './Pages/Society/allSociety';
import SocietyDetail from './Pages/Society/society';
import Home from './home/Home';
import { VerifyUser } from './utils/VerifyUser';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/update" element={<Profileupdate />} />
        <Route path="/login" element={<TabbedLogin />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/society/all" element={<Society />} />
        <Route path="/society/:id" element={<SocietyDetail />} />
        <Route element={<VerifyUser />}>
          <Route path="/chat/home" element={<Home />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
