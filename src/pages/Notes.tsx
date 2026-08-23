import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Data } from '../context/AuthContext';
import { debounce } from 'lodash';


const Notes = () => {
    const context = useContext(Data);

if (!context) {
  throw new Error("This component must be wrapped in AuthContext");
}
const{notes}=context
const {saveNotes} = context;
const {currentUser} = context;

  // Two separate things:
  //   `draft` = what you see in the textarea, updated on every keystroke
  //   `notes` = what's persisted, written 3s after you stop typing
  // Binding the textarea straight to `notes` is what made typing feel broken:
  // React re-rendered with the old value before the debounce had saved the
  // new one, so characters vanished as you typed.
const [draft, setDraft] = useState(notes ?? '');

  // When the logged-in account changes, drop the previous user's draft and
  // load theirs instead. AuthContext sets currentUser and notes in the same
  // batch, so `notes` is already correct by the time this runs.
useEffect(() => {
  setDraft(notes ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentUser?.email]);

 //useMemo controls creation of debounce,NOT execution of debounce.
  // However, if we use useffect, along with debounce, make value as dependency var, so it will run on each input change, which we dont want.And if we use Savenotes as dependency var and use callback in the auth context, then useffect wont run(coz unlike usememo, useffect handle both creation and execution of the function) and if we dont then debounce will be recreated on each render, which we dont want either.
  //We can use useref as well, coz it gets created once,Never recreated,Keeps its internal timer safely,No dependency confusion
const debounceSavednotes=useMemo(() => debounce((value:string)=>
 {
  
    saveNotes(value);
 },3000), [saveNotes]);

  // Without this, typing and then immediately navigating away loses the
  // pending write — the 3s timer never fires because the component is gone.
  // flush() runs it now instead of dropping it.
useEffect(() => {
  return () => {
    debounceSavednotes.flush();
  };
}, [debounceSavednotes]);

const handleonchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = (event.target as HTMLTextAreaElement).value;
    setDraft(value);
    debounceSavednotes(value);
}
  return (
    <div>
      <div>
        <textarea value={draft} placeholder="Write your notes here" onChange={handleonchange}/>
      </div>
    </div>
  )
}

export default Notes