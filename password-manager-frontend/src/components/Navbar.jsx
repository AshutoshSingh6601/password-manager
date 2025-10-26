import React, { useContext } from 'react'
import { FiLogOut } from "react-icons/fi";
import authContext from '../context/auth/authContext';
import credContext from '../context/credential/credContext';

const Navbar = () => {

    const { allCredential } = useContext(credContext)
    const { handleLogout } = useContext(authContext)

  return (
    <div className='flex justify-between items-center inset-ring inset-ring-zinc-200 bg-zinc-50 py-2 w-[95%] sm:w-2/3 mx-auto px-2 rounded-full'>
        <p>Hi<span className='font-semibold'>, {allCredential?.masterUser}</span> </p>
        <p><FiLogOut className='cursor-pointer' title='logout' onClick={handleLogout} /></p>
    </div>
  )
}

export default Navbar