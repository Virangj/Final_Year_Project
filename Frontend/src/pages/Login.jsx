import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const [login, setlogin] = useState({ email: "", password: "" })


  const navigate = useNavigate();
  const [error, seterror] = useState()
 
  const { authUser, signup1, login1 } = useAuthStore()

  const login_handlechange = (e) => {
    setlogin({ ...login, [e.target.name]: e.target.value })
  }



  const savelogin = async () => {
    // console.log(login)
    login1(login)
    // let res = await axiosInstance.post("/auth/login", login, { headers: { "Content-Type": "application/json" }, })
    // if (res.data._id) {
    //   await navigate("/")
    // }
    // else {
    //   console.log(res.data.message)
    //   seterror(res.data.message)
    // }

    // setlogin({ email: "", password: "" })
  }

  
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-[url('public/background_Image.png')] ">

        <div className="w-72  h-fit  my-auto sm:w-96 ">
          <h2 className="mt-3 text-center font-bold text-2xl text-white">
            Creative Threads
          </h2>
          <p className="my-2  text-center font-thin text-white">
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
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </div>
            </div>
            <label className="pl-4 mb-1 font-semibold">Email</label>
            <input
              className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2 "
              type="text"
              required
              value={login.email}
              onChange={login_handlechange}
              name="email"
            />
            <label className="pl-4 mb-1 font-semibold ">Password</label>
            <input
              className="bg-white   outline-none rounded-md mx-4 mb-2 pl-2"
              type="password"
              required
              value={login.password}
              onChange={login_handlechange}
              name="password"
            />
            {error && (
              <div className="text-red-700 font-light" mb-3>
                {error}
              </div>
            )}
            <div className="flex flex-row mb-3 w-full justify-between">
              <div className="flex pl-4 text-xs">
                <input type="checkbox" />
                <p className="pl-1 ">Remember me</p>
              </div>
              <div className="pr-4 text-xs cursor-pointer" onClick={()=>navigate("/emailaddress")}>Forget Password</div>
            </div>
            <button
              className="bg-black mx-4 rounded-md text-white h-8 mb-4  cursor-pointer  "
              onClick={savelogin}
            >
              Login
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;
