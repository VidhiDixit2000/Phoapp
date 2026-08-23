import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Data } from "../context/AuthContext";
import "../styles/Logout.css";

// Barrier component: renders its children only if someone is logged in.
// Otherwise it redirects to the login page.
// `replace` stops the blocked URL from piling up in browser history, so
// the back button doesn't bounce the user into a redirect loop.
//
// It also renders the logout button. Every page that needs the button is
// exactly a page that sits behind this guard, so putting it here means it
// appears on all of them without touching a single page component.
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(Data);

  if (!context) {
    throw new Error("This component must be wrapped in AuthContext");
  }

  const { currentUser, logout } = context;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // No navigate() call needed after logging out. logout() sets currentUser
  // to null, which re-renders this component, which makes the check above
  // fail, which fires <Navigate> — the guard redirects on its own.
  return (
    <>
      <button type="button" className="logout-btn" onClick={logout}>
        Log out
      </button>
      {children}
    </>
  );
};

export default PrivateRoute;