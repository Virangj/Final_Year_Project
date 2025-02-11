import { useState } from 'react'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Email_verification = () => {
    const [code, setcode] = useState()
    const [error, seterror] = useState()
    const navigate = useNavigate()

    const handlechange = (e) => {
        setcode(e.target.value)
    }
    const savecode = async () => {
        console.log(code)
        if(!code) seterror("Enter 6 digit code")
        try {
            if (code) {
                const res = await axiosInstance.post("/verificationcode", code, { headers: { "Content-Type": "application/json" }, })
                navigate("/")
            }
        } catch (error) {
            seterror(res.data.message)
            toast.error(error)
        }

    }

    const back = () => {
        navigate("/signup")
    }
    return (
        <>
            <div className='w-full h-screen flex justify-center items-center'>
                <div className='w-72  h-fit flex-col  my-auto sm:w-96 flex'>
                    <h2 className='mt-3 text-center font-bold text-2xl'>Creative Threads</h2>
                    <h4 className='mt-3 text-center font-medium text-xl'>Verify Your email address</h4>
                    <p className='mt-3 mb-4 text-center font-normal'>Enter the verification code we sent to shresthasagar@gmail.com. if you don't see it, check your spam folder</p>
                    <div className='relative mb-1'>
                        <span className='fixed -mt-3 ml-1.5 bg-white w-20 text-center text-blue-700'>Enter code</span>
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