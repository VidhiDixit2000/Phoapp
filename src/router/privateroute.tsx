import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import {Data} from '../context/AuthContext.js';

const Privateroute = ({children}) => {
   const {user} = useContext(Data);

    const userExists =user? true:false;
  return (
    <div>
       {userExists? children:<Navigate to ="/signinPage"/>}
    </div>
  )
}

export default Privateroute
