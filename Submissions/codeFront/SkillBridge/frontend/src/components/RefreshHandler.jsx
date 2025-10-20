import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'
import { useGetUserQuery } from '../features/user/userApiSlice'
import { setUser } from '../features/user/userSlice'
import { useLocation } from 'react-router'
import Loader from './Loader'

const RefreshHandler = () => {
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
    if (isSuccess && user && (location.pathname === "/login" || location.pathname === "/register" )) {
      console.log('runnn')
      navigate("/", { replace: true })
      return
    }

    // User not authenticated but on protected route
    if (isError && !isPublic && location.pathname !== "/") {
      navigate("/login", { replace: true })
      return
    }

    // Optional: Handle case where user is authenticated but not verified
    if (isSuccess &&  !isPublic) {
      // navigate("/verify-email") or show verification message
    }

  }, [isSuccess, isError, isLoading, data, location.pathname, navigate, dispatch, user])

  if (isError) {
    console.log('error on refresh handler: ', error)
  }

  if (isLoading) return <Loader />
  
  return <Outlet />
}

export default RefreshHandler