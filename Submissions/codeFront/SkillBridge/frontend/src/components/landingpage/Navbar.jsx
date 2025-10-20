import {Link} from "react-router-dom"
import ToggleTheme from "../../utils/ToggleTheme"
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router";
import { useLazyLogoutQuery } from "../../features/auth/authApiSlice.js"
import {setUser} from "../../features/user/userSlice.js"
import pic from "../../assets/pic.jpg"
import { useLazyGetUserQuery } from "../../features/user/userApiSlice.js";
const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const user = useSelector((state)=> state.user?.user)
const [logout] = useLazyLogoutQuery()

const [get] = useLazyGetUserQuery()

  const handleLogout = async () => {
    await logout().unwrap()    
    await get()
    dispatch(setUser({user:null}))
    navigate("/login", {replace:true})
      
  }

  return (
    <nav className='w-full flex bg-white dark:bg-zinc-800  justify-between items-center p-4 relative'>
        <Link to={"/"} className="text-xl font-bold uppercase">SkillBridge</Link>
          <div className="space-x-4 hidden top-12 md:flex">
          {!user?.name ? (
            <>
            <Link className="block" to={"/login"}>
            <button className='btn-secondary'>Login</button>
            </Link>
            <Link className="block" to={"/register"}>
            <button className='btn-primary'>Register</button>
            </Link>
            </>
          ):(
            <>
            <button onClick={handleLogout} className='btn-primary'>Logout</button>
            {user?.role === "teacher" && (
              <Link className="block" to={"/create"}>
            <button className='btn-primary'>Create a Course</button>
            </Link>
            )}
            <Link to={"/profile"} className=''>
              <img src={pic} className="w-12 rounded-full" />
            </Link>
            </>
          )}
            <ToggleTheme />
        </div>

        {/* HAMBURGER  */}
        <div className="space-y-1 md:hidden block" onClick={()=> setOpen(!open)}>
          <div className={`w-8 h-0.5 transition bg-black dark:bg-zinc-200 ${open && "rotate-45"}`}></div>
          <div className={`w-8 h-0.5 transition bg-black dark:bg-zinc-200  ${open && "invisible"}`}></div>
          <div className={`w-8 h-0.5 transition bg-black dark:bg-zinc-200 ${open && "-rotate-45 -translate-y-3"}`}></div>
        </div>

       {open && (
         <div className=" space-y-4  bg-primary rounded-2xl p-4  w-[90%] absolute top-12 flex flex-col justify-center items-center md:hidden">
            <Link to={"/login"}>
            <button className='btn-secondary w-full !text-white'>Login</button>
            </Link>
            <Link to={"/register"}>
            <button className='btn-primary !bg-white !text-black w-full'>Register</button>
            </Link>
            <ToggleTheme />
        </div>
       )}


    </nav>
  )
}

export default Navbar