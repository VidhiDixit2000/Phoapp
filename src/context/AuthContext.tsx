import { createContext, useCallback, useState } from "react";

type UserDetails = {
  name: string;
  email: string;
  password: string;
};

 
type AuthContextType = {
  signup: (userdetails: UserDetails) => void;
  notes: string | null;
  saveNotes: (notes: string | null) => void;
};


const Data = createContext<AuthContextType | null>(null) ;



const AuthContext = ({ children }: { children: React.ReactNode }) => {

  const oldnote=localStorage.getItem("notes");

const [notes, setNotesetter] = useState<string|null>(oldnote);
// Before callback :Type → saveNotes → state change
// → context re-renders
// → Weather re-renders coz context re renders, memo runs
// → founds saveNotes reference changed
// → debounce recreated


// After callback :Type → saveNotes → state change
// → context re-renders
// → Weather re-renders coz context re renders, memo runs
// → Weather re-renders
// → saveNotes reference SAME
// → debounce stays SAME
const saveNotes=useCallback((currentnotes:string|null)=>{
  localStorage.setItem("notes", JSON.stringify(currentnotes));
 setNotesetter(currentnotes);
},[]);
  const signup = (userdetails: UserDetails) => {
    localStorage.setItem("userdet", JSON.stringify(userdetails));
    console.log("User signed up:", userdetails);
  };

  return (
    <Data.Provider value={{ signup, saveNotes, notes }}>
      {children}
    </Data.Provider>
  );
};

export { AuthContext, Data };
