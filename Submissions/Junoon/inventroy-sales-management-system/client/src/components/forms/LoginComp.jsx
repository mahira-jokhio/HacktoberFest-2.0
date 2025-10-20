import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const LoginComp = () => {
  const navigate = useNavigate();

  const initialValues = { email: '', password: '' };
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  // ...existing code...
  // ...existing code...
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin', values, { withCredentials: true });
      toast.success(response.data.message || 'Login successful');
      if (response.data?.token) localStorage.setItem('token', response.data.token);
      if (response.data?.data) localStorage.setItem('user', JSON.stringify(response.data.data));
      console.log('Login response:', response.data.data);
      navigate('/');
    } catch (error) {
      toast.error('❌ Invalid email or password. Please try again.', {
        style: { background: '#2d0a0a', color: '#fff' }
      });
      // const message =
      //   error.response?.data?.error ||
      //   error.response?.data?.message ||
      //   error.message ||
      //   'An error occurred';

      // if (
      //   message.toLowerCase().includes('invalid credentials') ||
      //   message.toLowerCase().includes('unauthorized') ||
      //   error.response?.status === 401
      // ) {
      //   toast.error('❌ Invalid email or password. Please try again.', {
      //     style: { background: '#2d0a0a', color: '#fff' }
      //   });
      // } else {
      //   toast.error(message);
      // }
    } finally {
      setSubmitting(false);
    }
  };
  // ...existing code...
  // ...existing code...

  // const handleGoogleLogin = () => {
  //   // redirect to backend OAuth endpoint
  //   window.location.href = 'http://localhost:3000/api/auth/google';
  // };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <div className="w-[320px] m-auto mt-40 rounded-xl bg-[#1a1a1a] p-8 text-gray-100">
          <p className="title text-center text-2xl font-bold leading-8 mb-0">Login</p>
          <Form className="form mt-6">
            <div className="input-group mt-1 text-sm leading-5">
              <label htmlFor="email" className="block text-gray-400 mb-1">Email</label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-700 outline-none bg-[#1a1a1a] py-3 px-4 text-gray-100 focus:border-[#ff4655]"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="input-group mt-1 text-sm leading-5">
              <label htmlFor="password" className="block text-gray-400 mb-1">Password</label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-700 outline-none bg-[#1a1a1a] py-3 px-4 text-gray-100 focus:border-[#ff4655]"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              <div className="forgot flex justify-end text-xs text-gray-400 mt-2 mb-3">
                <a rel="noopener noreferrer" href="#" className="text-gray-100 hover:underline hover:decoration-[#ff4655] text-[14px]">
                  Forgot Password ?
                </a>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="sign block w-full bg-[#ff4655] py-3 text-center text-gray-900 border-none rounded-md font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </Form>
          {/* <div className="social-message flex items-center pt-4">
            <div className="line h-px flex-1 bg-gray-700"></div>
            <p className="message px-3 text-sm leading-5 text-gray-400">Login with social accounts</p>
            <div className="line h-px flex-1 bg-gray-700"></div>
          </div> */}
          {/* <div className="social-icons flex justify-center mt-2">
            <button
              onClick={handleGoogleLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Login with Google
            </button> */}
          {/* </div> */}
          <p className="signup text-center text-xs leading-4 text-gray-400 mt-2">
            Don't have an account?
            <Link rel="noopener noreferrer" to="/register" className="text-gray-100 hover:underline hover:decoration-[#ff4655] text-[14px] ml-1">
              Sign up
            </Link>
          </p>
        </div>
      )}
    </Formik>
  );
};

export default LoginComp;