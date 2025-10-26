import React, { useContext } from 'react'
import { FaXmark } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa6";
import CustButton from './CustButton';
import CustInput from './CustInput';
import credContext from '../context/credential/credContext';

const CustDecryptModal = () => {

    const { masterPassword, setMasterPassword, setIsModal, handleVerifyMasterPass } = useContext(credContext);

    const handleDecryptModal = () => {
        setIsModal('viewCred')
    }

    const handleCloseDecryptModal = () => {
        setIsModal('')
    }
    
  return (
    <>
    <div className="bg-stone-00 w-dvw h-dvh absolute top-0 blur-xs backdrop-blur-xs ">
    </div>
      <div className="bg-indigo-50 p-5 sm:p-10 w-[90%] md:w-1/2 rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold">Master Credential</h2>
        <FaXmark className="text-xl sm:text-2xl cursor-pointer" onClick={handleCloseDecryptModal} />
      </div>
      <form onSubmit={handleVerifyMasterPass}>
        <div className="grid sm:grid-cols-2 gap-4">
        {/* <p className="border p-3 rounded-xl">Title:
          <a href="https://tyger.in" target='_blank' className='text-blue-600 underline underline-offset-2 ms-1'>https://tyger.in</a>
        </p> */}
        <p className="col-span-2 sm:col-span-1 border p-3 rounded-xl">Name: Ashutosh</p>
        <p className='col-span-2 text-[9px] sm:text-sm'>Need to Enter login password to <span className='font-semibold italic'>decrypt</span> Credential and view.</p>

        <CustInput label='Password' type='password' value={masterPassword} onChange={(e)=>setMasterPassword(e.target.value)} name='masterPassword' className='flex flex-col gap-1 col-span-2' />
        {/* <p className="border p-3 rounded-xl col-span-2">Password: 12345</p> */}
        </div>
        <div className="text-end mt-10">
        <CustButton className='bg-green-600 hover:bg-green-700 py-2 me-3' type='submit' label='Submit' />
        <CustButton className='bg-red-600 hover:bg-red-700 py-2' label='Cancel' type='button' onClick={handleCloseDecryptModal} />
        </div>
      </form>
      </div>
    </>
  )
}

export default CustDecryptModal