import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Login = () => {
  const [login, setlogin] = useState({ email: "", password: "" })
  const [check_login, check_setlogin] = useState(true)
  const [signup, setsignup] = useState({ username: "", email: "", password: "", role: "" })
  const navigate = useNavigate();
  const [loginres, setloginres] = useState()
  const [signupres, setsignupres] = useState()

  const login_handlechange = (e) => {
    setlogin({ ...login, [e.target.name]: e.target.value })
  }

  const signup_handlechange = (e) => {
    setsignup({ ...signup, [e.target.name]: e.target.value })
  }

  const Change = () => {
    check_setlogin(!check_login)
  }

  const setrole = async (e) => {
    setsignup({ ...signup, [e.target.name]: e.target.value })
  }

  const savelogin = async () => {
    console.log(login)
    let res = await axiosInstance.post("/auth/login", login, { headers: { "Content-Type": "application/json" }, })
    if (res.data._id) {
      navigate("/")
    }
    else {
      console.log(res.data.message)
      setloginres(res.data.message)
    }

    setlogin({ email: "", password: "" })
  }

  const savesignup = async () => {
    console.log(signup)
    let res = await axiosInstance.post("/auth/signup", signup, { headers: { "Content-Type": "application/json" }, })
    if (res.data._id) {
      console.log(res._id)
      navigate("/")

    }
    else {
      console.log(res.data.message)
      setsignupres(res.data.message)
    }

    setsignup({ username: "", email: "", password: "", role: "" })

  }
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-slate-600">
        {check_login ? (
          <div className="w-72  h-fit  my-auto sm:w-96 ">
            <h2 className="mt-3 text-center font-bold text-2xl">
              Creative Threads
            </h2>
            <p className="my-2  text-center font-thin">
              {" "}
              A Thread that Connect Creativity
            </p>
            <div className="flex flex-col bg-slate-300 rounded-md h-fit  ">
              <div className="flex flex-row mb-3  h-10 w-full">
                <div
                  className={
                    "text-center font-semibold  w-1/2 pt-1 border-b-2 border-black cursor-pointer"
                  }
                >
                  Login
                </div>
                <div
                  className={
                    "text-center font-semibold w-1/2 pt-1 cursor-pointer"
                  }
                  onClick={Change}
                >
                  Sign Up
                </div>
              </div>
              <label className="pl-4 mb-1 font-semibold">Email</label>
              <input
                className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2 "
                type="text"
                value={login.email}
                onChange={login_handlechange}
                name="email"
              />
              <label className="pl-4 mb-1 font-semibold ">Password</label>
              <input
                className="bg-white   outline-none rounded-md mx-4 mb-2 pl-2"
                type="password"
                value={login.password}
                onChange={login_handlechange}
                name="password"
              />
              {loginres && (
                <div className="text-red-700 font-light" mb-3>
                  {loginres}
                </div>
              )}
              <div className="flex flex-row mb-3 w-full justify-between">
                <div className="flex pl-4 text-xs">
                  <input type="checkbox" />
                  <p className="pl-1 ">Remember me</p>
                </div>
                <div className="pr-4 text-xs">Forget Password</div>
              </div>
              <button
                className="bg-black mx-4 rounded-md text-white h-8 mb-4  cursor-pointer  "
                onClick={savelogin}
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="w-72  h-fit sm:w-96 ">
            <h2 className="mt-3 text-center font-bold text-2xl">
              Creative Threads
            </h2>
            <p className="my-2 text-center font-thin">
              {" "}
              A Thread that Connect Creativity
            </p>
            <div className="flex flex-col bg-slate-300 rounded-md  h-fit">
              <div className="flex flex-row mb-3 h-10 w-full">
                <div
                  className={
                    "text-center font-semibold  w-1/2  pt-1 cursor-pointer"
                  }
                  onClick={Change}
                >
                  Login
                </div>
                <div
                  className={
                    "text-center font-semibold w-1/2 pt-1 border-b-2 border-black cursor-pointer"
                  }
                >
                  Sign Up
                </div>
              </div>
              <label className="pl-4 mb-1 font-semibold">UserName</label>
              <input
                className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2 "
                type="text"
                value={signup.username}
                onChange={signup_handlechange}
                name="username"
              />
              <label className="pl-4   mb-1 font-semibold">Email</label>
              <input
                className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2 "
                type="text"
                value={signup.email}
                onChange={signup_handlechange}
                name="email"
              />
              <label className="pl-4 mb-1 font-semibold ">Password</label>
              <input
                className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2"
                type="password"
                value={signup.password}
                onChange={signup_handlechange}
                name="password"
              />
              <label className="pl-4 mb-1 font-semibold ">Account Type</label>
              <select
                value={signup.role}
                name="role"
                onChange={setrole}
                className="rounded-md mx-4 mb-3 pl-2 font-normal "
              >
                <option value="">Account Type</option>
                <option value="normal"> User</option>
                <option value="artist">Artist</option>
              </select>
              {signupres && (
                <div className="text-red-700 font-light" mb-3>
                  {signupres}
                </div>
              )}

              <button
                className="bg-black mx-4 rounded-md text-white h-8 mb-4 cursor-pointer  "
                onClick={savesignup}
              >
                SignUp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
