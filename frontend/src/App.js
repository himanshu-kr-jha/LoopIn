import './App.css';
import Homepage from './Pages/Homepage';
import { Route, Routes } from "react-router-dom";
import Profile from './Pages/User/Profile';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div className="App">
      <nav>
        <Navbar/>
      </nav>
      <Routes>
        <Route path="/home" element={<Homepage />} />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
