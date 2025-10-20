import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../features/auth/authApiSlice";
import {setUser} from "../features/user/userSlice"
import { useLazyGetUserQuery } from "../features/user/userApiSlice";

const Register = () => {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role,  setRole] = useState('student')
	const [errorText, setErrorText] = useState("")
	const [register, { isError, error}] = useRegisterMutation()
	const [get] = useLazyGetUserQuery()
  
  
  
  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(!email || !name || !password || !role ){
      return setErrorText('All fields are required')
    }
    setErrorText("")
    const data = await register({email,name,password, role})
	console.log(data)
	await get()
    setUser(data?.data?.data?.user)
    navigate("/")
  }

	return (
		<section>
			<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
						Register your account
					</h2>
				</div>

			{isError &&(
					<p className="mt-2 mb-3 bg-red-400 text-white p-2 rounded-xl">{ (errorText || error?.data?.message)}</p>
			)}
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
						<div>
							<label
								htmlFor="name"
								className="block text-sm/6 font-medium text-gray-100"
							>
								Name
							</label>
							<div className="mt-2">
								<input
									onChange={(e)=> setName(e.target.value)}
									value={name}
									id="name"
									type="name"
									name="name"
									required
									autoComplete="name"
									className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm/6 font-medium text-gray-100"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									onChange={(e)=> setEmail(e.target.value)}
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
									onChange={(e)=> setPassword(e.target.value)}
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
							<div className="flex items-center justify-between">
								<label
									htmlFor="role"
									className="block text-sm font-medium text-gray-100"
								>
									Role
								</label>
							</div>
							<div className="mt-2 flex flex-col gap-2">
								<label className="flex items-center text-sm font-medium text-gray-100">
									<input
										id="student"
										type="radio"
										name="role"
										value="student"
										required
										className="mr-2"
										onChange={(e)=> setRole(e.target.value)}
									/>
									Student
								</label>
								<label className="flex items-center text-sm font-medium text-gray-100">
									<input
										id="teacher"
										type="radio"
										name="role"
										value="teacher"
										required
										className="mr-2"
										onChange={(e)=> setRole(e.target.value)}
									/>
									Teacher
								</label>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
							>
								Register
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm/6 text-gray-400">
						Already a member?
						<Link
							to={"/login"}
							className="font-semibold text-indigo-400 hover:text-indigo-300"
						>
							Login
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default Register;
