import React, {useContext,useMemo } from 'react';
import { Data } from '../context/AuthContext';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
    const context = useContext(Data);
const navigate = useNavigate();
if (!context) {
  throw new Error("This component must be wrapped in AuthContext");
}

const {saveNotes} = context;
 //useMemo controls creation of debounce,NOT execution of debounce.
  // However, if we use useffect, along with debounce, make value as dependency var, so it will run on each input change, which w edont want.And if we use Savenotes as dependency var and use callback in the auth context, then useffect wont run(coz unlike usememo, useffect handle both creation and execution of the function) and if we dont then debounce will be recreated on each render, which we dont want either.
  //We can use useref as well, coz it gets createdGets created once,Never recreated,Keeps its internal timer safely,No dependency confusion
const debounceSavednotes=useMemo(() => debounce((value:string)=>
 {
  
    saveNotes(value);
 },3000), [saveNotes]);
const handleonchange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = (event.target as HTMLInputElement).value;
    debounceSavednotes(value);
}
  return (
    <div>
      <div>
        <input type="text" placeholder="notes" onChange={handleonchange}/>
      </div>
     <div><button onClick={() => navigate("/moviewidget")}>Next</button></div>
    </div>
  )
}

export default Notes
