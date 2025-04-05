import { useState } from 'react'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import { replace, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const Email_verification = () => {
    const [code, setcode] = useState()
    const [error, seterror] = useState()
    const navigate = useNavigate()
    const { checkAuth, authUser } = useAuthStore()

    const handlechange = (e) => {
        setcode(e.target.value)
    }
    const savecode = async () => {
        console.log(code)
        if (!code) {
            seterror("Enter 6 digit code")
            return;
        }
        try {
            const data = { email: authUser.email, code: code }
            await axiosInstance.post("/auth/verificationcode", data)
            await checkAuth()
            navigate("/", { replace: true })
            setcode("")
        } catch (error) {
            console.log(error.response.data.message)
            if (error.response.data.message) {
                seterror(error.response.data.message)
            }
        }
    };

    const back = () => {
        navigate("/signup")
    };

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center bg-[url('/background_Image.png')]  bg-cover">
                <div className='w-72  h-fit flex-col  my-auto sm:w-96 flex p-5 rounded-md bg-slate-300'>
                    <h2 className=' text-center font-bold text-2xl'>Creative Threads</h2>
                    <h4 className='mt-3 text-center font-medium text-xl'>Verify Your email address</h4>
                    <p className='mt-3 mb-4 text-center font-normal'>Enter the verification code we sent to shresthasagar@gmail.com. if you don't see it, check your spam folder</p>
                    <div className='relative mb-1'>
                        <span className='fixed -mt-3 ml-1.5 w-20 text-center text-blue-700 bg-slate-300'>Enter code</span>
                        <input type="text" value={code} onChange={handlechange} className=' w-full h-10 pl-2 border-2 border-blue-700 outline-none'></input>
                    </div>
                    {error && <p className=' text-red-600 text-xs'>{error}</p>}
                    <div className='flex justify-between h-8 mt-6'>
                        <button onClick={back} className='text-blue-700 font-medium   cursor-pointer'>Back</button>
                        <button onClick={savecode} className=' bg-blue-700 font-medium text-white text-center cursor-pointer w-20  rounded-md'>Next</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Email_verification