import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'
import { setUser } from '../features/user/userSlice'
import { useLocation } from 'react-router'
import Loader from './Loader'
import { useGetUserQuery} from '../features/user/userApiSlice'

const TeacherHandler = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { data, isSuccess, isLoading, error, isError } = useGetUserQuery()
  const user = useSelector((state) => state.user.user)
  

  // Set user data once when query succeeds
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser({
         ...data.data,
      }))
    }
  }, [isSuccess, dispatch]) // Removed data from dependencies

  // Handle navigation logic
  useEffect(() => {
    if (isLoading) return

    const publicRoutes = ["/login", "/register"]
    const isPublic = publicRoutes.includes(location.pathname) 
    
    // User is authenticated and verified, but on login page
    if (isSuccess  && user && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/", { replace: true })
      return
    }

    // User not authenticated but on protected route
    if (isError && !isPublic && location.pathname !== "/" ) {
      navigate("/", { replace: true })
      return
    }

    if(user?.role !== 'teacher' || !user){
      navigate("/", { replace: true })
        return
    }

  }, [isSuccess, isError, isLoading, data, location.pathname, navigate, dispatch, user])

  if (isError) {
    console.log('error on teacher handler: ', error)
  }

  if (isLoading) return <Loader />
  
  return <Outlet />
}

export default TeacherHandler