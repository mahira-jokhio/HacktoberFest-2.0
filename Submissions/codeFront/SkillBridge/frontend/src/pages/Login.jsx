import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, } from "../features/auth/authApiSlice";
import { setUser } from "../features/user/userSlice";
import {useLazyGetUserQuery } from "../features/user/userApiSlice"

const Login = () => {
	const navigate = useNavigate()
    const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [login, {isLoading, isError, error, isSuccess}] = useLoginMutation()


  const [get] = useLazyGetUserQuery()

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!email || !password ){
      return console.log('all fields are required')
    }

    const data = await login({email,password})
    console.log('data', data)
    console.log("thid" ,error)
    if(data?.data?.data?.user){
        dispatch(setUser({...data?.data?.data?.user }))
		await get()
		navigate("/")
    }
    
  };

  

	return (
		<section>
			<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
						Sign in to your account
					</h2>
				</div>

                <div className="flex justify-center">
                    <p className="mt-2 bg-red-600  py-1.5 px-8 rounded-2xl ">{isError && error?.data?.message}</p>
                </div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={(e)=>handleSubmit(e)} action="#" method="POST" className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm/6 font-medium text-gray-100"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
                                    onChange={(e)=>setEmail(e.target.value)}
                                    value={email}
									id="email"
									type="email"
									name="email"
									required
									autoComplete="email"
									className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm/6 font-medium text-gray-100"
								>
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
                                onChange={(e)=>setPassword(e.target.value)}
                                    value={password}
									id="password"
									type="password"
									name="password"
									required
									autoComplete="current-password"
									className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
								/>
							</div>
						</div>

						<div>
							<button
                                disabled={isLoading}
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
							>
								{isLoading ? "Loading..." : "Sign in"}
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm/6 text-gray-400">
						Not a member?
						<Link
							to={"/register"}
							className="font-semibold text-indigo-400 hover:text-indigo-300"
						>
							Register
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default Login;
