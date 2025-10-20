import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const RegisterComp = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cashier' // default role to match schema
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required('Firstname is required'),
    lastname: Yup.string().required('Lastname is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    role: Yup.string().oneOf(['admin', 'cashier']).required()
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // combine firstname + lastname to match server User.name
      const name = `${values.firstname.trim()} ${values.lastname.trim()}`.trim();

      const response = await axios.post('/api/auth/signup', {
        name,
        email: values.email,
        password: values.password,
        role: values.role // optional, server accepts enum ['admin','cashier']
      });

      toast.success(response.data?.message || 'Registered');
      if (response.data?.token) localStorage.setItem('token', response.data.token);
      if (response.data?.data) localStorage.setItem('user', JSON.stringify(response.data.data));

      resetForm();
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'An error occurred';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleGoogleRegister = () => {
  //   // backend auth routes are mounted under /api/auth
  //   window.location.href = 'http://localhost:3000/api/auth/google';
  // };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting, values }) => (
        <Form
          className="
            flex flex-col gap-2.5 m-auto mt-40 max-w-[350px] p-5 rounded-2xl relative
            bg-[#1a1a1a] text-white border border-[#333]
          "
          autoComplete="off"
        >
          <p className="title flex items-center pl-7 text-[28px] font-semibold tracking-tight relative text-[#ff4655]">
            Register
            <span className="absolute left-0 w-4 h-4 rounded-full bg-[#ff4655]"></span>
            <span className="absolute left-0 w-4 h-4 rounded-full bg-[#ff4655] animate-pulse"></span>
          </p>
          <p className="message text-[14.5px] text-white/70">Signup now and get full access to the app.</p>

          <div className="flex w-full gap-1.5">
            <div className="relative flex-1">
              <Field name="firstname" className="bg-[#333] text-white w-full pt-5 pb-1 pl-2.5 pr-1 outline-none border border-[rgba(105,105,105,0.397)] rounded-xl text-base peer" type="text" placeholder=" " />
              <label className="text-white/50 absolute left-2.5 top-0 text-[0.9em] cursor-text transition-all peer-placeholder-shown:top-3 peer-focus:text-[#ff4655] peer-focus:top-0 peer-focus:text-[0.7em] peer-focus:font-semibold peer-valid:text-[#ff4655] peer-valid:top-0 peer-valid:text-[0.7em] peer-valid:font-semibold">
                Firstname
              </label>
              <ErrorMessage name="firstname" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="relative flex-1">
              <Field name="lastname" className="bg-[#333] text-white w-full pt-5 pb-1 pl-2.5 pr-1 outline-none border border-[rgba(105,105,105,0.397)] rounded-xl text-base peer" type="text" placeholder=" " />
              <label className="text-white/50 absolute left-2.5 top-0 text-[0.9em] cursor-text transition-all peer-placeholder-shown:top-3 peer-focus:text-[#ff4655] peer-focus:top-0 peer-focus:text-[0.7em] peer-focus:font-semibold peer-valid:text-[#ff4655] peer-valid:top-0 peer-valid:text-[0.7em] peer-valid:font-semibold">
                Lastname
              </label>
              <ErrorMessage name="lastname" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          <div className="relative">
            <Field name="email" className="bg-[#333] text-white w-full pt-5 pb-1 pl-2.5 pr-1 outline-none border border-[rgba(105,105,105,0.397)] rounded-xl text-base peer" type="email" placeholder=" " />
            <label className="text-white/50 absolute left-2.5 top-0 text-[0.9em] cursor-text transition-all peer-placeholder-shown:top-3 peer-focus:text-[#ff4655] peer-focus:top-0 peer-focus:text-[0.7em] peer-focus:font-semibold peer-valid:text-[#ff4655] peer-valid:top-0 peer-valid:text-[0.7em] peer-valid:font-semibold">
              Email
            </label>
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="relative">
            <Field name="password" className="bg-[#333] text-white w-full pt-5 pb-1 pl-2.5 pr-1 outline-none border border-[rgba(105,105,105,0.397)] rounded-xl text-base peer" type="password" placeholder=" " />
            <label className="text-white/50 absolute left-2.5 top-0 text-[0.9em] cursor-text transition-all peer-placeholder-shown:top-3 peer-focus:text-[#ff4655] peer-focus:top-0 peer-focus:text-[0.7em] peer-focus:font-semibold peer-valid:text-[#ff4655] peer-valid:top-0 peer-valid:text-[0.7em] peer-valid:font-semibold">
              Password
            </label>
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="relative">
            <Field name="confirmPassword" className="bg-[#333] text-white w-full pt-5 pb-1 pl-2.5 pr-1 outline-none border border-[rgba(105,105,105,0.397)] rounded-xl text-base peer" type="password" placeholder=" " />
            <label className="text-white/50 absolute left-2.5 top-0 text-[0.9em] cursor-text transition-all peer-placeholder-shown:top-3 peer-focus:text-[#ff4655] peer-focus:top-0 peer-focus:text-[0.7em] peer-focus:font-semibold peer-valid:text-[#ff4655] peer-valid:top-0 peer-valid:text-[0.7em] peer-valid:font-semibold">
              Confirm password
            </label>
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="relative">
            <Field as="select" name="role" className="bg-[#333] text-white w-full p-2 outline-none border border-[rgba(105,105,105,0.397)] rounded-xl text-base">
              <option value="cashier">Cashier (default)</option>
              <option value="admin">Admin</option>
            </Field>
            <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
          </div>

          <button type="submit" disabled={isSubmitting} className="border-none outline-none py-2.5 rounded-xl text-white text-[16px] transition-colors duration-300 bg-[#ff4655] hover:bg-[#ff465596] disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <p className="signin text-[14.5px] text-white/70 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#ff4655] hover:underline hover:decoration-royalblue">Signin</Link>
          </p>

          {/* <div className="social-message flex items-center pt-4">
            <div className="line h-px flex-1 bg-gray-700"></div>
            <p className="message px-3 text-sm leading-5 text-gray-400">Or register with social accounts</p>
            <div className="line h-px flex-1 bg-gray-700"></div>
          </div> */}

          {/* <div className="social-icons flex justify-center mt-2">
            <button type="button" onClick={handleGoogleRegister} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Register with Google
            </button>
          </div> */}
        </Form>
      )}
    </Formik>
  );
};

export default RegisterComp;