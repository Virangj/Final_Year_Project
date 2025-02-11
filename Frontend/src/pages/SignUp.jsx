import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const SignUp = () => {


    const [signup, setsignup] = useState({ username: "", email: "", password: "", role: "" })
    const navigate = useNavigate();

    const [error, seterror] = useState()
    const { authUser, signup1, login1 } = useAuthStore()



    const signup_handlechange = (e) => {
        setsignup({ ...signup, [e.target.name]: e.target.value })
    }






    const savesignup = async () => {
        // console.log(signup)
        signup1(signup)
        // let res = await axiosInstance.post("/auth/signup", signup, { headers: { "Content-Type": "application/json" }, })
        // console.log(res);    
        // if (res.data._id) {
        // console.log(res.data._id)
        //   set({authUser:true})
        //   await navigate("/")

        // }
        // else {
        //   console.log(res.data.message)
        //   seterror(res.data.message)
        // }

        // setsignup({ username: "", email: "", password: "", role: "" })

    }
    return (
        <>
            <div className="w-full h-screen flex justify-center items-center bg-[url('public/background_Image.png')] ">
                <div className="w-72  h-fit sm:w-96 ">
                    <h2 className="mt-3 text-center font-bold text-2xl text-white">
                        Creative Threads
                    </h2>
                    <p className="my-2 text-center font-thin text-white">
                        {" "}
                        A Thread that Connect Creativity
                    </p>
                    <div className="flex flex-col bg-slate-300 rounded-md  h-fit">
                        <div className="flex flex-row mb-3 h-10 w-full">
                            <div
                                className={
                                    "text-center font-semibold  w-1/2  pt-1 cursor-pointer"
                                }
                                onClick={() => navigate("/login")}
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
                            required
                            value={signup.username}
                            onChange={signup_handlechange}
                            name="username"
                        />
                        <label className="pl-4   mb-1 font-semibold">Email</label>
                        <input
                            className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2 "
                            type="text"
                            required
                            value={signup.email}
                            onChange={signup_handlechange}
                            name="email"
                        />
                        <label className="pl-4 mb-1 font-semibold ">Password</label>
                        <input
                            className="bg-white  outline-none  rounded-md mx-4 mb-2 pl-2"
                            type="password"
                            required
                            value={signup.password}
                            onChange={signup_handlechange}
                            name="password"
                        />
                        <label className="pl-4 mb-1 font-semibold ">Account Type</label>
                        <select
                            value={signup.role}
                            name="role"
                            required
                            onChange={signup_handlechange}
                            className="rounded-md mx-4 mb-3 pl-2 font-normal "
                        >
                            <option value="">Account Type</option>
                            <option value="normal"> User</option>
                            <option value="artist">Artist</option>
                        </select>
                        {error && (
                            <div className="text-red-700 font-light" mb-3>
                                {error}
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

            </div>
        </>
    );
};

export default SignUp;