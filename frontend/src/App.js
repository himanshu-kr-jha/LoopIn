import './App.css';
import Homepage from './Pages/Homepage';
import { Route, Routes } from "react-router-dom";
import Profile from './Pages/User/Profile';
import Navbar from './Components/Navbar';
import Profileupdate from './Pages/User/Profileupdate';
import TabbedLogin from './Components/TabbedLogin';

function App() {
  return (
    <div className="App">
      <nav>
        <Navbar />
      </nav>
      <Routes>
        <Route path="/" exact element={<Homepage />} />
      </Routes>
      <Routes>
        <Route path="/update" exact element={<Profileupdate />} />
      </Routes>
      <Routes>
        <Route path="/login" exact element={<TabbedLogin />} />
      </Routes>
      <Routes>
        <Route path="/profile" exact element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
