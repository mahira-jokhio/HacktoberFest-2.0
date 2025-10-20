import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard";

export default function App(){
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(()=> {
    const unsub = onAuthStateChanged(auth, (u)=> setUser(u));
    return unsub;
  }, []);

  if (!user) {
    return (
      <>
        <Navbar user={null} />
        <div style={{maxWidth:900, margin:"30px auto"}}>
          {showRegister ? <Register onSuccess={()=>setShowRegister(false)} /> : <Login onSuccess={()=>{}} />}
          <div style={{textAlign:"center", marginTop:12}}>
            <button className="btn" onClick={()=>setShowRegister(!showRegister)}>
              {showRegister ? "Have an account? Login" : "New? Register"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <Dashboard user={user} />
    </>
  );
}

