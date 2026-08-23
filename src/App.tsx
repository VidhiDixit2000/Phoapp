import { StrictMode } from 'react';
import { Route, Routes } from 'react-router-dom';

import Entry from './pages/Entry.tsx';
import LoginPage from './pages/LoginPage.tsx';
import Profile from './pages/Profile.tsx';
import Movielistboard from './pages/Movielistboard.tsx';
import Moviewidget from './pages/Moviewidget.tsx';
import { AuthContext } from './context/AuthContext.tsx';
import PrivateRoute from './router/privateroute.tsx';

function App() {
  return (
    <StrictMode>
      <AuthContext>
        <Routes>
          {/* Public — reachable with nobody logged in */}
          <Route path="/" element={<Entry />} />
          <Route path="/entry" element={<Entry />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — PrivateRoute decides whether these render at all,
              and supplies the logout button that appears on each of them */}
          <Route
            path="/movielistboard"
            element={
              <PrivateRoute>
                <Movielistboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/moviewidget"
            element={
              <PrivateRoute>
                <Moviewidget />
              </PrivateRoute>
            }
          />

          {/* Unrecognised URL — falls back to the entry page instead of
              rendering a blank screen */}
          <Route path="*" element={<Entry />} />
        </Routes>
      </AuthContext>
    </StrictMode>
  );
}

export default App;