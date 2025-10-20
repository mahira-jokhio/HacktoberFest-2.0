import { Outlet } from "react-router-dom"
import Navbar from "../components/landingpage/Navbar"

const RootLayout = () => {
  return (
    <div className="bg-gray-100 dark:bg-zinc-900">
        <Navbar />
        <div className="container ">
            <Outlet />
        </div>
    </div>
  )
}

export default RootLayout