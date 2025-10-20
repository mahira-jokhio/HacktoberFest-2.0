import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider, } from  'react-router-dom'
import RootLayout from "./layout/RootLayout"
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import RefreshHandler from './components/RefreshHandler'
import TeacherHandler from "./components/TeacherHandler"
import CreateCourse from './pages/CreateCourse'
import Profile from './pages/Profile'
import Course from './pages/Course'
function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<RefreshHandler />}>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path='/profile' element={<Profile />}/>
          <Route path='/course/:id' element={<Course />}/>


        <Route element={<TeacherHandler />}>
          <Route path='/create' element={<CreateCourse />}/>
        </Route>



        </Route>
        
        <Route path='*' element={<NotFound />} />
        </Route>
      </>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}

export default App
