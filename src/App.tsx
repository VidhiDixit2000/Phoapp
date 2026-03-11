import { StrictMode } from 'react'

import Login from './pages/Login.tsx';
import Profile from './pages/Profile.tsx';
import { Route, Routes } from 'react-router-dom';
import Movielistboard from './pages/Movielistboard.tsx';
import Moviewidget from './pages/Moviewidget.tsx';
import Privateroute from './router/privateroute.tsx';

 function App() {
  return (
  <StrictMode>
      <Routes>
        <Route path="/" element={<Privateroute><Profile /></Privateroute>} />
        <Route path="/Movielistboard" element={<Movielistboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/moviewidget" element={<Moviewidget/>} />
      </Routes>
  </StrictMode>
)

}
export default App;