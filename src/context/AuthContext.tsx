import { createContext, useCallback, useEffect, useRef, useState } from "react";

type UserDetails = {
  name: string;
  email: string;
  password: string;
};

type CurrentUser = {
  name: string;
  email: string;
};

type SignupResult = { success: boolean; message?: string };

type AuthContextType = {
  signup: (userdetails: UserDetails) => SignupResult;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  currentUser: CurrentUser | null;
  notes: string | null;
  saveNotes: (notes: string | null) => void;
  selectedMovies: string[];
  saveSelectedMovies: (movies: string[]) => void;
};

const Data = createContext<AuthContextType | null>(null);

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUserEmail";

function notesKey(email: string) {
  return `notes_${email}`;
}
function moviesKey(email: string) {
  return `selectedMovies_${email}`;
}

function getUsers(): UserDetails[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as UserDetails[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: UserDetails[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadUserData(email: string) {
  const notes = localStorage.getItem(notesKey(email));
  let selectedMovies: string[] = [];
  try {
    const raw = localStorage.getItem(moviesKey(email));
    selectedMovies = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    selectedMovies = [];
  }
  return { notes, selectedMovies };
}

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return null;
    const found = getUsers().find((u) => u.email === email);
    return found ? { name: found.name, email: found.email } : null;
  });

  const [notes, setNotesetter] = useState<string | null>(() => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    return email ? loadUserData(email).notes : null;
  });

  const [selectedMovies, setSelectedMoviesState] = useState<string[]>(() => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    return email ? loadUserData(email).selectedMovies : [];
  });

  // Ref keeps saveNotes/saveSelectedMovies referentially stable (empty deps),
  // while still always writing to the CURRENTLY logged-in user's key.
  // Same reasoning as the original debounce-stability comment: if these
  // callbacks depended on `currentUser`, their identity would change on
  // every login/logout, which would be fine here (rare event) but this
  // pattern keeps things simple and consistent.
  const currentEmailRef = useRef<string | null>(currentUser?.email ?? null);
  useEffect(() => {
    currentEmailRef.current = currentUser?.email ?? null;
  }, [currentUser]);

  const signup = (userdetails: UserDetails): SignupResult => {
    const users = getUsers();
    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === userdetails.email.toLowerCase()
    );
    if (alreadyExists) {
      return {
        success: false,
        message: "An account with this email already exists. Try logging in instead.",
      };
    }

    const updatedUsers = [...users, userdetails];
    saveUsers(updatedUsers);
    localStorage.setItem(CURRENT_USER_KEY, userdetails.email);

    // Fresh, empty slate for this brand-new user — no bleed-over from
    // whichever account was previously logged in.
    localStorage.setItem(moviesKey(userdetails.email), JSON.stringify([]));
    localStorage.removeItem(notesKey(userdetails.email));

    currentEmailRef.current = userdetails.email;
    setCurrentUser({ name: userdetails.name, email: userdetails.email });
    setNotesetter(null);
    setSelectedMoviesState([]);

    return { success: true };
  };

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return false;

    localStorage.setItem(CURRENT_USER_KEY, found.email);
    currentEmailRef.current = found.email;
    setCurrentUser({ name: found.name, email: found.email });

    const { notes: loadedNotes, selectedMovies: loadedMovies } =
      loadUserData(found.email);
    setNotesetter(loadedNotes);
    setSelectedMoviesState(loadedMovies);

    return true;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    currentEmailRef.current = null;
    setCurrentUser(null);
    setNotesetter(null);
    setSelectedMoviesState([]);
  };

  const saveNotes = useCallback((value: string | null) => {
    const email = currentEmailRef.current;
    if (email) {
      if (value === null) {
        localStorage.removeItem(notesKey(email));
      } else {
        localStorage.setItem(notesKey(email), value);
      }
    }
    setNotesetter(value);
  }, []);

  const saveSelectedMovies = useCallback((movies: string[]) => {
    const email = currentEmailRef.current;
    if (email) {
      localStorage.setItem(moviesKey(email), JSON.stringify(movies));
    }
    setSelectedMoviesState(movies);
  }, []);

  return (
    <Data.Provider
      value={{
        signup,
        login,
        logout,
        currentUser,
        notes,
        saveNotes,
        selectedMovies,
        saveSelectedMovies,
      }}
    >
      {children}
    </Data.Provider>
  );
};

export { AuthContext, Data };
